import type { AvatarCore } from "./AvatarCore.js"
import type { AvatarState } from "./AvatarState.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
// import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export type MotionDefinition = {
	motion: () => void
	interval: number
	amplitude?: number
	next: number
}

export class AvatarMotionQueue {
	private readonly _core: AvatarCore
	private readonly _state: AvatarState
	
	private _motionQueue: MotionDefinition[] = []
	
	constructor(core: AvatarCore, state: AvatarState) {
		this._core = core
		this._state = state
	}
	
	
	
	public initMotionDefinitions(...nextOmitMotionDefinitions: Omit<MotionDefinition, "next">[]): void {
		const motionDefinitions = nextOmitMotionDefinitions.map((motionDefinition: any) => {
			motionDefinition.next = this._calcNextTime(motionDefinition)
			if (!this._isMotionDefinition(motionDefinition)) throw Error("Invalid Motion Definition!")
			return motionDefinition
		})
		this._motionQueue = [] // MEMO: 一旦queueをクリア
		this._addMotionQueue(...motionDefinitions)
	}
	
	private _calcNextTime(motionDefinition: MotionDefinition): number {
		const amplitude = motionDefinition.amplitude || (motionDefinition.interval >= 2000 ? 1000 : motionDefinition.interval / 2)
		return motionDefinition.interval + (random(amplitude * -1, amplitude))
	}
	
	private _isMotionDefinition(motionDefinition: MotionDefinition): motionDefinition is MotionDefinition {
		return !!motionDefinition.next
	}
	
	private _addMotionQueue(...motionDefinitions: MotionDefinition[]): void {
		this._motionQueue.push(...motionDefinitions)
		this._motionQueue.sort((a, b) => (a.next || 0) > (b.next || 0) ? 1 : -1)
	}
	
	
	
	public async execMotions(): Promise<void> {
		try {
			while (!this._state.isStopping()) {
				await this._execMotion()
			}
		} catch (e) {
			this._core.resetAbortSleep()
		}
	}
	
	private async _execMotion(): Promise<void> {
		if (this._state.isStopping()) throw new Error()
		
		if (this._motionQueue.length === 0) throw Error("Motion queue is empty!")
		
		const motionDefinition = this._motionQueue.shift() as MotionDefinition
		
		const next = motionDefinition.next < 0 ? 0 : motionDefinition.next
		
		await this._core.sleep(next)
		await motionDefinition.motion()
		
		this._updateMotionQueuesNext(next)
		motionDefinition.next = this._calcNextTime(motionDefinition)
		this._addMotionQueue(motionDefinition)
	}
	
	private _updateMotionQueuesNext(next): void {
		this._motionQueue.forEach(motionDefinition => motionDefinition.next -= next)
	}
}
