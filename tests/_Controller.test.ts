import type { Mock, Mocked } from "vitest"
import { Controller } from "src/Controller.js"

import { Service } from "src/Service.js"
import { DeviceController } from "src/Device/DeviceController.js"
import { ApiController } from "src/Api/ApiController.js"
import { CliController } from "src/Cli/CliController.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

// TODO: あとまわし
describe.skip("Controller", () => {
	test("xxx", async () => {
		const actual = "xxx"
		expect(actual).toBe("xxx")
	})
})
