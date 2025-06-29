import type { M5Unified } from "opniz/dist/devices/M5Unified.js"
import { isRpcTuple } from "opniz/dist/devices/base/BaseDevice.js"
import type { RpcTuple } from "opniz/dist/devices/base/BaseDevice.js"
import { log, dbg, dev, sleep, AbortableSleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../../utils.js"
// import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export type DisplaySpec = {
	pxSize: number
	screenXSize: number
	screenYSize: number
}

const defaultDisplaySpec = {
	pxSize: 7,
	screenXSize: 320,
	screenYSize: 240,
}

export class AvatarCore {
	
	public readonly PX_SIZE: number
	public readonly CHAR_X_PX: number
	public readonly CHAR_Y_PX: number
	public readonly SCREEN_X_SIZE: number
	public readonly SCREEN_Y_SIZE: number
	
	public readonly CHAR_X_SIZE: number
	public readonly CHAR_Y_SIZE: number
	public readonly SCREEN_X_PX: number
	public readonly SCREEN_Y_PX: number
	
	public readonly CHAR_X_HALF_PX: number
	public readonly CHAR_Y_HALF_PX: number
	public readonly CHAR_X_HALF_SIZE: number
	public readonly CHAR_Y_HALF_SIZE: number
	public readonly SCREEN_X_HALF_SIZE: number
	public readonly SCREEN_Y_HALF_SIZE: number
	public readonly SCREEN_X_HALF_PX: number
	public readonly SCREEN_Y_HALF_PX: number
	
	public readonly CHAR_VERTICAL_CENTER_PX_LIST = {
		".": 6,
		"q": 5,
		"p": 5,
		"z": 5,
		"v": 5,
		"n": 5,
		"u": 5,
		"a": 5,
		"c": 5,
		"e": 5,
		"m": 5,
		"w": 5,
		"y": 5,
		"g": 5,
		"o": 5,
		"x": 5,
		"": 4,
		" ": 4,
		"l": 4,
		"O": 4,
		"-": 4,
		"=": 4,
		"+": 4,
		"*": 4,
		"/": 4,
		"\\": 4,
		">": 4,
		"<": 4,
		"?": 4,
		"!": 4,
		"@": 4,
		"_": 4,
		"~": 2,
		"^": 2,
		"'": 2,
		"`": 2,
		"\"": 2,
	} as const
	
	private readonly _opniz: M5Unified
	private readonly _abortableSleep: AbortableSleep
	
	constructor(opniz: M5Unified, displaySpec: DisplaySpec = defaultDisplaySpec) {
		this._opniz = opniz
		this._abortableSleep = new AbortableSleep()
		
		this.PX_SIZE = displaySpec.pxSize
		this.SCREEN_X_SIZE = displaySpec.screenXSize
		this.SCREEN_Y_SIZE = displaySpec.screenYSize
		
		this.CHAR_X_PX = 6
		this.CHAR_Y_PX = 8
		
		this.CHAR_X_SIZE = this.CHAR_X_PX * this.PX_SIZE
		this.CHAR_Y_SIZE = this.CHAR_Y_PX * this.PX_SIZE
		this.SCREEN_X_PX = this.SCREEN_X_SIZE / this.PX_SIZE
		this.SCREEN_Y_PX = this.SCREEN_Y_SIZE / this.PX_SIZE
		
		this.CHAR_X_HALF_PX = this.CHAR_X_PX / 2
		this.CHAR_Y_HALF_PX = this.CHAR_Y_PX / 2
		this.CHAR_X_HALF_SIZE = this.CHAR_X_SIZE / 2
		this.CHAR_Y_HALF_SIZE = this.CHAR_Y_SIZE / 2
		this.SCREEN_X_HALF_SIZE = this.SCREEN_X_SIZE / 2
		this.SCREEN_Y_HALF_SIZE = this.SCREEN_Y_SIZE / 2
		this.SCREEN_X_HALF_PX = this.SCREEN_X_PX / 2
		this.SCREEN_Y_HALF_PX = this.SCREEN_Y_PX / 2
	}
	
	
	
	private _convertColor16(color24: number | undefined): number | undefined {
		if (!color24) return undefined
		return (color24 >> 8 & 0xf800) | (color24 >> 5 & 0x7e0) | (color24 >> 3 & 0x1f)
	}
	
	private _is2DArray(array: any[]) {
		return Array.isArray(array) &&
			array.length > 0 &&
			array.every(subArray => Array.isArray(subArray) && subArray.length > 0) &&
			array.map(subArray => subArray.every(value => !Array.isArray(value))).every(subArray => subArray)
	}
	
	
	
	public async sleep(ms: number): Promise<void> {
		await this._abortableSleep.sleep(ms, { throwError: true })
	}
	
	public abortSleep(): void {
		this._abortableSleep.abort()
	}
	
	public resetAbortSleep(): void {
		this._abortableSleep.resetController()
	}
	
	
	
	public async init(rotation = 1) {
		await this.exec([
			this._opniz.Display.clearDisplay.rpc(),
			this._opniz.Display.setTextSize.rpc(this.PX_SIZE),
			this._opniz.Display.setRotation.rpc(rotation),
		])
	}
	
	
	
	public draw(x: number, y: number, char: string): RpcTuple[] {
		// log("[draw]", {x, y, char})
		return [
			this._opniz.Display.setTextColor.rpc(this._convertColor16(0xffffff)),
			this._opniz.Display.drawCentreString.rpc(char, x, y),
		]
	}
	
	public erase(x: number, y: number, char: string): RpcTuple[] {
		// log("[erase]", {x, y, char})
		return [
			this._opniz.Display.setTextColor.rpc(0),
			this._opniz.Display.drawCentreString.rpc(char, x, y),
		]
	}
	
	
	
	public async exec(rpcArray: RpcTuple[]): Promise<void> {
		// log(rpcArray)
		if (rpcArray.length < 1 ||
			!this._is2DArray(rpcArray) ||
			!rpcArray.every(rpc => isRpcTuple(rpc))
		) throw Error("Argument is not RPC Array array!")
		
		// log(rpcArray)
		await this._opniz.sendRpc(rpcArray.map(rpc => this._opniz.createRpcRequest(rpc)))
	}
	
}
