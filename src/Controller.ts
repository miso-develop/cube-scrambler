import { Service } from "./Service.js"
import { DeviceController } from "./Device/DeviceController.js"
import { ApiController } from "./Api/ApiController.js"
import { CliController } from "./Cli/CliController.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "./utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "./types.js"

export class Controller {
	private readonly _service: Service
	private readonly _deviceController: DeviceController
	private readonly _apiController: ApiController
	private readonly _cliController: CliController
	
	constructor() {
		
		this._service = new Service()
		
		this._deviceController = new DeviceController(this._service)
		
		this._apiController = new ApiController(this._service)
		this._apiController.listen()
		
		this._cliController = new CliController(this._service)
		this._cliController.start()
	}
	
	public async init() {
		await this._service.connectRobot()
	}
	
}
