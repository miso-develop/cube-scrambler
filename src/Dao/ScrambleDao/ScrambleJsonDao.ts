import type { ScrambleDao } from "./ScrambleDao.js"
import { JsonDao } from "../JsonDao.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

const emptyScrambleData: ScrambleData = {
	cornerOnly: [],
	edgeOnly: [],
	parity: [],
	nonParity: [],
}

export const ScrambleJsonDao: ScrambleDao = class {
	private static readonly _FILE_NAME = "scrambles.json"
	
	private static readonly _jsonDao = new JsonDao(this._FILE_NAME)
	
	public static async load(): Promise<ScrambleData> {
		return await this._jsonDao.load(emptyScrambleData)
	}
	
	public static async save(json: ScrambleData): Promise<void> {
		await this._jsonDao.save(json)
	}
}
