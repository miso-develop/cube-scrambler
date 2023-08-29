import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

export class FaceOrientation {
	
	private static readonly _REVERSE_FACE_PATTERN = {
		"U": "D",
		"R": "L",
		"F": "B",
		"D": "U",
		"L": "R",
		"B": "F",
	} as const satisfies { [K in Face]: Face }
	
	
	
	public static getFullface(state: CubeState): FullFace {
		const { u, r, f } = state
		return {
			u, r, f,
			d: this._REVERSE_FACE_PATTERN[u],
			l: this._REVERSE_FACE_PATTERN[r],
			b: this._REVERSE_FACE_PATTERN[f],
		}
	}
	
	
	
	public static rotateX(state: CubeState, count: number): CubeState {
		const faceLine = this._getFaceLineX(state)
		return {
			...state,
			u: faceLine.slice(count % 4)[0],
			f: faceLine.slice((count + 1) % 4)[0],
		}
	}
	
	public static rotateY(state: CubeState, count: number): CubeState {
		const faceLine = this._getFaceLineY(state)
		return {
			...state,
			f: faceLine.slice(count % 4)[0],
			r: faceLine.slice((count + 1) % 4)[0],
		}
	}
	
	public static rotateZ(state: CubeState, count: number): CubeState {
		const faceLine = this._getFaceLineZ(state)
		return {
			...state,
			r: faceLine.slice(count % 4)[0],
			u: faceLine.slice((count + 1) % 4)[0],
		}
	}
	
	
	
	public static findFacePosition(state: CubeState, face: Face): FacePosition {
		const fullFace = this.getFullface(state)
		return Object.entries(fullFace)
			.filter(([statePosition, stateFace]) => stateFace === face)
			.map(([statePosition]) => statePosition)[0] as FacePosition
	}
	
	
	
	private static _getFaceLineX(state: CubeState): FaceLine {
		const { u, r, f } = state
		return [
			u,
			f,
			this._REVERSE_FACE_PATTERN[u],
			this._REVERSE_FACE_PATTERN[f],
		]
	}
	
	private static _getFaceLineY(state: CubeState): FaceLine {
		const { u, r, f } = state
		return [
			f,
			r,
			this._REVERSE_FACE_PATTERN[f],
			this._REVERSE_FACE_PATTERN[r],
		]
	}
	
	private static _getFaceLineZ(state: CubeState): FaceLine {
		const { u, r, f } = state
		return [
			r,
			u,
			this._REVERSE_FACE_PATTERN[r],
			this._REVERSE_FACE_PATTERN[u],
		]
	}
	
}
