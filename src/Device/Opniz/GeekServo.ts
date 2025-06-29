import { config } from "../../config.js"
import { z } from "zod"
import type { OpnizDevice } from "./OpnizDevice.js"
import type { Servo } from "../Device.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"

type ServoSpec = {
	angle: number
	pulse: {
		max: number
		min: number
	}
}

export class GeekServo implements Servo {
	public readonly SERVO_SPEC = {
		angle: Number(config.SERVO_SPEC_ANGLE) || 270,
		pulse: {
			max: Number(config.SERVO_SPEC_PLUS_MAX) || 2.4,
			min: Number(config.SERVO_SPEC_PLUS_MIN) || 0.5,
		},
	} as const satisfies ServoSpec
	
	private readonly _TURN_SLEEP_MSEC = Number(config.SERVO_TURN_SLEEP_MSEC) || 200
	
	private readonly _device: OpnizDevice
	private readonly _pin: number
	private readonly _channel: number
	
	private readonly _FREQUENCY = Number(config.SERVO_FREQUENCY) || 400
	private readonly _RESOLUTION_BITS = Number(config.SERVO_RESOLUTION_BITS) || 12
	
	constructor(device: OpnizDevice, pin: number, channel: number) {
		this._device = device
		this._pin = pin
		this._channel = channel
	}
	
	
	
	public async turn(angle: number): Promise<void> {
		const duty = this._angle2duty(angle)
		// log(angle, duty) // DEBUG:
		await this._device.ledcWrite(this._pin, duty, this._channel, this._FREQUENCY, this._RESOLUTION_BITS)
		
		await sleep(this._TURN_SLEEP_MSEC) // MEMO: 補正sleep
	}
	
	
	
	private _validateAngle(angle: number): void {
		z.number()
			.min(0, "Over min angle!")
			.max(this.SERVO_SPEC.angle, "Over max angle!")
			.parse(angle)
	}
	
	private _angle2duty(angle: number): number {
		this._validateAngle(angle)
		
		const angleRatio = angle / this.SERVO_SPEC.angle
		const pulseRange = this.SERVO_SPEC.pulse.max - this.SERVO_SPEC.pulse.min
		const pulse = angleRatio * pulseRange + this.SERVO_SPEC.pulse.min
		const cycleMSec = 1 / this._FREQUENCY * 1000
		const resolution = 2 ** this._RESOLUTION_BITS
		const duty = Math.round(pulse / cycleMSec * resolution)
		return duty
	}
	
}
