import { CubeChampleApi } from "./CubeChampleApi.js"
import type { ScrambleDao } from "../../Dao/ScrambleDao/ScrambleDao.js"
import { scrambleDaoFactory } from "../../factories.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

export class CubeChampleApiCache {
	private static readonly _scrambleDao = scrambleDaoFactory()
	private static readonly _cubeChampleApi = CubeChampleApi
	
	private static _cache: ScrambleData
	
	
	
	public static async fetch(type: ScrambleType): Promise<CubeChampleApiResult> {
		if (this._isEmpty(type)) await this._load()
		if (this._isEmpty(type)) await this._update(type)
		
		const result = this._cache[SCRAMBLE_TYPE_KEYS[type]].pop() as CubeChampleApiResult
		this._save()
		return result
	}
	
	
	
	private static _isEmpty(type: ScrambleType = SCRAMBLE_TYPE.random): boolean {
		const cache = this._cache?.[SCRAMBLE_TYPE_KEYS[type]] || []
		return cache.length === 0
	}
	
	private static async _load() {
		this._cache = await this._scrambleDao.load()
	}
	
	private static async _save() {
		await this._scrambleDao.save(this._cache)
	}
	
	private static async _update(type: ScrambleType = SCRAMBLE_TYPE.random) {
		this._cache[SCRAMBLE_TYPE_REVERSE[type]] = await this._cubeChampleApi.request({ n: 100, t: type })
	}
	
}
