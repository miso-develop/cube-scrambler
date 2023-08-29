import type { Mock, Mocked } from "vitest"
import { Servo } from "src/Opniz/Servo.js"

import type { Device } from "src/Device/Device.js"
import { MockDevice } from "src/Device/MockDevice.js"
import { config } from "src/config.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"

type ServoSpec = {
	angle: number
	pulse: {
		max: number
		min: number
	}
}

vi.mock("src/Device/MockDevice.js")

const DeviceMock = MockDevice as Mock

describe("Servo", () => {
	
	let deviceMock: Mocked<Device>
	let servo: Servo
	
	beforeEach(() => {
		deviceMock = new DeviceMock()
		servo = new Servo(deviceMock)
		
		vi.clearAllMocks()
	})
	
	test("指定した角度でサーボを回し、ledcWrite パラメータを確認", async () => {
		const mockLedcWrite = vi.spyOn(deviceMock, "ledcWrite").mockResolvedValue(undefined)
		
		const pin = 0
		const channel = 0
		const angle = 180
		
		await servo.turn(pin, channel, angle)
		
		expect(mockLedcWrite).toHaveBeenCalledWith(
			pin,
			expect.any(Number),
			channel,
			expect.any(Number),
			expect.any(Number)
		)
	})
	
	test("指定した範囲内の角度を検証", () => {
		const validAngle = 135
		const invalidAngleLower = -10
		const invalidAngleUpper = 300
		
		expect(() => servo.validateAngle(validAngle)).not.toThrow()
		expect(() => servo.validateAngle(invalidAngleLower)).toThrow("Over min angle!")
		expect(() => servo.validateAngle(invalidAngleUpper)).toThrow("Over max angle!")
	})
	
	test("環境変数が設定されていない場合、デフォルト値を使用", () => {
		const servoSpec: ServoSpec = {
			angle: 270,
			pulse: {
				max: 2.4,
				min: 0.5,
			},
		}
		
		expect(servo.SERVO_SPEC).toEqual(servoSpec)
		expect(servo["_FREQUENCY"]).toEqual(400)
		expect(servo["_RESOLUTION_BITS"]).toEqual(12)
		expect(servo["_TURN_SLEEP_MSEC"]).toEqual(200)
	})
	
})
