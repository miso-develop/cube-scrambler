import { M5Device } from "../M5Device.js"
import type { M5Unified } from "opniz/dist/devices/M5Unified.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../../types.js"

export class AtomS3Lite implements M5Device {
	private readonly _opniz: M5Unified
	
	public readonly STAND_SERVO_PIN = 2
	public readonly ARM_SERVO_PIN = 1
	
	constructor(opniz: M5Unified) {
		this._opniz = opniz
	}
	
	public onrun: () => Promise<void> = async () => {
		await this._led(0x440000)
	}
	
	public onstop: (result: boolean) => Promise<void> = async (result: boolean) => {
		await this._led(0x004400)
	}
	
	
	
	private async _led(color: number): Promise<void> {
		await this._opniz.Led.fillpix(color)
	}
	
}
