import type { Mock, Mocked } from "vitest"
import { Service } from "src/Service.js"

import { CubeRobot } from "src/CubeRobot/CubeRobot.js"
import { MoveManager } from "src/MoveManager/MoveManager.js"

import { SequenceGenerator } from "src/SequenceGenerator/SequenceGenerator.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

vi.mock("src/CubeRobot/CubeRobot.js")
vi.mock("src/MoveManager/MoveManager.js")
vi.mock("src/SequenceGenerator/SequenceGenerator.js")

describe("Service", () => {
	
	const facelets = "RBLFUBBFDLRFURULRRDLFLFRBDURBBFDDLUUDRRLLBBDUUUFFBDFLD"
	const sequence = "F L2 F2 L' D B' R' D2 B' U R2 F2 R2 U2 F D2 B2 L2 D2 F2 B'"
	const scramble = "B F2 D2 L2 B2 D2 F' U2 R2 F2 R2 U' B D2 R B D' L F2 L2 F'"
	const runResult = { facelets, sequence }
	
	let service: Service
	
	beforeEach(async () => {
		service = new Service()
	})
	
	describe("connectRobot", () => {
		test("CubeRobot.connectメソッドが呼ばれること", async () => {
			const result = await service.connectRobot()
			expect(service.cubeRobot.connect).toHaveBeenCalled()
		})
	})
	
	describe("init", () => {
		test("CubeRobot.initメソッドが呼ばれること", async () => {
			await service.init()
			expect(service.cubeRobot.init).toHaveBeenCalled()
		})
	})
	
	describe("stop", () => {
		test("moveManagerのstopメソッドが呼ばれること", () => {
			service.stop()
			expect(service.moveManager.stop).toHaveBeenCalled()
		})
	})
	
	describe("isWaiting", () => {
		test("moveManagerのisWaitingメソッドの結果が返されること", () => {
			const isWaitingValue = true
			! (service.moveManager.isWaiting as Mock).mockReturnValue(isWaitingValue)
			const result = service.isWaiting()
			expect(result).toBe(isWaitingValue)
		})
	})
	
	describe("isRunning", () => {
		test("moveManagerのisRunningメソッドの結果が返されること", () => {
			const isRunningValue = true
			! (service.moveManager.isRunning as Mock).mockReturnValue(isRunningValue)
			const result = service.isRunning()
			expect(result).toBe(isRunningValue)
		})
	})
	
	describe("isStopping", () => {
		test("moveManagerのisStoppingメソッドの結果が返されること", () => {
			const isStoppingValue = true
			! (service.moveManager.isStopping as Mock).mockReturnValue(isStoppingValue)
			const result = service.isStopping()
			expect(result).toBe(isStoppingValue)
		})
	})
	
	describe("run", () => {
		test("sequenceGeneratorのfaceletsメソッドが引数として渡されたsequenceで呼ばれること", async () => {
			await service.run(sequence)
			expect(service.sequenceGenerator.facelets).toHaveBeenCalledWith(sequence);
		})
		
		test("moveManagerのparseSequenceメソッドが返した結果がconvertメソッドに渡され、convertの結果がrunに渡されること", async () => {
			const parsedMove = "parsed_move"
			const convertedMove = "converted_move"
			! (service.sequenceGenerator.facelets as Mock).mockReturnValue("some_facelets")
			! (service.moveManager.parseSequence as Mock).mockReturnValue(parsedMove)
			! (service.moveManager.convert as Mock).mockReturnValue(convertedMove)
			await service.run(sequence)
			expect(service.moveManager.convert).toHaveBeenCalledWith(parsedMove)
			expect(service.moveManager.run).toHaveBeenCalledWith(convertedMove)
		})
		
		test("faceletsとsequenceが返されること", async () => {
			! (service.sequenceGenerator.facelets as Mock).mockReturnValue(facelets)
			! (service.moveManager.parseSequence as Mock).mockReturnValue("parsed_move")
			! (service.moveManager.convert as Mock).mockReturnValue("converted_move")
			const result = await service.run(sequence)
			expect(result).toEqual(runResult)
		})
		
		test("sequenceが空の場合、エラーがスローされること", async () => {
			const emptySequence = ""
			! (service.sequenceGenerator.facelets as Mock).mockReturnValue("some_facelets")
			! (service.moveManager.parseSequence as Mock).mockReturnValue("parsed_move")
			! (service.moveManager.convert as Mock).mockReturnValue("converted_move")
			await expect(service.run(emptySequence)).rejects.toThrow("Sequence is empty!")
		})
	})
	
	describe("scramble", () => {
		test("sequenceGeneratorのrandomメソッドが引数として渡されたtypeで呼ばれること", async () => {
			const type = SCRAMBLE_TYPE.random
			! (service.sequenceGenerator.random as Mock).mockResolvedValue({ sequence: "some_sequence", facelets: "some_facelets" })
			! (service.moveManager.parseSequence as Mock).mockReturnValue("parsed_move")
			! (service.moveManager.convert as Mock).mockReturnValue("converted_move")
			await service.scramble(type)
			expect(service.sequenceGenerator.random).toHaveBeenCalledWith(type)
		})
	})
	
	describe("solve", () => {
		test("sequenceGeneratorのsolveメソッドが引数として渡されたfaceletsで呼ばれること", async () => {
			const facelets = "some_facelets"
			! (service.sequenceGenerator.solve as Mock).mockReturnValue({ sequence: "some_sequence", facelets })
			! (service.moveManager.parseSequence as Mock).mockReturnValue("parsed_move")
			! (service.moveManager.convert as Mock).mockReturnValue("converted_move")
			await service.solve(facelets)
			expect(service.sequenceGenerator.solve).toHaveBeenCalledWith(facelets)
		})
		
		test("faceletsが初期状態の場合、エラーがスローされること", async () => {
			const initialFacelets = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
			! (service.sequenceGenerator.solve as Mock).mockReturnValue({ sequence: "some_sequence", initialFacelets })
			! (service.moveManager.parseSequence as Mock).mockReturnValue("parsed_move")
			! (service.moveManager.convert as Mock).mockReturnValue("converted_move")
			await expect(service.solve(initialFacelets)).rejects.toThrow("Cube is initial state!")
		})
	})
	
	describe("step", () => {
		test("stepSequenceGeneratorのgenerateメソッドが引数として渡されたnumberで呼ばれること", async () => {
			const number = 3
			! (service.sequenceGenerator.scramble as Mock).mockReturnValue({ sequence: "some_sequence", facelets: "some_facelets" })
			! (service.moveManager.parseSequence as Mock).mockReturnValue("parsed_move")
			! (service.moveManager.convert as Mock).mockReturnValue("converted_move")
			await service.step(number)
			expect(service.sequenceGenerator.step).toHaveBeenCalledWith(number)
		})
	})
	
})
