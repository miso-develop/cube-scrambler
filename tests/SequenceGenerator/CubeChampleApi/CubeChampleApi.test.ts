import type { Mock, Mocked } from "vitest"
import { CubeChampleApi } from "src/SequenceGenerator/CubeChampleApi/CubeChampleApi.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

// MEMO: 100 RPH(Request per Hour)のWeb APIを実際に実行するため、普段はskip
// describe("CubeChampleApi", () => {
describe.skip("CubeChampleApi", () => {
	
	const faceletsRegexp = /[URFDLB]{54}/
	const sequenceRegexp = /[URFDLB'2w ]+/
	
	const apiTimeout = 30 * 1000
	
	describe("random", () => {
		test("正常にランダムなスクランブルを取得できる", async () => {
			const result = await CubeChampleApi.random()
			expect(result[0].facelets).toMatch(faceletsRegexp)
			expect(result[0].sequence).toMatch(sequenceRegexp)
			expect(result.length).toBe(100)
		}, apiTimeout)
	})
	
	describe("cornerOnly", () => {
		test("正常にコーナーのみランダムなスクランブルを取得できる", async () => {
			const result = await CubeChampleApi.cornerOnly()
			expect(result[0].facelets).toMatch(faceletsRegexp)
			expect(result[0].sequence).toMatch(sequenceRegexp)
			expect(result.length).toBe(100)
		}, apiTimeout)
	})
	
	describe("edgeOnly", () => {
		test("正常にエッジのみランダムなスクランブルを取得できる", async () => {
			const result = await CubeChampleApi.edgeOnly()
			expect(result[0].facelets).toMatch(faceletsRegexp)
			expect(result[0].sequence).toMatch(sequenceRegexp)
			expect(result.length).toBe(100)
		}, apiTimeout)
	})
	
	describe("parity", () => {
		test("正常にパリティランダムなスクランブルを取得できる", async () => {
			const result = await CubeChampleApi.parity()
			expect(result[0].facelets).toMatch(faceletsRegexp)
			expect(result[0].sequence).toMatch(sequenceRegexp)
			expect(result.length).toBe(100)
		}, apiTimeout)
	})
	
	describe("nonParity", () => {
		test("正常にノンパリティランダムなスクランブルを取得できる", async () => {
			const result = await CubeChampleApi.nonParity()
			expect(result[0].facelets).toMatch(faceletsRegexp)
			expect(result[0].sequence).toMatch(sequenceRegexp)
			expect(result.length).toBe(100)
		}, apiTimeout)
	})
	
	describe("facelets", () => {
		test("正常なfaceletsをソルブするシーケンスを取得できる", async () => {
			const facelets = "RBLFUBBFDLRFURULRRDLFLFRBDURBBFDDLUUDRRLLBBDUUUFFBDFLD"
			const expected = "L2 R2 U B2 U B2 F2 D' B2 R2 F L' R B' U2 L' D' L' B' F R'"
			const result = await CubeChampleApi.facelets(facelets)
			expect(result).toBe(expected)
		}, apiTimeout)
		
		test("不正なfaceletsでエラーが発生する", async () => {
			const facelets = "invalid facelets"
			const resultPromise = CubeChampleApi.facelets(facelets)
			expect(resultPromise).rejects.toThrowError("`f` invalid facelets!")
		}, apiTimeout)
	})
	
	
	
	// TODO: あとで書く
	// describe("request", () => {})
	
})
