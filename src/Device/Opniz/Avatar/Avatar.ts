import type { M5Unified } from "opniz/dist/devices/M5Unified.js"
import { AvatarCore, DisplaySpec } from "./AvatarCore.js"
import { AvatarState } from "./AvatarState.js"
import { AvatarMotion } from "./AvatarMotion.js"
import { AvatarFace } from "./AvatarFace.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../../utils.js"
// import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export type { DisplaySpec } from "./AvatarCore.js"

export class Avatar {
	private readonly _opniz: M5Unified
	private readonly _core: AvatarCore
	private readonly _state: AvatarState
	private readonly _motion: AvatarMotion
	private readonly _face: typeof AvatarFace
	
	constructor(opniz: M5Unified, displaySpec?: DisplaySpec) {
		this._opniz = opniz
		this._core = new AvatarCore(this._opniz, displaySpec)
		this._state = new AvatarState()
		this._motion = new AvatarMotion(this._core, this._state)
		this._face = AvatarFace
	}
	
	
	
	public async init(rotation = 1): Promise<void> {
		await this._core.init(rotation)
		this._state.initialize()
	}
	
	public isInitialized(): boolean {
		return this._state.isInitialized()
	}
	
	public async stop(): Promise<void> {
		this._state.updateStopping(true)
		this._core.abortSleep()
		while (this._state.isStopping()) await sleep(10) // 停止処理が完了するまでwait
	}
	
	
	
	public async waiting(): Promise<void> {
		await this._motion.keep(this._face.random(), [
			{
				motion: () => this._motion.upDownEyebrow(),
				interval: 4 * 1000,
			},
			{
				motion: () => this._motion.randomWink(),
				interval: 60 / 20 * 1000,
			},
			{
				motion: () => this._motion.closeEyes(),
				interval: 10 * 1000,
			},
			{
				motion: () => this._motion.talk(),
				interval: 5 * 1000,
			},
			{
				motion: () => this._motion.eat(),
				interval: 10 * 1000,
			},
			{
				motion: () => this._motion.randomOffsetEyebrows(),
				interval: 5 * 1000,
			},
			{
				motion: () => this._motion.randomOffsetEyes(),
				interval: 5 * 1000,
			},
			{
				motion: () => this._motion.randomOffsetMouse(),
				interval: 5 * 1000,
			},
			{
				motion: () => this._motion.randomFace(),
				interval: 10 * 1000,
			},
		])
		
	}
	
	
	
	public async thinking(): Promise<void> {
		await this._motion.keep(this._face.think, [
			{
				motion: () => this._motion.upDownEyebrow(),
				interval: 1 * 1000,
			},
			{
				motion: () => this._motion.randomWink(),
				interval: 4 * 1000,
			},
			{
				motion: () => this._motion.randomOffsetEyes(),
				interval: 1 * 1000,
			},
			{
				motion: () => this._motion.randomOffsetMouse(),
				interval: 3 * 1000,
			},
			{
				motion: () => this._motion.randomOffsetEmotionMark(),
				interval: 1 * 1000,
			},
			{
				motion: () => this._motion.closeEyes(),
				interval: 5 * 1000,
			},
		])
	}
	
	
	
	public async complete(): Promise<void> {
		await this._motion.complete()
	}
	
	public async surprise(): Promise<void> {
		await this._motion.surprise()
	}
	
}
