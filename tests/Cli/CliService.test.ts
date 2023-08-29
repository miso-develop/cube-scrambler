import type { Mock, Mocked } from "vitest"
import { CliService } from "src/Cli/CliService.js"

import type { Service } from "src/Service.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

describe("CliService", () => {
	
	const facelets = "RBLFUBBFDLRFURULRRDLFLFRBDURBBFDDLUUDRRLLBBDUUUFFBDFLD"
	const sequence = "F L2 F2 L' D B' R' D2 B' U R2 F2 R2 U2 F D2 B2 L2 D2 F2 B'"
	const apiResult = { facelets, sequence }
	
	let serviceMock: Mocked<Service>
	let cliService: CliService
	
	beforeEach(() => {
		serviceMock = {
			scramble: vi.fn().mockResolvedValue({ facelets, sequence }),
			solve: vi.fn().mockResolvedValue({ facelets, sequence }),
			run: vi.fn().mockResolvedValue({ facelets, sequence }),
			step: vi.fn().mockResolvedValue({ facelets, sequence }),
		} as unknown as Mocked<Service>
		
		cliService = new CliService(serviceMock)
	})

	describe("scramble", () => {
		test("scrambleメソッドが正しく呼び出されること", async () => {
			const arg = "1"
			const result = await cliService.scramble(arg)
			expect(serviceMock.scramble).toHaveBeenCalledWith(1)
			expect(result).toEqual(apiResult)
		})
	})
	
	describe("solve", () => {
		test("solveメソッドが正しく呼び出されること", async () => {
			const arg = facelets
			const result = await cliService.solve(arg)
			expect(serviceMock.solve).toHaveBeenCalledWith(arg)
			expect(result).toEqual(apiResult)
		})
	})
	
	describe("sequence", () => {
		test("sequenceメソッドが正しく呼び出されること", async () => {
			const arg = sequence
			const result = await cliService.sequence(arg)
			expect(serviceMock.run).toHaveBeenCalledWith(arg)
			expect(result).toEqual(apiResult)
		})
	})
	
	describe("step", () => {
		test("stepメソッドが正しく呼び出されること", async () => {
			const arg = "5"
			const result = await cliService.step(arg)
			expect(serviceMock.step).toHaveBeenCalledWith(5)
			expect(result).toEqual(apiResult)
		})
	})
	
	
})
