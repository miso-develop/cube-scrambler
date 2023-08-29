import type { Mock, Mocked } from "vitest"
import { CubeRobot } from "src/CubeRobot/CubeRobot.js"

import { StandServo } from "src/CubeRobot/Servo/StandServo.js"
import { ArmServo } from "src/CubeRobot/Servo/ArmServo.js"
import { Device } from "src/Device/Device.js"
import { MockDevice } from "src/Device/MockDevice.js"
import { config } from "src/config.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

config.DEVICE_TYPE = "mock"

vi.mock("src/Device/MockDevice.js")
vi.mock("src/CubeRobot/Servo/StandServo.js")
vi.mock("src/CubeRobot/Servo/ArmServo.js")

describe("CubeRobot", () => {
	let cubeRobot: CubeRobot
	
	beforeEach(() => {
		cubeRobot = new CubeRobot()
		
		vi.clearAllMocks()
	})
	
	describe("connect", () => {
		test("connectメソッドは、Device.connectWaitを呼び出します", async () => {
			await cubeRobot.connect()
			expect(cubeRobot.device.connectWait).toHaveBeenCalled()
		})
	})
	
	describe("init", () => {
		test("initメソッドは、standServoを初期化し、readyを呼び出します", async () => {
			await cubeRobot.init()
			expect(cubeRobot["_standServo"].init).toHaveBeenCalled()
			expect(cubeRobot["_armServo"].ready).toHaveBeenCalled()
		})
	})
	
	describe("ready", () => {
		test("readyメソッドは、ArmServoを使用してアームを最大まで上げます", async () => {
			await cubeRobot.ready()
			expect(cubeRobot["_armServo"].ready).toHaveBeenCalled()
		})
	})
	
	describe("d", () => {
		test("dメソッドは、ArmServoを保持し、StandServoでturnD動作を行います", async () => {
			await cubeRobot.d(3)
			expect(cubeRobot["_armServo"].isHold).toHaveBeenCalled()
			expect(cubeRobot["_standServo"].turnD).toHaveBeenCalledWith(3)
		})
	})
	
	describe("dp", () => {
		test("dpメソッドは、ArmServoを保持し、StandServoでturnDP動作を行います", async () => {
			await cubeRobot.dp(2)
			expect(cubeRobot["_armServo"].isHold).toHaveBeenCalled()
			expect(cubeRobot["_standServo"].turnDP).toHaveBeenCalledWith(2)
		})
	})
	
	describe("x", () => {
		test("xメソッドは、ArmServoのturnXを呼び出し、_faceOrientationのrotateXを使用して_faceStateを更新します", async () => {
			await cubeRobot.x(1)
			expect(cubeRobot["_armServo"].turnX).toHaveBeenCalledWith(1)
		})
	})
	
	describe("y", () => {
		test("yメソッドは、ArmServoをリリースし、StandServoでturnDP動作を行い、_faceOrientationのrotateYを使用して_faceStateを更新します", async () => {
			await cubeRobot.y(2)
			expect(cubeRobot["_armServo"].release).toHaveBeenCalled()
			expect(cubeRobot["_standServo"].turnDP).toHaveBeenCalledWith(2)
		})
	})
	
	describe("yp", () => {
		test("ypメソッドは、ArmServoをリリースし、StandServoでturnD動作を行い、_faceOrientationのrotateYを使用して_faceStateを更新します", async () => {
			await cubeRobot.yp(3)
			expect(cubeRobot["_armServo"].release).toHaveBeenCalled()
			expect(cubeRobot["_standServo"].turnD).toHaveBeenCalledWith(3)
		})
	})
	
	
	
	describe("device", () => {
		test("deviceインスタンスをプロパティにもつこと", async () => {
			const expected = cubeRobot.device instanceof MockDevice
			expect(expected).toBeTruthy()
		})
	})
	
})
