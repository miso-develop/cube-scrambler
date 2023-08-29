import min2phase from "min2phase.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class Min2Phase {
	private static readonly _min2Phase = min2phase
	
	static {
		this._min2Phase.initFull()
	}
	
	
	
	public static solve(facelets: Facelets): CubeChampleApiResult {
		if (!this.validate(facelets)) throw Error("Invalid facelets!")
		const sequence = this._min2Phase.solve(facelets)
		if (!sequence) throw Error("Invalid facelets!")
		const normalizedSequence = this._normalize(this._min2Phase.solve(facelets))
		return { facelets, sequence: normalizedSequence }
	}
	
	public static scramble(facelets: Facelets): CubeChampleApiResult {
		const solveSequence = this.solve(facelets).sequence
		const scrambleSequence = this._reverse(solveSequence)
		return { facelets, sequence: scrambleSequence }
	}
	
	public static randomScramble(): CubeChampleApiResult {
		const randomFacelets = this.randomFacelets()
		return this.scramble(randomFacelets)
	}
	
	public static facelets(sequence: Sequence): Facelets {
		return this._min2Phase.fromScramble(sequence)
	}
	
	
	
	public static validate(facelets: Facelets): boolean {
		return facelets === this._min2Phase.fromScramble(this._reverse(this._min2Phase.solve(facelets)))
	}
	
	public static randomFacelets(): Facelets {
		return this._min2Phase.randomCube()
	}
	
	
	
	private static _normalize(sequence: Sequence): Sequence {
		return sequence.replace(/\s{2}/g, " ").trim()
	}
	
	private static _reverse(sequence: Sequence): Sequence {
		const reversePrime = (notation) => notation.includes("2") ? notation :
			notation.includes("'") ? notation.replace(/'/g, "") :
				`${notation}'`
		
		return this._normalize(sequence).split(" ")
			.reverse()
			.map(reversePrime)
			.join(" ")
	}
	
}
