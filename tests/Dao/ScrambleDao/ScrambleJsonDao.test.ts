import type { Mock, Mocked } from "vitest"
import { ScrambleJsonDao } from "src/Dao/ScrambleDao/ScrambleJsonDao.js"

import type { ScrambleDao } from "src/Dao/ScrambleDao/ScrambleDao.js"
import { JsonDao } from "src/Dao/JsonDao.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

const emptyScrambleData: ScrambleData = {
	cornerOnly: [],
	edgeOnly: [],
	parity: [],
	nonParity: [],
}

vi.mock("src/Dao/JsonDao.js")

describe("ScrambleJsonDao", () => {
	describe("load", () => {
		test("正常にデータをロードできる", async () => {
			await ScrambleJsonDao.load()
			expect(ScrambleJsonDao["_jsonDao"].load).toHaveBeenCalled()
		})
	})
	
	describe("save", () => {
		test("正常にデータを正常に保存できる", async () => {
			await ScrambleJsonDao.save(emptyScrambleData)
			expect(ScrambleJsonDao["_jsonDao"].save).toHaveBeenCalled()
		})
	})
	
})
