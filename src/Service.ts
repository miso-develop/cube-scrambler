import { CubeRobot } from "./CubeRobot/CubeRobot.js"
import { MoveManager } from "./MoveManager/MoveManager.js"
import { SequenceGenerator } from "./SequenceGenerator/SequenceGenerator.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "./utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "./types.js"

export class Service {
	public readonly cubeRobot: CubeRobot
	public readonly moveManager: MoveManager
	public readonly sequenceGenerator: typeof SequenceGenerator
	
	constructor() {
		this.cubeRobot = new CubeRobot()
		this.moveManager = new MoveManager(this.cubeRobot)
		this.sequenceGenerator = SequenceGenerator
	}
	
	
	
	public async connectRobot(): Promise<boolean> {
		return await this.cubeRobot.connect()
	}
	
	public async init(): Promise<void> {
		await this.cubeRobot.init()
	}
	
	
	
	public stop(): void {
		this.moveManager.stop()
	}
	
	public isWaiting(): boolean {
		return this.moveManager.isWaiting()
	}
	
	public isRunning(): boolean {
		return this.moveManager.isRunning()
	}
	
	public isStopping(): boolean {
		return this.moveManager.isStopping()
	}
	
	
	
	public async run(sequence: Sequence): Promise<CubeChampleApiResult> {
		dbg("[runSequence]", sequence)
		this._validateSequence(sequence)
		
		// MEMO: min2phase.faceletsに非対応の記号があったら""を返す
		const facelets = this._isMin2PhaseSequence(sequence) ? this.sequenceGenerator.facelets(sequence) : ""
		
		const move = this.moveManager.parseSequence(sequence)
		const robotMove = this.moveManager.convert(move)
		await this.moveManager.run(robotMove)
		return { facelets, sequence }
	}
	
	
	
	public async scramble(type: ScrambleType = SCRAMBLE_TYPE.random): Promise<CubeChampleApiResult> {
		dbg("[runScramble]", type)
		const { sequence, facelets } = await this.sequenceGenerator.random(type)
		return await this.run(sequence)
	}
	
	public async solve(facelets: Facelets): Promise<CubeChampleApiResult> {
		dbg("[runSolve]", facelets)
		this._validateFacelets(facelets)
		const { sequence } = this.sequenceGenerator.solve(facelets)
		log(sequence)
		return await this.run(sequence)
	}
	
	public async step(number: number): Promise<CubeChampleApiResult> {
		dbg("[runStep]", number)
		const facelets = this.sequenceGenerator.step(number)
		const { sequence } = this.sequenceGenerator.scramble(facelets)
		return await this.run(sequence)
	}
	
	
	
	private _validateSequence(sequence: Sequence): void {
		if (sequence === "") throw Error("Sequence is empty!")
	}
	
	private _validateFacelets(facelets: Facelets): void {
		if (facelets === "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB") throw Error("Cube is initial state!")
	}
	
	private _isMin2PhaseSequence(sequence: Sequence): boolean {
		return !!sequence.match(/^[URFDLB'2 ]+$/)
	}
	
}
