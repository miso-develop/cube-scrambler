import { z } from "zod"
import type { Device } from "../Device/Device.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"

type ServoSpec = {
	angle: number
	pulse: {
		max: number
		min: number
	}
}

export class Servo {
	private readonly _device: Device
	
	private readonly _FREQUENCY = Number(process.env.SERVO_FREQUENCY) || 400
	private readonly _RESOLUTION_BITS = Number(process.env.SERVO_RESOLUTION_BITS) || 12
	
	public readonly SERVO_SPEC = {
		angle: Number(process.env.SERVO_SPEC_ANGLE) || 270,
		pulse: {
			max: Number(process.env.SERVO_SPEC_PLUS_MAX) || 2.4,
			min: Number(process.env.SERVO_SPEC_PLUS_MIN) || 0.5,
		},
	} as const satisfies ServoSpec
	
	private readonly _TURN_SLEEP_MSEC = Number(process.env.SERVO_TURN_SLEEP_MSEC) || 200
	
	
	
	constructor(device: Device) {
		this._device = device
	}
	
	
	
	public async turn(pin: number, channel: number, angle: number): Promise<void> {
		const duty = this._angle2duty(angle)
		await this._device.ledcWrite(pin, duty, channel, this._FREQUENCY, this._RESOLUTION_BITS)
		await this._device.sleep(this._TURN_SLEEP_MSEC) // MEMO: 補正sleep
	}
	
	public validateAngle(angle: number): void {
		z.number()
			.min(0, "Over min angle!")
			.max(this.SERVO_SPEC.angle, "Over max angle!")
			.parse(angle)
	}
	
	
	
	private _angle2duty(angle: number): number {
		this.validateAngle(angle)
		
		const angleRatio = angle / this.SERVO_SPEC.angle
		const pulseRange = this.SERVO_SPEC.pulse.max - this.SERVO_SPEC.pulse.min
		const pulse = angleRatio * pulseRange + this.SERVO_SPEC.pulse.min
		const cycleMSec = 1 / this._FREQUENCY * 1000
		const resolution = 2 ** this._RESOLUTION_BITS
		const duty = Math.round(pulse / cycleMSec * resolution)
		return duty
	}
	
}
