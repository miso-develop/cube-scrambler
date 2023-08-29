import { config } from "../../config.js"
import { MoveParser } from "../MoveParser.js"
import { CubeRotationSimulator } from "./CubeRotationSimulator.js"
import { FaceOrientation } from "./FaceOrientation.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

type ConvertMovesAndRotate<T, U> = { moves: readonly T[]; rotate: U }
type ConvertTable<T, U> = { [prop: string]: ConvertMovesAndRotate<T, U> }

export class MoveConverter {
	
	private static readonly _BASIC_MOVE_CONVERT_TABLE = {
		"U": { moves: ["x2", "D"], rotate: undefined },
		"U'": { moves: ["x2", "D'"], rotate: undefined },
		"D": { moves: ["D"], rotate: undefined },
		"D'": { moves: ["D'"], rotate: undefined },
		"R": { moves: ["y'", "x", "D"], rotate: undefined },
		"R'": { moves: ["y'", "x", "D'"], rotate: undefined },
		"L": { moves: ["y", "x", "D"], rotate: undefined },
		"L'": { moves: ["y", "x", "D'"], rotate: undefined },
		"F": { moves: ["x3", "D"], rotate: undefined },
		"F'": { moves: ["x3", "D'"], rotate: undefined },
		"B": { moves: ["x", "D"], rotate: undefined },
		"B'": { moves: ["x", "D'"], rotate: undefined },
	} as const satisfies ConvertTable<RobotMove, undefined>
	
	private static readonly _WIDE_MOVE_CONVERT_TABLE = {
		"Uw": { moves: ["D"], rotate: "y" },
		"U'w": { moves: ["D'"], rotate: "y'" },
		"Dw": { moves: ["U"], rotate: "y'" },
		"D'w": { moves: ["U'"], rotate: "y" },
		"Rw": { moves: ["L"], rotate: "x" },
		"R'w": { moves: ["L'"], rotate: "x'" },
		"Lw": { moves: ["R"], rotate: "x'" },
		"L'w": { moves: ["R'"], rotate: "x" },
		"Fw": { moves: ["B"], rotate: "z" },
		"F'w": { moves: ["B'"], rotate: "z'" },
		"Bw": { moves: ["F"], rotate: "z'" },
		"B'w": { moves: ["F'"], rotate: "z" },
	} as const satisfies ConvertTable<Move, RotationMove>
	
	private static readonly _SLICE_MOVE_CONVERT_TABLE = {
		"M": { moves: ["R", "L'"], rotate: "x'" },
		"M'": { moves: ["R'", "L"], rotate: "x" },
		"E": { moves: ["U", "D'"], rotate: "y'" },
		"E'": { moves: ["U'", "D"], rotate: "y" },
		"S": { moves: ["F'", "B"], rotate: "z" },
		"S'": { moves: ["F", "B'"], rotate: "z'" },
	} as const satisfies ConvertTable<Move, RotationMove>
	
	private static readonly _CUBE_ROTATION_CONVERT_TABLE = {
		"x": { moves: [], rotate: "x" },
		"x'": { moves: [], rotate: "x'" },
		"y": { moves: [], rotate: "y" },
		"y'": { moves: [], rotate: "y'" },
		"z": { moves: [], rotate: "z" },
		"z'": { moves: [], rotate: "z'" },
	} as const satisfies ConvertTable<[], RotationMove>
	
	
	
	private static readonly _INIT_CUBE_STATE = {
		u: "U", r: "R", f: "F",
	} as const satisfies CubeState
	
	private static readonly _LAST_CORRECT_ORIENTATION = config.LAST_CORRECT_ORIENTATION
	
	
	
	private static _cubeRotationSimulator: typeof CubeRotationSimulator
	private static _faceOrientation: typeof FaceOrientation
	private static _moveParser: typeof MoveParser
	
	private static _cubeState: CubeState
	private static _robotCubeState: CubeState
	
	static {
		this._cubeRotationSimulator = CubeRotationSimulator
		this._faceOrientation = FaceOrientation
		this._moveParser = MoveParser
	}
	
	
	
	public static convert(moves: Move[]): RobotMove[] {
		this._init()
		
		const convertedMoves = moves.reduce((robotMoves: RobotMove[][], move: Move): RobotMove[][] =>
			[...robotMoves, this._convertRobotMoves(move)], [])
		
		if (this._LAST_CORRECT_ORIENTATION) convertedMoves.push(this._lastCorrectOrientation()) // MEMO: 最後にもとの向きに直す
		
		return convertedMoves.flat()
	}
	
	private static _init(): void {
		this._cubeState = this._INIT_CUBE_STATE
		this._robotCubeState = this._INIT_CUBE_STATE
	}
	
	
	
	// MEMO: MoveをRobotMoveへ変換する
	private static _convertRobotMoves(move: Move): RobotMove[] {
		
		// Moveから数字を分離
		const splitMoveAndNumber = this._splitIntoMoveAndNumber(move)
		const numberRemovedMove = splitMoveAndNumber.move
		const haveTwo = !!splitMoveAndNumber.number
		
		// moveのpositionをCubeRobotの回転状態上のpositionに置換したMoveに変換
		const relativeRobotPositionMove = this._convertRelativeRobotPosition(numberRemovedMove)
		// dbg({relativeRobotPositionMove})
		
		// Moveを1次変換（MoveTypeごとに変換movesとrotateのペアを返す）
		const convertedMovesAndRotate = this._convertMovesAndRotate(relativeRobotPositionMove)
		const convertedMoves = convertedMovesAndRotate.moves
		const convertedRotate = this._addTwoRotate(convertedMovesAndRotate.rotate, haveTwo)
		
		// Moveを2次変換（WideMove, SliceMoveは1次変換時にBasicMoveを返すのでさらにそれをRobotMoveへ変換）
		const robotMoves = [
			this._isBasicMove(relativeRobotPositionMove) ? this._convertRobotMoveFromBasicMove(convertedMoves as RobotMove[], haveTwo) : [],
			this._isWideMove(relativeRobotPositionMove) ? this._convertRobotMoveFromWideMove(convertedMoves as Move[], haveTwo) : [],
			this._isSliceMove(relativeRobotPositionMove) ? this._convertRobotMoveFromSliceMove(convertedMoves as Move[], haveTwo) : [],
		].flat()
		
		// cubeStateのrotation更新
		this._cubeState = this._cubeRotationSimulator.simulateCubeRotation(this._cubeState, convertedRotate)
		
		// dbg({cubeState: this._cubeState, robotCubeState: this._robotCubeState})
		// dbg({robotMoves})
		return robotMoves
	}
	
	
	
	private static _convertRobotMoveFromBasicMove(moves: RobotMove[], haveTwo: boolean): RobotMove[] {
		const robotMoves = this._addTwoMoves(moves, haveTwo)
		
		this._robotCubeState = this._cubeRotationSimulator.simulateRobotCubeRotations(this._robotCubeState, robotMoves)
		
		return robotMoves
	}
	
	private static _convertRobotMoveFromWideMove(moves: Move[], haveTwo: boolean): RobotMove[] {
		const basicMove = moves[0]
		const preRobotMoves = this._BASIC_MOVE_CONVERT_TABLE[basicMove].moves
		const robotMoves = this._addTwoMoves(preRobotMoves, haveTwo)
		
		this._robotCubeState = this._cubeRotationSimulator.simulateRobotCubeRotations(this._robotCubeState, robotMoves)
		
		return robotMoves
	}
	
	private static _convertRobotMoveFromSliceMove(moves: Move[], haveTwo: boolean): RobotMove[] {
		const basicMoves = moves
		const robotMoves = basicMoves.map(move => {
			const relativeRobotPositionMove = this._convertRelativeRobotPosition(move)
			const preRobotMoves = this._BASIC_MOVE_CONVERT_TABLE[relativeRobotPositionMove].moves
			const robotMoves = this._addTwoMoves(preRobotMoves, haveTwo)
			
			this._robotCubeState = this._cubeRotationSimulator.simulateRobotCubeRotations(this._robotCubeState, robotMoves)
			return robotMoves
		}).flat()
		
		return robotMoves
	}
	
	
	
	private static _splitIntoMoveAndNumber(move: Move): { move: Move; number: `${number}` | undefined } {
		const matchedMove = move.match(/(.*)(2)$/)
		return !matchedMove ?
			{ move, number: undefined } :
			{ move: matchedMove![1] as Move, number: matchedMove![2] as `${number}`}
	}
	
	private static _addTwoMoves(moves: RobotMove[], haveTwo: boolean): RobotMove[] {
		if (!haveTwo) return moves
		return moves.map(move => this._moveParser.parseRobotMove(move).position === "D" ? `${move}2` as RobotMove : move)
	}
	
	private static _addTwoRotate(rotate: RotationMove | undefined, haveTwo: boolean): RotationMove | undefined {
		return haveTwo && !!rotate ? `${rotate}2` as RotationMove : rotate
	}
	
	
	
	// MEMO: moveのpositionをCubeRobotの回転状態上のpositionに置換したMoveに変換
	private static _convertRelativeRobotPosition(move: Move): Move {
		if (!this._isBasicMove(move)) return move
		
		const parsedMove = this._moveParser.parseMove(move)
		const cubePosition = parsedMove.position.toLowerCase() // 回転記号から回転面の向きを抽出
		const cubeFace = this._faceOrientation.getFullface(this._cubeState)[cubePosition] // 主視点の回転面を取得
		const robotCubePosition = this._faceOrientation.findFacePosition(this._robotCubeState, cubeFace) // 主視点回転面が現在のキューブのどの向きにあるか取得
		const convertedRobotMove = move.replace(cubePosition.toUpperCase(), robotCubePosition.toUpperCase()) as Move
		
		// dbg({move, cubePosition, cubeFace, robotCubePosition, convertedRobotMove})
		return convertedRobotMove
	}
	
	
	
	// MEMO: MoveTypeごとに変換movesとrotateのペアを返す
	private static _convertMovesAndRotate(move: Move): ConvertMovesAndRotate<RobotMove | Move, RotationMove | undefined> {
		if (this._isBasicMove(move)) return this._BASIC_MOVE_CONVERT_TABLE[move]
		if (this._isWideMove(move)) return this._WIDE_MOVE_CONVERT_TABLE[move]
		if (this._isSliceMove(move)) return this._SLICE_MOVE_CONVERT_TABLE[move]
		if (this._isRotationMove(move)) return this._CUBE_ROTATION_CONVERT_TABLE[move]
		throw Error("Invalid move type!")
	}
	
	private static _isBasicMove(move: Move): move is BasicMove {
		return (BASIC_MOVE_LIST as readonly string[]).includes(move)
	}
	
	private static _isWideMove(move: Move): move is WideMove {
		return (WIDE_MOVE_LIST as readonly string[]).includes(move)
	}
	
	private static _isSliceMove(move: Move): move is SliceMove {
		return (SLICE_MOVE_LIST as readonly string[]).includes(move)
	}
	
	private static _isRotationMove(move: Move): move is RotationMove {
		return (ROTATION_MOVE_LIST as readonly string[]).includes(move)
	}
	
	
	
	// MEMO: Moves実行後にもCubeの向きを直すよう動かす
	private static _lastCorrectOrientation(): RobotMove[] {
		// まずF面をD面へもっていく
		const fullface = this._faceOrientation.getFullface(this._robotCubeState)
		const frontFacePosition = Object.entries(fullface).filter(([position, face]) => face === "F")[0][0].toUpperCase() as Move
		const frontFace2DownMoves = this._BASIC_MOVE_CONVERT_TABLE[frontFacePosition].moves.slice(0, -1)
		this._robotCubeState = this._cubeRotationSimulator.simulateRobotCubeRotations(this._robotCubeState, frontFace2DownMoves)
		
		// 次にD面をD面へもっていく
		const frontDownFullFace = this._faceOrientation.getFullface(this._robotCubeState)
		const downFacePosition = Object.entries(frontDownFullFace).filter(([position, face]) => face === "D")[0][0].toUpperCase() as Move
		const downFace2DownMoves = downFacePosition !== "F" ? this._BASIC_MOVE_CONVERT_TABLE[downFacePosition].moves.slice(0, -1) : ["y2", "x"]
		this._robotCubeState = this._cubeRotationSimulator.simulateRobotCubeRotations(this._robotCubeState, downFace2DownMoves)
		
		return [...frontFace2DownMoves, ...downFace2DownMoves]
	}
	
}
