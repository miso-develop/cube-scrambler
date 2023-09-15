import type { Mock, Mocked } from "vitest"
import { RpsLimiter } from "src/Api/RpsLimiter.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

describe("RpsLimiter", () => {
	describe("isWithinRate", () => {
		test("レート内である場合、trueを返す", async () => {
			await sleep(300)
			expect(RpsLimiter.isWithinRate()).toBeTruthy
			await sleep(10)
			expect(RpsLimiter.isWithinRate()).toBeFalsy
			await sleep(300)
			expect(RpsLimiter.isWithinRate()).toBeTruthy
		})
	})
})
