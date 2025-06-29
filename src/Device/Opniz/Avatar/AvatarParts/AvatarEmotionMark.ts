import type { M5Unified } from "opniz/dist/devices/M5Unified.js"
import type { AvatarCore } from "../AvatarCore.js"
import { isRpcTuple } from "opniz/dist/devices/base/BaseDevice.js"
import type { RpcTuple } from "opniz/dist/devices/base/BaseDevice.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../../../utils.js"
// import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export const EMOTION_MARK_LIST = ["", " ", "?", "!", "z", "Z"]
export type EmotionMark = (typeof EMOTION_MARK_LIST)[number]

export class AvatarEmotionMark {
	private readonly _core: AvatarCore
	
	private _current: {
		x: number
		y: number
		char: EmotionMark
	} = { x: -1, y: -1, char: ""}
	
	constructor(core: AvatarCore) {
		this._core = core
	}
	
	
	
	public getCurrent(): { x: number; y: number; char: EmotionMark } {
		return this._current
	}
	
	
	
	public offsetDraw(x: number, y: number): RpcTuple[] {
		const { char } = this._current
		return this.draw(char, { x, y })
	}
	
	
	
	public draw(
		char: EmotionMark = this._current.char,
		offset?: { x:number; y: number }
	): RpcTuple[] {
		const offsetXSize = (offset?.x ? offset.x : 0) * this._core.PX_SIZE
		const adjustXSize = this._core.PX_SIZE * 0
		const x = this._core.SCREEN_X_SIZE - this._core.CHAR_X_HALF_SIZE + offsetXSize + adjustXSize
		
		const offsetYSize = (offset?.y ? offset.y : 0) * this._core.PX_SIZE
		const adjustYSize = this._core.PX_SIZE * 0
		const y = this._core.CHAR_Y_HALF_SIZE + offsetYSize + adjustYSize
		
		const rpcRequests = [
			this.erase(),
			this._core.draw(x, y, char),
		].flat()
		this._current = { x, y, char }
		
		return rpcRequests
	}
	
	
	
	public erase(): RpcTuple[] {
		const { x, y, char } = this._current
		return this._core.erase(x, y, char)
	}
	
}
