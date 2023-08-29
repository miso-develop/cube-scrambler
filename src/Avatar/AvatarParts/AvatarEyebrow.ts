import type { M5Unified } from "opniz/dist/devices/M5Unified.js"
import type { AvatarCore } from "../AvatarCore.js"
import { isRpcTuple } from "opniz/dist/devices/base/BaseDevice.js"
import type { RpcTuple } from "opniz/dist/devices/base/BaseDevice.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"
// import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export const EYEBROW_LIST = ["", "\\", "/", "-", "=", "^", "~", "'", "`"] as const
export type Eyebrow = (typeof EYEBROW_LIST)[number]
export type Eyebrows = [Eyebrow, Eyebrow]

export class AvatarEyebrow {
	private readonly _core: AvatarCore
	
	private _current: [
		{
			x: number
			y: number
			char: Eyebrow
		},
		{
			x: number
			y: number
			char: Eyebrow
		},
	] = [{ x: -1, y: -1, char: ""}, { x: -1, y: -1, char: ""}]
	
	constructor(core: AvatarCore) {
		this._core = core
	}
	
	
	
	public getCurrent(): [{ x: number; y: number; char: Eyebrow }, { x: number; y: number; char: Eyebrow }] {
		return this._current
	}
	
	
	
	public offsetDraws(x: number, y: number): RpcTuple[] {
		return [
			this.offsetDraw(0, x, y ),
			this.offsetDraw(1, x, y ),
		].flat()
	}
	
	public offsetDraw(position: number, x: number, y: number): RpcTuple[] {
		const { char } = this._current[position]
		return this.draw(position, char, { x, y })
	}
	
	
	
	public draws(eyebrows?: Eyebrows | Eyebrow, offset?: { x:number; y: number }): RpcTuple[] {
		if (typeof eyebrows === "string") eyebrows = [eyebrows, eyebrows]
		return [
			this.draw(0, eyebrows && eyebrows[0], offset),
			this.draw(1, eyebrows && eyebrows[1], offset),
		].flat()
	}
	
	public draw(
		position: number,
		char: Eyebrow = this._current[position].char,
		offset?: { x:number; y: number }
	): RpcTuple[] {
		const offsetXSize = (offset?.x ? offset.x : 0) * this._core.PX_SIZE
		const adjustRightXSize = this._core.PX_SIZE * -0.5
		const x = position === 0 ?
			(this._core.SCREEN_X_HALF_SIZE * 0.5) + offsetXSize :
			(this._core.SCREEN_X_HALF_SIZE * 1.5) + offsetXSize + adjustRightXSize
		
		const offsetYSize = (offset?.y ? offset.y : 0) * this._core.PX_SIZE
		const charVerticalCenterPx = this._core.CHAR_VERTICAL_CENTER_PX_LIST[char] || 4
		const adjustYSize = this._core.PX_SIZE * 1
		const y = (this._core.SCREEN_Y_SIZE / 6 * 1) - (charVerticalCenterPx * this._core.PX_SIZE) + offsetYSize + adjustYSize
		
		const rpcRequests = [
			this.erase(position),
			this._core.draw(x, y, char),
		].flat()
		this._current[position] = { x, y, char }
		
		return rpcRequests
	}
	
	
	
	public erases(): RpcTuple[] {
		return [
			this.erase(0),
			this.erase(1),
		].flat()
	}
	
	public erase(position): RpcTuple[] {
		const { x, y, char } = this._current[position]
		return this._core.erase(x, y, char)
	}
	
}
