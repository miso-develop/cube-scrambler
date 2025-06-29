import type { Device } from "../Device/Device.js"
import { deviceFactory } from "../factories.js"
import { StandServo } from "./Servo/StandServo.js"
import { ArmServo } from "./Servo/ArmServo.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class CubeRobot {
	public readonly device: Device
	
	private _standServo: StandServo
	private _armServo: ArmServo
	
	constructor() {
		this.device = deviceFactory()
	}
	
	
	
	public async connect(): Promise<boolean> {
		return await this.device.connectWait()
	}
	
	
	
	public async init(): Promise<void> {
		this._standServo = new StandServo(this.device)
		this._armServo = new ArmServo(this.device)
		
		await Promise.all([
			this._standServo.init(),
			this.ready(),
		])
	}
	
	public async ready(): Promise<void> {
		await this._armServo.ready()
	}
	
	
	
	public async d(count: number): Promise<void> {
		if(!this._armServo.isHold()) await this._armServo.hold()
		await this._standServo.turnD(count)
	}
	
	public async dp(count: number): Promise<void> {
		if(!this._armServo.isHold()) await this._armServo.hold()
		await this._standServo.turnDP(count)
	}
	
	public async y(count: number): Promise<void> {
		if(!this._armServo.isRelease()) await this._armServo.release()
		await this._standServo.turnDP(count) // MEMO: yはDとは逆回転
	}
	
	public async yp(count: number): Promise<void> {
		if(!this._armServo.isRelease()) await this._armServo.release()
		await this._standServo.turnD(count) // MEMO: yはDとは逆回転
	}
	
	public async x(count: number): Promise<void> {
		await this._armServo.turnX(count)
	}
	
}
