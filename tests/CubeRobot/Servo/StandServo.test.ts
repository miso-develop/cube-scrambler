import type { Mock, Mocked } from "vitest"
import { StandServo } from "src/CubeRobot/Servo/StandServo.js"

import type { Device } from "src/Device/Device.js"
import { MockDevice } from "src/Device/MockDevice.js"
import { config } from "src/config.js"
import { Servo } from "src/Opniz/Servo.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

config.DEVICE_TYPE = "mock"
config.STAND_SERVO_PIN = 1

vi.mock("src/Device/MockDevice.js")

describe("StandServo", () => {
	
	const MAX_ANGLE = config.SERVO_SPEC_ANGLE || 270
	const CORRECT_ANGLE = config.STAND_CORRECT_ANGLE || 12
	const TURN_ANGLE = config.STAND_TURN_ANGLE || 86
	const INIT_ANGLE = CORRECT_ANGLE + (TURN_ANGLE * 2)
	
	let device: MockDevice
	let servo: Servo
	let standServo: StandServo
	
	beforeEach(() => {
		device = new MockDevice()
		servo = new Servo(device)
		standServo = new StandServo(device)
		
		vi.clearAllMocks()
	})
	
	describe("angle", () => {
		test("初期化時に正しい角度が設定されていること", () => {
			const result = standServo["_angle"]
			expect(result).toBe(standServo["_INIT_ANGLE"])
		})
	})
	
	describe("init", () => {
		test("initメソッドを呼び出すと、angleが_INIT_ANGLEに設定されること", async () => {
			await standServo.init()
			expect(standServo["_angle"]).toBe(standServo["_INIT_ANGLE"])
		})
	})
	
	describe("turnD", () => {
		test("サーボをDにカウント回数まわす", async () => {
			await standServo.turnD(1)
			const angle = INIT_ANGLE + TURN_ANGLE * 1
			expect(device.turn).toHaveBeenCalledTimes(1)
			expect(device.turn).toHaveBeenCalledWith(1, expect.any(Number), angle)
		})
		
		test("サーボの範囲外の角度になった場合、270度反転する", async () => {
			! (standServo["_device"].turn as Mock).mockImplementation((pin: number, channel: number, angle: number) => servo.validateAngle(angle))
			const angle = INIT_ANGLE + TURN_ANGLE * 2 - TURN_ANGLE * 4
			await standServo.turnD(2)
			expect(device.turn).toHaveBeenCalledTimes(2)
			expect(device.turn).toHaveBeenLastCalledWith(1, expect.any(Number), angle)
		})
	
		test("指定した回数が範囲外の場合、エラーがスローされること", async () => {
			await expect(standServo.turnD(0)).rejects.toThrowError()
			await expect(standServo.turnD(5)).rejects.toThrowError()
		})
	})
	
	describe("turnDP", () => {
		test("サーボをD'にカウント回数まわす", async () => {
			await standServo.turnDP(2)
			const angle = INIT_ANGLE - TURN_ANGLE * 2
			expect(device.turn).toHaveBeenCalledTimes(1)
			expect(device.turn).toHaveBeenCalledWith(1, expect.any(Number), angle)
		})
		
		test("サーボの範囲外の角度になった場合、270度反転する", async () => {
			! (standServo["_device"].turn as Mock).mockImplementation((pin: number, channel: number, angle: number) => servo.validateAngle(angle))
			const angle = INIT_ANGLE - TURN_ANGLE * 2 - TURN_ANGLE * 2 + TURN_ANGLE * 4
			await standServo.turnDP(2)
			await standServo.turnDP(2)
			expect(device.turn).toHaveBeenCalledTimes(3)
			expect(device.turn).toHaveBeenLastCalledWith(1, expect.any(Number), angle)
		})
		
		test("指定した回数が範囲外の場合、エラーがスローされること", async () => {
			await expect(standServo.turnDP(0)).rejects.toThrowError()
			await expect(standServo.turnDP(3)).rejects.toThrowError()
		})
	})
	
})
