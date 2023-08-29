import { Min2Phase } from "./Min2Phase.js"
import { CubeChampleApiCache } from "./CubeChampleApi/CubeChampleApiCache.js"
import { StepSequenceGenerator } from "./StepSequenceGenerator.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class SequenceGenerator {
	private static readonly _min2Phase = Min2Phase
	private static readonly _cubeChampleApiCache = CubeChampleApiCache
	private static readonly _stepSequenceGenerator = StepSequenceGenerator
	
	
	
	public static async random(type: ScrambleType = SCRAMBLE_TYPE.random): Promise<CubeChampleApiResult> {
		return type === SCRAMBLE_TYPE.random ?
			this._min2Phase.randomScramble() :
			await this._cubeChampleApiCache.fetch(type)
	}
	
	public static solve(facelets: Facelets): CubeChampleApiResult {
		return this._min2Phase.solve(facelets)
	}
	
	public static scramble(facelets: Facelets): CubeChampleApiResult {
		return this._min2Phase.scramble(facelets)
	}
	
	public static facelets(sequence: Sequence): Facelets {
		// MEMO: xyzやwに対応してない
		return this._min2Phase.facelets(sequence)
	}
	
	public static step(stepNumber: number): Facelets {
		return this._stepSequenceGenerator.generate(stepNumber)
	}
	
}
