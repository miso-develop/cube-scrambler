import { config } from "../config.js"
import type { Service } from "../Service.js"
import type { Device } from "./Device.js"
import { CliView } from "../Cli/CliView.js"
import { FaceletsDrawer } from "../Cli/FaceletsDrawer.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class DeviceService {
	private readonly _service: Service
	private readonly _device: Device
	private readonly _cliView: typeof CliView
	private readonly _faceletsDrawer: typeof FaceletsDrawer
	
	constructor(service: Service) {
		this._service = service
		this._device = service.cubeRobot.device
		this._cliView = CliView
		this._faceletsDrawer = FaceletsDrawer
	}
	
	
	
	public onconnect: () => Promise<void> = async (): Promise<void> => {
		console.log("Device connected!")
		await this._service.init()
	}
	
	public onbutton: (button?: string, count?: number) => Promise<void> = async (button?: string, count?: number) => {
		try {
			// MEMO: ボタン連打防止としては緊急停止中はボタン無効化
			if (this._service.isStopping()) return
			
			// 実行中だと緊急停止
			if (this._service.isRunning()) return this._service.stop()
			
			const { facelets } = await this._runButtonAction()
			this._faceletsDrawer.draw(facelets) // DEBUG:
			
		} catch (e) {
			this._cliView.error(e.message)
		}
	}
	
	private async _runButtonAction(): Promise<CubeChampleApiResult> {
		switch (config.BUTTON_ACTION) {
			case "random": return await this._service.scramble(0)
			case "corner-only": return await this._service.scramble(1)
			case "edge-only": return await this._service.scramble(2)
			case "parity": return await this._service.scramble(3)
			case "non-parity": return await this._service.scramble(4)
			case "step2": return await this._service.step(2)
			case "step3": return await this._service.step(3)
			case "step4": return await this._service.step(4)
			case "step5": return await this._service.step(5)
			case "step6": return await this._service.step(6)
			case "step7": return await this._service.step(7)
			default: return await this._service.scramble()
		}
	}
	
}
