import { config } from "../../config.js"
import { z, ZodError } from "zod"
import type { Device } from "../../Device/Device.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

export class StandServo {
	
	private readonly _device: Device
	
	private _pin: number
	private _angle: number
	
	private readonly _PWM_CHANNEL = config.STAND_PWM_CHANNEL || 0
	
	private readonly _DIRECTION = config.STAND_DIRECTION || -1
	
	private readonly _CORRECT_ANGLE = config.STAND_CORRECT_ANGLE || 12
	private readonly _TURN_ANGLE = config.STAND_TURN_ANGLE || 86
	private readonly _INIT_ANGLE = this._CORRECT_ANGLE + (this._TURN_ANGLE * 2)
	
	private readonly _TURN_D_MAX_COUNT = config.STAND_TURN_D_MAX_COUNT || 2
	
	
	
	constructor(device: Device) {
		this._device = device
		this._angle = this._INIT_ANGLE
	}
	
	
	
	private async _turn(angle: number): Promise<boolean> {
		try {
			this._pin = this._pin || (config.STAND_SERVO_PIN === "default" ? this._device.STAND_SERVO_PIN : config.STAND_SERVO_PIN)
			
			await this._device.turn(this._pin, this._PWM_CHANNEL, angle)
			this._angle = angle
			// dbg({ angle: this._angle })
			return true
			
		} catch (e) {
			// dbg(e.message)
			if (e instanceof ZodError) return false
			throw e
		}
	}
	
	
	
	private async _turn90(count: number = 1, direction: TurnDirection = 1): Promise<void> {
		const gearCorrectionDirection = direction * this._DIRECTION
		
		const turnAngle = this._TURN_ANGLE * gearCorrectionDirection * count
		const nextAngle = this._angle + turnAngle
		// dbg({ count, direction, gearCorrectionDirection, currentAngle: this._angle, turnAngle, nextAngle })
		
		if (await this._turn(nextAngle)) {
			await this._device.sleep(200 * (Math.abs(count) - 1)) // MEMO: 補正sleep
			// dbg({ nextAngle, count, sleep: 200 * (Math.abs(count) - 1) })
			
		} else {
			const turnMaxCount = this._TURN_D_MAX_COUNT * 2
			if (Math.abs(count - turnMaxCount) > turnMaxCount) throw Error("Max rotation count exceeded!")
			await this._turn90(count - turnMaxCount, direction)
		}
	}
	
	public async init(): Promise<void> {
		await this._turn(this._INIT_ANGLE)
	}
	
	
	
	public async turnD(count: number = 1): Promise<void> {
		this._validateTurnCount(count)
		await this._turn90(count, -1)
	}
	
	public async turnDP(count: number = 1): Promise<void> {
		this._validateTurnCount(count)
		await this._turn90(count, 1)
	}
	
	private _validateTurnCount(count: number): void {
		if (!z.number().min(1).max(this._TURN_D_MAX_COUNT).safeParse(count).success) throw Error(`Invalid D turn count: ${count}`)
	}
	
}
