import type { Mock, Mocked } from "vitest"
import { ArmServo } from "src/CubeRobot/Servo/ArmServo.js"

import type { Device } from "src/Device/Device.js"
import { MockDevice } from "src/Device/MockDevice.js"
import { config } from "src/config.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

config.DEVICE_TYPE = "mock"
config.ARM_SERVO_PIN = 1

vi.mock("src/Device/MockDevice.js")

describe("ArmServo", () => {
	
	let device: MockDevice
	let armServo: ArmServo
	
	beforeEach(() => {
		device = new MockDevice()
		armServo = new ArmServo(device)
		
		vi.clearAllMocks()
	})
	
	describe("constructor", () => {
		test("初期状態がreleaseであること", () => {
			expect(armServo["_state"]).toBe("release")
		})
	})
	
	describe("hold", () => {
		test("アームがholdの角度になり、stateがholdになること", async () => {
			await armServo.hold()
			expect(device.turn).toHaveBeenCalledWith(1, expect.any(Number), armServo["_ANGLE"].HOLD)
			expect(armServo["_state"]).toBe("hold")
		})
	})

	describe("release", () => {
		test("アームがreleaseの角度になり、stateがreleaseになること", async () => {
			await armServo.release()
			expect(armServo["_state"]).toBe("release")
			expect(device.turn).toHaveBeenCalledWith(1, expect.any(Number), armServo["_ANGLE"].RELEASE)
		})
	})

	describe("ready", () => {
		test("アームがreadyの角度になり、stateがreleaseになること", async () => {
			await armServo.ready()
			expect(armServo["_state"]).toBe("release")
			expect(device.turn).toHaveBeenCalledWith(1, expect.any(Number), armServo["_ANGLE"].READY)
		})
	})
	
	describe("turnX", () => {
		test("アームがhold -> pull -> holdの順で角度が変化し、最終的にstateがholdになること", async () => {
			await armServo.turnX()
			expect(armServo.isHold()).toBeTruthy()
			expect(device.turn).toHaveBeenNthCalledWith(1, 1, expect.any(Number), armServo["_ANGLE"].HOLD)
			expect(device.turn).toHaveBeenNthCalledWith(2, 1, expect.any(Number), armServo["_ANGLE"].PULL)
			expect(device.turn).toHaveBeenNthCalledWith(3, 1, expect.any(Number), armServo["_ANGLE"].HOLD)
		})
		
		test("指定した回数が範囲外の場合、エラーがスローされること", async () => {
			await expect(armServo.turnX(0)).rejects.toThrowError("Invalid X turn count: 0")
			await expect(armServo.turnX(5)).rejects.toThrowError("Invalid X turn count: 5")
		})
	})
	
	describe("isHold", () => {
		test("stateがholdの場合、trueを返すこと", async () => {
			await armServo.hold()
			const result = armServo.isHold()
			expect(result).toBeTruthy()
		})
		
		test("stateがhold以外の場合、falseを返すこと", async () => {
			await armServo.release()
			const result = armServo.isHold()
			expect(result).toBeFalsy()
		})
	})
	
	describe("isRelease", () => {
		test("stateがreleaseの場合、trueを返すこと", async () => {
			await armServo.release()
			const result = armServo.isRelease()
			expect(result).toBeTruthy()
		})
		
		test("stateがrelease以外の場合、falseを返すこと", async () => {
			await armServo.hold()
			const result = armServo.isRelease()
			expect(result).toBeFalsy()
		})
	})
})
