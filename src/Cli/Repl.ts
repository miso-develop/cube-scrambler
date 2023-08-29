import repl from "node:repl"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class Repl {
	private static _commands = {}
	private static _errorCommand: (message: string) => void = () => {}
	
	
	
	public static registerCommands(...commands: CliServiceRegistrationFormat[]): void {
		// commands.forEach(c => dbg(c.command))
		commands.forEach((command) => this._commands[command.command] = (arg) => command.func(arg))
	}
	
	public static registerError(func: (message: string) => void): void {
		this._errorCommand = (message: string) => func(message)
	}
	
	
	
	public static start() {
		repl.start({ terminal: false, eval: async (input) => {
			const inputs = input.trim().split(" ")
			const command = inputs[0]
			const arg = inputs.slice(1).join(" ")
			// dbg({command, arg})
			
			try {
				if (!this._commands[command]) throw Error(`"${command}" is not defined!`)
				await this._commands[command](arg)
				
			} catch (e) {
				this._errorCommand(e.message)
			}
			log()
			
		}})
	}
	
}
