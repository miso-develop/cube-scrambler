import type { Mock, Mocked } from "vitest"
import { Min2Phase } from "src/SequenceGenerator/Min2Phase.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

describe("Min2Phase", () => {
	
	const facelets = "RBLFUBBFDLRFURULRRDLFLFRBDURBBFDDLUUDRRLLBBDUUUFFBDFLD"
	const solveSequence = "F L2 F2 L' D B' R' D2 B' U R2 F2 R2 U2 F D2 B2 L2 D2 F2 B'"
	const scrambleSequence = "B F2 D2 L2 B2 D2 F' U2 R2 F2 R2 U' B D2 R B D' L F2 L2 F'"
	
	describe("solve", () => {
		test("正しいfaceletsを渡すと、正しいsequenceを返す", () => {
			const expected = solveSequence
			const result = Min2Phase.solve(facelets)
			expect(result.sequence).toBe(expected)
		})
		
		test("無効なfaceletsを渡すとエラーをスローする", () => {
			const invalidFacelets = "invalid facelets"
			const result = () => Min2Phase.solve(invalidFacelets)
			expect(result).toThrowError("Invalid facelets!")
		})
	})
	
	describe("scramble", () => {
		test("正しいfaceletsを渡すと、正しいscramble sequenceを返す", () => {
			const expected = scrambleSequence
			const result = Min2Phase.scramble(facelets)
			expect(result.sequence).toBe(expected)
		})
	})

	describe("randomScramble", () => {
		test("randomCube関数を呼び出して正しいscramble sequenceを返す", () => {
			const result = Min2Phase.randomScramble()
			expect(result.sequence).toMatch(/[URFDLB'2w ]+/)
		})
	})

	describe("facelets", () => {
		test("正しいsequenceを渡すと、正しいfaceletsを返す", () => {
			const sequence = scrambleSequence
			const expected = facelets
			const result = Min2Phase.facelets(sequence)
			expect(result).toBe(expected)
		})
	})

	describe("validate", () => {
		test("正しいfaceletsを渡すとtrueを返す", () => {
			const result = Min2Phase.validate(facelets)
			expect(result).toBeTruthy()
		})

		test("無効なfaceletsを渡すとfalseを返す", () => {
			const invalidFacelets = "invalid facelets"
			const result = Min2Phase.validate(invalidFacelets)
			expect(result).toBeFalsy()
		})
	})

})
