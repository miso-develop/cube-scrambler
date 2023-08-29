import chalk from "chalk"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class FaceletsDrawer {
	
	public static draw(facelets: string): void {
		const diagram = this._convertDiagram(facelets)
		const coloredDiagram = this._coloring(diagram)
		console.log(`${coloredDiagram}\n`)
	}
	
	private static _convertDiagram(facelets: string): string {
		const space = "   "
		
		const faces = facelets.match(/.{1,9}/g)
		
		const u = faces![0].match(/.{1,3}/g)
		const r = faces![1].match(/.{1,3}/g)
		const f = faces![2].match(/.{1,3}/g)
		const d = faces![3].match(/.{1,3}/g)
		const l = faces![4].match(/.{1,3}/g)
		const b = faces![5].match(/.{1,3}/g)
		
		const upFaceLine = u?.map(line => `${space}${line}${space}${space}`)
		const middleFaceLine = [...Array(3)].map((_, i) => `${l![i]}${f![i]}${r![i]}${b![i]}`)
		const downFaceLine = d?.map(line => `${space}${line}${space}${space}`)
		const faceLineAll = [...upFaceLine!, ...middleFaceLine!, ...downFaceLine!]
		
		const serialized = faceLineAll.join("\n")
		const addedSpace = serialized.replace(/(.)/gi, str => `${str} `)
		
		return addedSpace
	}
	
	private static _coloring(facelets: string): string {
		const orange = chalk.hex("#FFA500")
		return chalk.bgBlack(facelets)
			.replaceAll("U", chalk.yellow("■"))
			.replaceAll("R", chalk.red("■"))
			.replaceAll("F", chalk.blue("■"))
			.replaceAll("D", chalk.white("■"))
			.replaceAll("L", orange("■"))
			.replaceAll("B", chalk.green("■"))
	}
	
}
