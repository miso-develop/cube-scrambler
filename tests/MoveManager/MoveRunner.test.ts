import type { Mock, Mocked } from "vitest"
import { MoveRunner } from "src/MoveManager/MoveRunner.js"

import { CubeRobot } from "src/CubeRobot/CubeRobot.js"
import { Device } from "src/Device/Device.js"
import { MockDevice } from "src/Device/MockDevice.js"
import { MoveParser } from "src/MoveManager/MoveParser.js"
import { config } from "src/config.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

config.DEVICE_TYPE = "mock"

vi.mock("src/CubeRobot/CubeRobot.js")
vi.mock("src/Device/MockDevice.js")

const CubeRobotMock = CubeRobot as Mock
const DeviceMock = MockDevice as Mock

describe("MoveRunner", () => {
	let cubeRobotMock: Mocked<CubeRobot>
	let moveRunner: MoveRunner
	
	beforeEach(() => {
		cubeRobotMock = new CubeRobotMock()
		
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		cubeRobotMock.device = new DeviceMock()
		cubeRobotMock.device.isConnected = () => true
		
		moveRunner = new MoveRunner(cubeRobotMock)
		
		vi.clearAllMocks()
	})
	
	

	describe("run", () => {
		test("正しいロボットの動作が実行される", async () => {
			const moves: RobotMove[] = ["D", "D'", "x", "y", "y'"]
			const mockFunctions = ["d", "dp", "x", "y", "yp"]
			const mockSpies = mockFunctions.map(fn => vi.spyOn(cubeRobotMock, fn as any))
			await moveRunner.run(moves)
			
			mockSpies.forEach(spy => {
				expect(spy).toHaveBeenCalled()
			})
			expect(moveRunner["_cubeRobot"].device.emitRun).toHaveBeenCalled()
			expect(moveRunner["_cubeRobot"].ready).toHaveBeenCalled()
			expect(moveRunner["_cubeRobot"].device.emitStop).toHaveBeenCalled()
		})

		test("Cube Scramblerが既に実行中のときrunが呼ばれた場合はエラーを投げる", async () => {
			moveRunner["_state"] = MoveRunner.State.running
			await expect(moveRunner.run(["D"])).rejects.toThrow("Cube Scrambler is running!")
		})
		
		test("不正なロボットの動作が渡されたときエラーを投げる", async () => {
			const invalidMoves = ["Invalid" as RobotMove]
			await expect(moveRunner.run(invalidMoves)).rejects.toThrow("Invalid robot moves!")
		})
		
		// TODO:
		// test("run実行中に緊急停止", async () => {
		// 	const moves: RobotMove[] = ["D", "D'", "x", "y", "y'"]
		// 	const expected = () => Promise.all([
		// 		moveRunner.run(moves),
		// 		moveRunner.stop()
		// 	])
		// 	await expect(expected()).rejects.toThrow("Emergency stop!")
		// })
		
	})
	
	describe("stop", () => {
		test("stateがrunningだったらstoppingにする", () => {
			moveRunner["_state"] = MoveRunner.State.running
			moveRunner.stop()
			expect(moveRunner["_state"]).toBe(MoveRunner.State.stopping)
		})
		
		test("stateがrunningじゃなかったらなにもしない", () => {
			moveRunner["_state"] = MoveRunner.State.waiting
			moveRunner.stop()
			expect(moveRunner["_state"]).toBe(MoveRunner.State.waiting)
			
			moveRunner["_state"] = MoveRunner.State.stopping
			moveRunner.stop()
			expect(moveRunner["_state"]).toBe(MoveRunner.State.stopping)
		})
	})

	describe("isWaiting", () => {
		test("stateがrunningのときtrueを返す", () => {
			moveRunner["_state"] = MoveRunner.State.waiting
			const result = moveRunner.isWaiting()
			expect(result).toBe(true)
		})

		test("stateがrunningじゃないときfalseを返す", () => {
			moveRunner["_state"] = MoveRunner.State.running
			const result = moveRunner.isWaiting()
			expect(result).toBe(false)
		})
	})

	describe("isRunning", () => {
		test("stateがrunningのときtrueを返す", () => {
			moveRunner["_state"] = MoveRunner.State.running
			const result = moveRunner.isRunning()
			expect(result).toBe(true)
		})

		test("stateがrunningじゃないときfalseを返す", () => {
			moveRunner["_state"] = MoveRunner.State.stopping
			const result = moveRunner.isRunning()
			expect(result).toBe(false)
		})
	})

	describe("isStopping", () => {
		test("stateがrunningのときtrueを返す", () => {
			moveRunner["_state"] = MoveRunner.State.stopping
			const result = moveRunner.isStopping()
			expect(result).toBe(true)
		})

		test("stateがrunningじゃないときfalseを返す", () => {
			moveRunner["_state"] = MoveRunner.State.waiting
			const result = moveRunner.isStopping()
			expect(result).toBe(false)
		})
	})
	
})
