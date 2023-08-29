import type { Mock, Mocked } from "vitest"
import { CliController } from "src/Cli/CliController.js"

import type { Service } from "src/Service.js"
import { CliService } from "src/Cli/CliService.js"
import { CliView } from "src/Cli/CliView.js"
import { Repl } from "src/Cli/Repl.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

// TODO: あとまわし
describe.skip("CliController", () => {
	test("xxx", async () => {
		const actual = "xxx"
		expect(actual).toBe("xxx")
	})
})
