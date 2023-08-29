import type { Mock, Mocked } from "vitest"
import { MoveManager } from "src/MoveManager/MoveManager.js"

import { MoveParser } from "src/MoveManager/MoveParser.js"
import type { ParsedMove, ParsedRobotMove } from "src/MoveManager/MoveParser.js"
import { MoveConverter } from "src/MoveManager/MoveConverter/MoveConverter.js"
import { MoveRunner } from "src/MoveManager/MoveRunner.js"
import { CubeRobot } from "src/CubeRobot/CubeRobot.js"
import { MockDevice } from "src/Device/MockDevice.js"
import { config } from "src/config.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

config.DEVICE_TYPE = "mock"

vi.mock("src/CubeRobot/CubeRobot.js")
vi.mock("src/Device/MockDevice.js")

const CubeRobotMock = CubeRobot as Mock
const DeviceMock = MockDevice as Mock

describe("MoveManager", () => {
	let cubeRobotMock: Mocked<CubeRobot>
	let moveManager: MoveManager
	
	beforeEach(() => {
		cubeRobotMock = new CubeRobotMock()
		
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		cubeRobotMock.device = new DeviceMock()
		cubeRobotMock.device.isConnected = () => true
		
		moveManager = new MoveManager(cubeRobotMock)
		
		vi.clearAllMocks()
	})
	
	
	
	describe("run", () => {
		test("CubeRobotのrunメソッドが呼ばれる", async () => {
			const runSpy = vi.spyOn(moveManager["_runner"], "run")
			const moves: RobotMove[] = ["D"]
			await moveManager.run(moves)
			expect(runSpy).toHaveBeenCalledWith(moves)
		})
	})
	
	describe("stop", () => {
		test("CubeRobotのstopメソッドが呼ばれる", () => {
			const stopSpy = vi.spyOn(moveManager["_runner"], "stop")
			moveManager.stop()
			expect(stopSpy).toHaveBeenCalled()
		})
	})
	
	describe("isWaiting", () => {
		test("CubeRobotのisWaitingメソッドが呼ばれる", () => {
			const isWaitingSpy = vi.spyOn(moveManager["_runner"], "isWaiting")
			moveManager.isWaiting()
			expect(isWaitingSpy).toHaveBeenCalled()
		})
	})
	
	describe("isRunning", () => {
		test("CubeRobotのisRunningメソッドが呼ばれる", () => {
			const isRunningSpy = vi.spyOn(moveManager["_runner"], "isRunning")
			moveManager.isRunning()
			expect(isRunningSpy).toHaveBeenCalled()
		})
	})
	
	describe("isStopping", () => {
		test("CubeRobotのisStoppingメソッドが呼ばれる", () => {
			const isStoppingSpy = vi.spyOn(moveManager["_runner"], "isStopping")
			moveManager.isStopping()
			expect(isStoppingSpy).toHaveBeenCalled()
		})
	})
	
	
	
	describe("convert", () => {
		test("MoveConverterのconvertメソッドが呼ばれる", () => {
			const convertSpy = vi.spyOn(moveManager["_converter"], "convert")
			const moves: Move[] = ["R"]
			moveManager.convert(moves)
			expect(convertSpy).toHaveBeenCalledWith(moves)
		})
	})
	
	
	
	describe("isMoves", () => {
		test("MoveParserのisMovesメソッドが呼ばれる", () => {
			const isMovesSpy = vi.spyOn(moveManager["_parser"], "isMoves")
			const moves: string[] = ["R"]
			moveManager.isMoves(moves)
			expect(isMovesSpy).toHaveBeenCalledWith(moves)
		})
	})

	describe("isMove", () => {
		test("MoveParserのisMoveメソッドが呼ばれる", () => {
			const isMoveSpy = vi.spyOn(moveManager["_parser"], "isMove")
			const move: string = "R"
			moveManager.isMove(move)
			expect(isMoveSpy).toHaveBeenCalledWith(move)
		})
	})

	describe("isRobotMoves", () => {
		test("MoveParserのisRobotMovesメソッドが呼ばれる", () => {
			const isRobotMovesSpy = vi.spyOn(moveManager["_parser"], "isRobotMoves")
			const moves: string[] = ["D"]
			moveManager.isRobotMoves(moves)
			expect(isRobotMovesSpy).toHaveBeenCalledWith(moves)
		})
	})

	describe("isRobotMove", () => {
		test("MoveParserのisRobotMoveメソッドが呼ばれる", () => {
			const isRobotMoveSpy = vi.spyOn(moveManager["_parser"], "isRobotMove")
			const move: string = "D"
			moveManager.isRobotMove(move)
			expect(isRobotMoveSpy).toHaveBeenCalledWith(move)
		})
	})

	describe("parseMove", () => {
		test("MoveParserのparseMoveメソッドが呼ばれる", () => {
			const parseMoveSpy = vi.spyOn(moveManager["_parser"], "parseMove")
			const move: Move = "R"
			moveManager.parseMove(move)
			expect(parseMoveSpy).toHaveBeenCalledWith(move)
		})
	})

	describe("parseRobotMove", () => {
		test("MoveParserのparseRobotMoveメソッドが呼ばれる", () => {
			const parseRobotMoveSpy = vi.spyOn(moveManager["_parser"], "parseRobotMove")
			const move: RobotMove = "D"
			moveManager.parseRobotMove(move)
			expect(parseRobotMoveSpy).toHaveBeenCalledWith(move)
		})
	})

	describe("parseSequence", () => {
		test("MoveParserのparseSequenceメソッドが呼ばれる", () => {
			const parseSequenceSpy = vi.spyOn(moveManager["_parser"], "parseSequence")
			const sequence: string = "R U F"
			moveManager.parseSequence(sequence)
			expect(parseSequenceSpy).toHaveBeenCalledWith(sequence)
		})
	})

	describe("reverseSequence", () => {
		test("MoveParserのreverseSequenceメソッドが呼ばれる", () => {
			const reverseSequenceSpy = vi.spyOn(moveManager["_parser"], "reverseSequence")
			const sequence: string = "R U F"
			moveManager.reverseSequence(sequence)
			expect(reverseSequenceSpy).toHaveBeenCalledWith(sequence)
		})
	})
	
})
