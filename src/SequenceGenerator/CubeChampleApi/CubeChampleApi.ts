import { z } from "zod"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

// MEMO: https://www.terabo.net/cube/apidocs/chample/
export class CubeChampleApi {
	
	private static readonly _ENDPOINT = "http://cube.terabo.net/apis/chample.json?"
	
	
	
	public static async random(): Promise<CubeChampleApiResult[]> {
		return await this.request({ n: 100, t: SCRAMBLE_TYPE.random })
	}
	
	public static async cornerOnly(): Promise<CubeChampleApiResult[]> {
		return await this.request({ n: 100, t: SCRAMBLE_TYPE.cornerOnly })
	}
	
	public static async edgeOnly(): Promise<CubeChampleApiResult[]> {
		return await this.request({ n: 100, t: SCRAMBLE_TYPE.edgeOnly })
	}
	
	public static async parity(): Promise<CubeChampleApiResult[]> {
		return await this.request({ n: 100, t: SCRAMBLE_TYPE.parity })
	}
	
	public static async nonParity(): Promise<CubeChampleApiResult[]> {
		return await this.request({ n: 100, t: SCRAMBLE_TYPE.nonParity })
	}
	
	public static async facelets(facelets: Facelets): Promise<Sequence> {
		return (await this.request({ f: facelets }))[0].sequence
	}
	
	
	
	public static async request({
		n = 1,
		t = SCRAMBLE_TYPE.random,
		f = undefined
	}: {
		n?: number
		t?: ScrambleType
		f?: Facelets
	}): Promise<CubeChampleApiResult[]> {
		this._validateParameters({ n, t, f})
		
		const params = f ? `f=${f}` : `n=${n}&t=${t}`
		const uri = `${this._ENDPOINT}${params}`
		dbg("[ChampleApi request]", uri)
		return await this._fetch(uri)
	}
	
	private static _validateParameters({
		n = 1,
		t = SCRAMBLE_TYPE.random,
		f = undefined
	}: {
		n?: number
		t?: ScrambleType
		f?: Facelets
	}) {
		if (!f) {
			if (!z.number().min(1).max(100).safeParse(n).success) throw Error("`n` must be between 1-100!")
			if (!z.number().min(0).max(6).safeParse(t).success) throw Error("`t` must be between 0-6!")
		} else {
			if (!z.string().length(54).regex(/^[URFDLB]+$/).safeParse(f).success) throw Error("`f` invalid facelets!")
		}
	}
	
	
	
	private static async _fetch(uri: string): Promise<CubeChampleApiResult[]> {
		const response = await fetch(uri)
		const data = await response.json()
		if (data.error) throw Error(data.error)
		return data.results
	}
	
}
