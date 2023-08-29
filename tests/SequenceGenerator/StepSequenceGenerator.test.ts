import type { Mock, Mocked } from "vitest"
import { StepSequenceGenerator } from "src/SequenceGenerator/StepSequenceGenerator.js"

import { Min2Phase } from "src//SequenceGenerator/Min2Phase.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

type PartsPosition = number[]
type PartsPattern = string[]

describe("StepSequenceGenerator", () => {
	
	const faceletsRegexp = /[URFDLB]{54}/
	
	describe("generate", () => {
		test("Step2のfaceletsを生成する", () => {
			const stepNumber = 2
			const result = StepSequenceGenerator.generate(stepNumber)
			expect(result).toMatch(faceletsRegexp)
		})
		
		test("Step3のfaceletsを生成する", () => {
			const stepNumber = 3
			const result = StepSequenceGenerator.generate(stepNumber)
			expect(result).toMatch(faceletsRegexp)
		})
		
		test("Step4のfaceletsを生成する", () => {
			const stepNumber = 4
			const result = StepSequenceGenerator.generate(stepNumber)
			expect(result).toMatch(faceletsRegexp)
		})
		
		test("Step5のfaceletsを生成する", () => {
			const stepNumber = 5
			const result = StepSequenceGenerator.generate(stepNumber)
			expect(result).toMatch(faceletsRegexp)
		})
		
		test("Step6のfaceletsを生成する", () => {
			const stepNumber = 6
			const result = StepSequenceGenerator.generate(stepNumber)
			expect(result).toMatch(faceletsRegexp)
		})
		
		test("Step7のfaceletsを生成する", () => {
			const stepNumber = 7
			const result = StepSequenceGenerator.generate(stepNumber)
			expect(result).toMatch(faceletsRegexp)
		})
		
		test("無効なstepNumberを指定するとエラーをスローする", () => {
			const invalidStepNumber = 0
			const result = () => StepSequenceGenerator.generate(invalidStepNumber)
			expect(result).toThrowError("Invalid step number!")
		})
	})
	
})
