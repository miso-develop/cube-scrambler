import chalk from "chalk"
import { FaceletsDrawer } from "./FaceletsDrawer.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class CliView {
	private static readonly _faceletsDrawer = FaceletsDrawer
	
	
	
	public static draw(facelets: Facelets): void {
		this._faceletsDrawer.draw(facelets)
	}
	
	
	
	public static error(message: string): void {
		console.log(chalk.red(message))
	}
	
	public static warn(message: string): void {
		console.log(chalk.yellow(message))
	}
	
	public static success(message: string): void {
		console.log(chalk.green(message))
	}
	
	public static info(message: string): void {
		console.log(chalk.blue(message))
	}
	
	
	
	private static _chalkOrange(message: string): void {
		console.log(chalk.hex("#FFA500")(message))
	}
	
}
