import { M5Device } from "../M5Device.js"
import type { M5Unified } from "opniz/dist/devices/M5Unified.js"
import { Avatar } from "../Avatar/Avatar.js"
import type { DisplaySpec } from "../Avatar/Avatar.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../../types.js"

export class M5StickC implements M5Device {
	private readonly _opniz: M5Unified
	private readonly _avatar: Avatar
	
	public readonly STAND_SERVO_PIN = 32
	public readonly ARM_SERVO_PIN = 33
	
	private readonly _DISPLAY_SPEC: DisplaySpec = {
		pxSize: 4,
		screenXSize: 160,
		screenYSize: 80,
	}
	
	constructor(opniz: M5Unified) {
		this._opniz = opniz
		this._avatar = new Avatar(opniz, this._DISPLAY_SPEC)
	}
	
	
	
	public onrun: () => Promise<void> = async () => {
		await this._avatar.stop()
		this._avatar.thinking()
		// await this._display(0xff0000, "Running!")
	}
	
	
	
	public onstop: (result: boolean) => Promise<void> = async (result: boolean) => {
		if (!this._avatar.isInitialized()) {
			await this._avatar.init()
			
		} else {
			await this._avatar.stop()
			result ? await this._avatar.complete() : await this._avatar.surprise()
		}
		
		this._avatar.waiting()
		// await this._display(0x00ff00, "Ready!")
	}
	
	
	
	private async _display(color: number, text: string): Promise<void> {
		await this._opniz.Display.setBrightness(100)
		
		await this._opniz.Display.clearDisplay()
		await this._opniz.Display.fillScreen(color)
		
		await this._opniz.Display.setTextSize(3)
		await this._opniz.Display.setTextColor(0xffffff, color)
		
		const width = await this._opniz.Display.width() || 0
		await this._opniz.Display.drawCentreString(text, width / 2, 24)
	}
	
}
