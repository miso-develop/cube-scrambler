import { z } from "zod"
import { Min2Phase } from "./Min2Phase.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

type PartsPosition = number[]
type PartsPattern = string[]

export class StepSequenceGenerator {
	private static readonly _MIN_NUMBER = 2
	private static readonly _MAX_NUMBER = 7
	
	private static readonly _STEP_TEMPLATES = {
		"1": "------------------------------------------------------",
		"2": "----------------R--------F--D-D-D-D--------L--------B-",
		"3": "------------R-R-R----F-F-F--D-D-D-D----L-L-L----B-B-B-",
		"4": "------------R-RRRR---F-FFFFDDDD-DDDD---L-LLLL---B-BBBB",
		"5": "-U-U-U-U----R-RRRR---F-FFFFDDDD-DDDD---L-LLLL---B-BBBB",
		"6": "UUUU-UUUU---R-RRRR---F-FFFFDDDD-DDDD---L-LLLL---B-BBBB",
		"7": "UUUU-UUUUR-RR-RRRRF-FF-FFFFDDDD-DDDDL-LL-LLLLB-BB-BBBB",
		"8": "UUUU-UUUURRRR-RRRRFFFF-FFFFDDDD-DDDDLLLL-LLLLBBBB-BBBB",
	} as const satisfies { [key: number]: Facelets }
	
	private static readonly _CORNER_POSITIONS: PartsPosition[] = [
		[0, 36, 47], [2, 11, 45], [6, 18, 38], [8, 9, 20],
		[15, 26, 29], [17, 35, 51], [24, 27, 44], [33, 42, 53],
	]
	
	private static readonly _EDGE_POSITIONS: PartsPosition[] = [
		[1, 46], [3, 37], [5, 10], [7, 19],
		[12, 23], [14, 48], [16, 32], [21, 41],
		[25, 28], [30, 43], [34, 52], [39, 50],
	]
	
	private static readonly _TOP_CORNER_POSITIONS: PartsPosition[] = this._CORNER_POSITIONS.slice(0, 4)
	private static readonly _TOP_EDGE_POSITIONS: PartsPosition[] = this._EDGE_POSITIONS.slice(0, 4)
	
	private static readonly _GENERATE_TIMEOUT_MSEC = 1 * 1000
	
	
	
	private static readonly _min2Phase = Min2Phase
	
	
	
	public static generate(stepNumber: number): Facelets {
		this._validateStepNumber(stepNumber)
		
		const timeout = timeoutClosure()
		
		let facelets: Facelets
		do {
			if (timeout(this._GENERATE_TIMEOUT_MSEC)) throw Error("Step generate timeout!")
			facelets = this._tradeParts(this._min2Phase.randomFacelets(), stepNumber)
		} while(!this._isStepFacelets(facelets, stepNumber))
		
		return facelets
	}
	
	
	
	private static _tradeParts(randomFacelets: Facelets, stepNumber: number): Facelets {
		let resultFaceletsArray = [...randomFacelets]
		
		if (stepNumber < 5) {
			resultFaceletsArray = this._tradeFirstTwoLayersParts([...resultFaceletsArray], stepNumber, [...this._EDGE_POSITIONS])
			resultFaceletsArray = this._tradeFirstTwoLayersParts([...resultFaceletsArray], stepNumber, [...this._CORNER_POSITIONS])
		
		} else {
			resultFaceletsArray = this._tradeFirstTwoLayersParts([...resultFaceletsArray], 4, [...this._EDGE_POSITIONS])
			resultFaceletsArray = this._tradeFirstTwoLayersParts([...resultFaceletsArray], 4, [...this._CORNER_POSITIONS])
			
			resultFaceletsArray = this._tradeLastLayerParts([...resultFaceletsArray], stepNumber, [...this._TOP_EDGE_POSITIONS])
			resultFaceletsArray = this._tradeLastLayerParts([...resultFaceletsArray], stepNumber, [...this._TOP_CORNER_POSITIONS])
		}
		
		return resultFaceletsArray.join("")
	}
	
	
	
	private static _tradeFirstTwoLayersParts(faceletsArray: string[], stepNumber: number, partsPositions: PartsPosition[]): string[] {
		return this._tradePartsCommon(faceletsArray, stepNumber, partsPositions, (targetPattern: PartsPattern): PartsPosition => {
			// MEMO: faceletsから交換元を探して、交換元のポジションを取得
			return partsPositions.flatMap((partsPosition) => {
				const partsPattern = this._position2pattern(partsPosition, faceletsArray)
				return !arrayEquals(partsPattern, targetPattern) ? [] :
					targetPattern.map((direction) => partsPosition[partsPattern.indexOf(direction)])
			})
		})
	}
	
	private static _tradeLastLayerParts(faceletsArray: string[], stepNumber: number, partsPositions: PartsPosition[]): string[] {
		return this._tradePartsCommon(faceletsArray, stepNumber, partsPositions, (targetPattern: PartsPattern): PartsPosition => {
			// MEMO: 交換したいパターンと"-"以外が一致するパーツのポジションを取得
			const partsPosition = partsPositions[partsPositions.findIndex((partsPosition) => {
				const partsPattern = this._position2pattern(partsPosition, faceletsArray)
				return targetPattern.every((direction) => direction === "-" || partsPattern.includes(direction))
			})]
			partsPositions.shift()
			
			// MEMO: targetPatternと同じ並びになおして、交換元のポジションを取得
			const partsPattern = this._position2pattern(partsPosition, faceletsArray)
			const sourcePosition = [...partsPattern]
				.sort((a, b) => (targetPattern.includes("-") ? -1 : 1) * (targetPattern.indexOf(a) > targetPattern.indexOf(b) ? 1 : -1))
				.map((direction) => partsPosition[partsPattern.indexOf(direction)])
			
			return sourcePosition
		})
	}
	
	private static _tradePartsCommon(
		faceletsArray: string[],
		stepNumber: number,
		partsPositions: PartsPosition[],
		getSourcePosition: (targetPattern: PartsPattern) => PartsPosition
	): string[] {
		const stepTemplateArray: Facelets[] = [...this._STEP_TEMPLATES[stepNumber]]
		
		partsPositions
			.filter((partsPosition) => partsPosition.some((position) => stepTemplateArray[position] !== "-"))
			.forEach((destinationPosition) => {
				const targetPattern = this._position2pattern(destinationPosition, stepTemplateArray)
				const destinationPattern = this._position2pattern(destinationPosition, faceletsArray)
				const sourcePosition = getSourcePosition(targetPattern)
				const sourcePattern = sourcePosition.map((position) => faceletsArray[position])
				
				sourcePosition.forEach((position, i) => faceletsArray[position] = destinationPattern[i])
				destinationPosition.forEach((position, i) => faceletsArray[position] = sourcePattern[i])
			})
		
		return faceletsArray
	}
	
	
	
	private static _isNextStepPattern(facelets: Facelets, stepNumber: number): boolean {
		const masks = [
			[...this._STEP_TEMPLATES[stepNumber + 1]],
			[..."---------RRR------FFF---------------LLL------BBB------"],
			[..."---------FFF------LLL---------------BBB------RRR------"],
			[..."---------LLL------BBB---------------RRR------FFF------"],
			[..."---------BBB------RRR---------------FFF------LLL------"],
		]
		
		return !masks.every(mask =>
			![...facelets].every((notation, i) =>
				mask[i] === "-" || mask[i] === notation))
	}
	
	private static _position2pattern(positionArray: PartsPosition, faceletsArray: string[]): PartsPattern {
		return positionArray.map(position => faceletsArray[position])
	}
	
	
	
	private static _validateStepNumber(stepNumber: number): void {
		if (!z.number().min(this._MIN_NUMBER).max(this._MAX_NUMBER).safeParse(stepNumber).success) throw Error("Invalid step number!")
	}
	
	private static _isStepFacelets(facelets: Facelets, stepNumber: number): boolean {
		return this._min2Phase.validate(facelets) && !this._isNextStepPattern(facelets, stepNumber)
	}
	
}
