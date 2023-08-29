import type { Service } from "../Service.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class ApiService {
	private readonly _service: Service
	
	constructor(service: Service) {
		this._service = service
	}
	
	
	
	public async scramble(query: { type: ScrambleType }): Promise<CubeChampleApiResult> {
		const type = Number(query.type) as ScrambleType
		return await this._service.scramble(type)
	}
	
	public async solve(query: { facelets: Facelets }): Promise<CubeChampleApiResult> {
		const facelets = query.facelets as Facelets
		return await this._service.solve(facelets)
	}
	
	public async sequence(query: { sequence: Sequence }): Promise<CubeChampleApiResult> {
		const sequence = query.sequence as Sequence
		return await this._service.run(sequence)
	}
	
	public async step(query: { number: number }): Promise<CubeChampleApiResult> {
		const number = Number(query.number)
		return await this._service.step(number)
	}
	
}
