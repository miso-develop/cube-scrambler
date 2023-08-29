import type { Mock, Mocked } from "vitest"
import { SequenceGenerator } from "src/SequenceGenerator/SequenceGenerator.js"

import { Min2Phase } from "src/SequenceGenerator/Min2Phase.js"
import { CubeChampleApiCache } from "src/SequenceGenerator/CubeChampleApi/CubeChampleApiCache.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

describe("SequenceGenerator", () => {
	
	const faceletsRegexp = /[URFDLB]{54}/
	const sequenceRegexp = /[URFDLB'2w ]+/
	
	const facelets = "RBLFUBBFDLRFURULRRDLFLFRBDURBBFDDLUUDRRLLBBDUUUFFBDFLD"
	const solveSequence = "F L2 F2 L' D B' R' D2 B' U R2 F2 R2 U2 F D2 B2 L2 D2 F2 B'"
	const scrambleSequence = "B F2 D2 L2 B2 D2 F' U2 R2 F2 R2 U' B D2 R B D' L F2 L2 F'"
	
	describe("random", () => {
		test("ランダムなスクランブルを取得できる", async () => {
			const result = await SequenceGenerator.random()
			expect(result.facelets).toMatch(faceletsRegexp)
			expect(result.sequence).toMatch(sequenceRegexp)
		})
		
		test("指定したタイプのスクランブルを取得できる", async () => {
			const result = await SequenceGenerator.random(SCRAMBLE_TYPE.random)
			expect(result.facelets).toMatch(faceletsRegexp)
			expect(result.sequence).toMatch(sequenceRegexp)
		})
	})

	describe("solve", () => {
		test("指定したfaceletsをソルブできる", () => {
			const result = SequenceGenerator.solve(facelets)
			expect(result.facelets).toBe(facelets)
			expect(result.sequence).toBe(solveSequence)
		})
	})

	describe("scramble", () => {
		test("指定したfaceletsをスクランブルできる", () => {
			const result = SequenceGenerator.scramble(facelets)
			expect(result.facelets).toBe(facelets)
			expect(result.sequence).toBe(scrambleSequence)
		})
	})

	describe("facelets", () => {
		test("指定したsequenceからfaceletsを取得できる", () => {
			const result = SequenceGenerator.facelets(scrambleSequence)
			expect(result).toEqual(facelets)
		})
	})

	describe("step", () => {
		test("指定したstepのランダムなfaceletsを取得できる", () => {
			const result = SequenceGenerator.step(2)
			expect(result).toMatch(sequenceRegexp)
		})
	})
	
})
