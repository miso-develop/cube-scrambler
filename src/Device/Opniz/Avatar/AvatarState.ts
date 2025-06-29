import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../../utils.js"
// import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class AvatarState {
	private _initialized: boolean
	private _stopping: boolean
	
	constructor() {
		this._initialized = false
		this._stopping = false
	}
	
	
	
	public isInitialized(): boolean {
		return this._initialized
	}
	
	public isStopping(): boolean {
		return this._stopping
	}
	
	
	
	public initialize(): void {
		this._initialized = true
	}
	
	public updateStopping(state: boolean): void {
		this._stopping = state
	}
	
}
