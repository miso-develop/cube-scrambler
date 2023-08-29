import { config } from "../../config.js"
import { z } from "zod"
import type { Device } from "../../Device/Device.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

export class ArmServo {
	
	private readonly _device: Device
	
	private _pin: number
	private _state: ArmState
	
	private readonly _PWM_CHANNEL = config.ARM_PWM_CHANNEL || 1
	
	private readonly _ANGLE = {
		PULL: config.ARM_PULL_ANGLE || 173,
		HOLD: config.ARM_HOLD_ANGLE || 220,
		RELEASE: config.ARM_RELEASE_ANGLE || 237,
		READY: config.ARM_READY_ANGLE || 270,
	} as const satisfies { [key: string]: number }
	
	private readonly _TURN_X_MAX_COUNT = config.ARM_TURN_X_MAX_COUNT || 3
	
	private readonly _PULL_SLEEP_MSEC = config.ARM_PULL_SLEEP_MSEC || 200
	
	
	
	constructor(device: Device) {
		this._device = device
		this._state = "release"
	}
	
	
	
	// MEMO: angleはthis._ANGLEで定義したものが必ず入るためOver angleは発生しないので、戻り値型はbooleanではなくvoid
	private async _turn(angle: number): Promise<void> {
		this._pin = this._pin || (config.ARM_SERVO_PIN === "default" ? this._device.ARM_SERVO_PIN : config.ARM_SERVO_PIN)
		
		await this._device.turn(this._pin, this._PWM_CHANNEL, angle)
		this._state = angle >= this._ANGLE.RELEASE ? "release" : "hold"
	}
	
	
	
	private async _pull(): Promise<void> {
		await this._turn(this._ANGLE.PULL)
		await this._device.sleep(this._PULL_SLEEP_MSEC) // MEMO: pull補正sleep
	}
	
	public async hold(): Promise<void> {
		await this._turn(this._ANGLE.HOLD)
	}
	
	public async release(): Promise<void> {
		await this._turn(this._ANGLE.RELEASE)
	}
	
	public async ready(): Promise<void> {
		await this._turn(this._ANGLE.READY)
	}
	
	
	
	private _validateTurnCount(count: number): void {
		if (!z.number().min(1).max(this._TURN_X_MAX_COUNT).safeParse(count).success) throw Error(`Invalid X turn count: ${count}`)
	}
	
	public async turnX(count: number = 1): Promise<void> {
		this._validateTurnCount(count)
		
		for (let i = 0; i < count; i++) {
			if (!this.isHold()) await this.hold()
			await this._pull()
			await this.hold()
		}
	}
	
	
	
	public isHold(): boolean {
		return this._state === "hold"
	}
	
	public isRelease(): boolean {
		return this._state === "release"
	}
	
}
