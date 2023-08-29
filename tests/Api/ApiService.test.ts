import type { Mock, Mocked } from "vitest"
import { ApiService } from "src/Api/ApiService.js"

import type { Service } from "src/Service.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

describe("ApiService", () => {
	
	const facelets = "RBLFUBBFDLRFURULRRDLFLFRBDURBBFDDLUUDRRLLBBDUUUFFBDFLD"
	const sequence = "F L2 F2 L' D B' R' D2 B' U R2 F2 R2 U2 F D2 B2 L2 D2 F2 B'"
	const apiResult = { facelets, sequence }
	
	let serviceMock: Mocked<Service>
	let apiService: ApiService
	
	beforeEach(() => {
		serviceMock = {
			scramble: vi.fn().mockResolvedValue(apiResult),
			solve: vi.fn().mockResolvedValue(apiResult),
			run: vi.fn().mockResolvedValue(apiResult),
			step: vi.fn().mockResolvedValue(apiResult),
		} as unknown as Mocked<Service>
		
		apiService = new ApiService(serviceMock)
	})

	describe("scramble", () => {
		test("正しい引数でServiceのscrambleが呼び出される", async () => {
			const query = { type: 1 as ScrambleType }
			const result = await apiService.scramble(query)
			expect(serviceMock.scramble).toHaveBeenCalledWith(1)
			expect(result).toEqual(apiResult)
		})
	})

	describe("solve", () => {
		test("正しい引数でServiceのsolveが呼び出される", async () => {
			const query = { facelets }
			const result = await apiService.solve(query)
			expect(serviceMock.solve).toHaveBeenCalledWith(query.facelets)
			expect(result).toEqual(apiResult)
		})
	})
	
	describe("sequence", () => {
		test("正しい引数でServiceのrunが呼び出される", async () => {
			const query = { sequence }
			const result = await apiService.sequence(query)
			expect(serviceMock.run).toHaveBeenCalledWith(query.sequence)
			expect(result).toEqual(apiResult)
		})
	})
	
	describe("step", () => {
		test("正しい引数でServiceのstepが呼び出される", async () => {
			const query = { number: 2 }
			const result = await apiService.step(query)
			expect(serviceMock.step).toHaveBeenCalledWith(2)
			expect(result).toEqual(apiResult)
		})
	})
	
})
