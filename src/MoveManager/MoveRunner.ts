import type { CubeRobot } from "../CubeRobot/CubeRobot.js"
import { MoveParser } from "./MoveParser.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure, StopWatch, stopWatch } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class MoveRunner {
	
	private readonly _cubeRobot: CubeRobot
	private readonly _moveParser: typeof MoveParser
	
	private _state: MoveRunner.State
	
	public static readonly State = {
		waiting: 0,
		running: 1,
		stopping: 2,
	} as const
	
	constructor(cubeRobot) {
		this._cubeRobot = cubeRobot
		this._moveParser = MoveParser
		
		this._state = MoveRunner.State.waiting
	}
	
	
	
	public async run(moves: RobotMove[]): Promise<void> {
		if (!this._cubeRobot.device.isConnected()) throw Error("Device not connected!")
		if (!this.isWaiting()) throw Error("Cube Scrambler is running!")
		if (!this._moveParser.isRobotMoves(moves)) throw Error("Invalid robot moves!")
		
		let result = true
		
		this._state = MoveRunner.State.running
		this._cubeRobot.device.emitRun()
		
		try {
			for (const move of moves) {
				if (this.isStopping()) throw Error("Emergency stop!")
				
				const { position, opposite, count } = this._moveParser.parseRobotMove(move)
				const prime = opposite ? "'" : ""
				const notation = `${position}${prime}`
				
				switch (notation) {
					case "D":	await this._cubeRobot.d(count); break
					case "D'":	await this._cubeRobot.dp(count); break
					case "x":	await this._cubeRobot.x(count); break
					case "y":	await this._cubeRobot.y(count); break
					case "y'":	await this._cubeRobot.yp(count); break
				}
			}
			
		} catch (e) {
			result = false
			this._cubeRobot.device.resetAbortSleep()
		}
		
		this._cubeRobot.device.emitStop(result)
		
		if (!result) {
			await this._cubeRobot.device.sleep(500)
			setTimeout(()=> this._state = MoveRunner.State.waiting, 2000)
			await this._cubeRobot.ready()
			throw Error("Emergency stop!")
			
		} else {
			this._state = MoveRunner.State.waiting
			await this._cubeRobot.ready()
		}
	}
	
	public stop(): void {
		if (!this.isRunning()) return
		this._cubeRobot.device.abortSleep()
		this._state = MoveRunner.State.stopping
	}
	
	
	
	public isWaiting(): boolean {
		return this._state === MoveRunner.State.waiting
	}
	
	public isRunning(): boolean {
		return this._state === MoveRunner.State.running
	}
	
	public isStopping(): boolean {
		return this._state === MoveRunner.State.stopping
	}
	
}

export namespace MoveRunner {
	export type State = (typeof MoveRunner.State)[keyof typeof MoveRunner.State]
}
