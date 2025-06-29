import { config } from "../config.js"
import type { Service } from "../Service.js"
import { ApiService } from "./ApiService.js"
import { FaceletsDrawer } from "../Cli/FaceletsDrawer.js"
import type { WebServer } from "../WebServer/WebServer.js"
import { webServerFactory } from "../factories.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class ApiController {
	private readonly _apiService: ApiService
	private readonly _faceletsDrawer: typeof FaceletsDrawer
	private readonly _webServer: WebServer
	
	private readonly _SERVER_PORT = config.SERVER_PORT
	
	constructor(service: Service) {
		this._apiService = new ApiService(service)
		this._faceletsDrawer = FaceletsDrawer
		
		this._webServer = webServerFactory()
		this._webServer.registerGetRoutes(...this._formatServiceRegister())
	}
	
	public listen(): void {
		this._webServer.listen(this._SERVER_PORT)
	}
	
	private get _services() {
		return [
			// MEMO: serviceをここに登録
			this._apiService.scramble,
			this._apiService.solve,
			this._apiService.sequence,
			this._apiService.step,
		]
	}
	
	private _formatServiceRegister() {
		return this._services.map((service): ApiServiceRegistrationFormat => ({
			api: service.name,
			func: async (...args: unknown[]): Promise<CubeChampleApiResult> => {
				const result: CubeChampleApiResult = await this._apiService[service.name](...args) // MEMO: service(...args)だとバグる
				result.facelets !== "" && this._faceletsDrawer.draw(result.facelets) // DEBUG:
				return result
			},
		}))
	}
}
