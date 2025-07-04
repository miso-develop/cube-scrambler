import { config } from "../../config.js"
import { M5Unified } from "opniz/dist/devices/M5Unified.js"
import type { Device, Servo } from "../Device.js"
import { m5DeviceFactory } from "./M5DeviceFactory.js"
import { GeekServo } from "./GeekServo.js"
import { log, dbg, dev, AbortableSleep, abortableSleep, sleep, abortSleep, envBoolean, envNumber, generateId, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure, StopWatch, stopWatch } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

export class OpnizDevice implements Device {
	private readonly _opniz: M5Unified
	
	public standServo: Servo
	public armServo: Servo
	
	private readonly _abortableSleep: AbortableSleep
	
	private readonly _port: number
	
	constructor() {
		this._port = config.OPNIZ_PORT
		this._opniz = new M5Unified({ port: this._port })
		this._abortableSleep = new AbortableSleep()
		
		this._opniz.onconnect = async () => {
			await this._init()
			this.onconnect()
		}
		this._opniz.onclose = () => this.onclose()
		this._opniz.Btn.onClicked = (button: string, count: number) => this.onbutton(button, count)
		
		this._opniz.on("run", () => this.onrun())
		this._opniz.on("stop", (result: boolean) => this.onstop(result))
	}
	
	
	
	private async _init(): Promise<void> {
		await this._opniz.sleep(0) // MEMO: onconnectになってすぐled制御するとエラーになるためzero sleepを挿入
		await this._setM5Device()
		await this.onstop(true)
	}
	
	private async _setM5Device(): Promise<void> {
		const m5Device = await m5DeviceFactory(this._opniz)
		
		const standPwmChannel = config.STAND_PWM_CHANNEL || 0
		const armPwmChannel = config.ARM_PWM_CHANNEL || 1
		this.standServo = new GeekServo(this, m5Device.STAND_SERVO_PIN, standPwmChannel)
		this.armServo = new GeekServo(this, m5Device.ARM_SERVO_PIN, armPwmChannel)
		
		this.onrun = m5Device.onrun
		this.onstop = m5Device.onstop
	}
	
	
	
	public async connectWait(): Promise<boolean> {
		log(`Waiting for device connection on port ${this._port}`)
		while (!(await this._opniz.connectWait())) {} // eslint-disable-line no-empty
		return true
	}
	
	public isConnected(): boolean {
		return this._opniz.isConnected()
	}
	
	
	
	public async sleep(ms: number): Promise<void> {
		await this._abortableSleep.sleep(ms, { throwError: true })
	}
	
	public abortSleep(): void {
		this._abortableSleep.abort()
	}
	
	public resetAbortSleep(): void {
		this._abortableSleep.resetController()
	}
	
	
	
	public emitRun(): void {
		this._opniz.emit("run")
	}
	
	public emitStop(result: boolean): void {
		this._opniz.emit("stop", result)
	}
	
	
	
	public onconnect: () => Promise<void> = async () => {}
	public onclose: () => Promise<void> = async () => {}
	public onbutton: (button?: string, count?: number) => Promise<void> = async () => {}
	
	public onrun: () => Promise<void> = async () => {}
	public onstop: (result: boolean) => Promise<void> = async (result: boolean) => {}
	
	
	
	public async ledcWrite(pin: number, duty: number, channel: number, freq: number, resolutionBits: number): Promise<void> {
		await this._opniz.ledcWrite(pin, duty, channel, freq, resolutionBits)
	}
}
