import type { CubeRobot } from "../CubeRobot/CubeRobot.js"
import { MoveRunner } from "./MoveRunner.js"
import { MoveConverter } from "./MoveConverter/MoveConverter.js"
import { MoveParser } from "./MoveParser.js"
import type { ParsedMove, ParsedRobotMove } from "./MoveParser.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class MoveManager {
	private readonly _runner: MoveRunner
	private readonly _converter: typeof MoveConverter
	private readonly _parser: typeof MoveParser
	
	constructor(cubeRobot: CubeRobot) {
		this._runner = new MoveRunner(cubeRobot)
		this._converter = MoveConverter
		this._parser = MoveParser
	}
	
	
	
	public async run(moves: RobotMove[]): Promise<void> {
		await this._runner.run(moves)
	}
	
	public stop(): void {
		this._runner.stop()
	}
	
	public isWaiting(): boolean {
		return this._runner.isWaiting()
	}
	
	public isRunning(): boolean {
		return this._runner.isRunning()
	}
	
	public isStopping(): boolean {
		return this._runner.isStopping()
	}
	
	
	
	public convert(moves: Move[]): RobotMove[] {
		return this._converter.convert(moves)
	}
	
	
	
	public isMoves(moves: string[]): moves is Move[] {
		return this._parser.isMoves(moves)
	}
	
	public isMove(move: string): move is Move {
		return this._parser.isMove(move)
	}
	
	public isRobotMoves(moves: string[]): moves is RobotMove[] {
		return this._parser.isRobotMoves(moves)
	}
	
	public isRobotMove(move: string): move is RobotMove {
		return this._parser.isRobotMove(move)
	}
	
	public parseMove(move: Move): ParsedMove {
		return this._parser.parseMove(move)
	}
	
	public parseRobotMove(move: RobotMove): ParsedRobotMove {
		return this._parser.parseRobotMove(move)
	}
	
	public parseSequence(sequence: string): Move[] {
		return this._parser.parseSequence(sequence)
	}
	
	public reverseSequence(sequence: string): string {
		return this._parser.reverseSequence(sequence)
	}
	
}
