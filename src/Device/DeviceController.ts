import type { Service } from "src/Service.js"
import type { Device } from "./Device.js"
import { DeviceService } from "./DeviceService.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class DeviceController {
	private readonly _deviceService: DeviceService
	
	constructor(service: Service) {
		this._deviceService = new DeviceService(service)
		this._overrideOnMethods(service.cubeRobot.device)
	}
	
	private _overrideOnMethods(device: Device): void {
		device.onconnect = this._deviceService.onconnect
		device.onbutton = this._deviceService.onbutton
	}
	
}
