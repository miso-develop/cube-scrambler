import type { Eye, Eyes } from "./AvatarParts/AvatarEye.js"
import type { Eyebrow, Eyebrows } from "./AvatarParts/AvatarEyebrow.js"
import type { Mouse } from "./AvatarParts/AvatarMouse.js"
import type { EmotionMark } from "./AvatarParts/AvatarEmotionMark.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../../utils.js"
// import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export type Face = {
	eyebrows?: Eyebrows
	eyes: Eyes
	mouse: Mouse
	emotionMark?: EmotionMark
}

export class AvatarFace {
	
	public static readonly normal: Face = {
		eyebrows:	["-", "-"],
		eyes:		[".", "."],
		mouse:			"-",
	}
	
	public static readonly happy: Face = {
		eyebrows:	["^", "^"],
		eyes:		[".", "."],
		mouse:			"v",
	}
	
	public static readonly enjoy: Face = {
		eyebrows:	["", ""],
		eyes:		["^", "^"],
		mouse:			"-",
	}
	
	public static readonly angry: Face = {
		eyebrows:	["\\", "/"],
		eyes:		[".", "."],
		mouse:			"^",
	}
	
	public static readonly sleep: Face = {
		// eyebrows:	["", ""],
		eyes:		["-", "-"],
		mouse:			"-",
		emotionMark:	"z",
	}
	
	public static readonly think: Face = {
		eyebrows:	["~", "~"],
		eyes:		[".", "."],
		mouse:			"^",
		emotionMark:	"?",
	}
	
	public static readonly surprise: Face = {
		eyebrows:	["", ""],
		eyes:		["o", "o"],
		mouse:			"O",
		emotionMark:	"!",
	}
	
	
	
	public static readonly random = (): Face => {
		const pattern: Face[] = [
			this.normal,
			this.normal,
			this.normal,
			this.happy,
			this.happy,
			this.enjoy,
			this.enjoy,
			this.angry,
			// this.sleep,
			// this.surprise,
			// this.think,
		]
		return pattern[random(0, pattern.length - 1)]
	}
	
}
