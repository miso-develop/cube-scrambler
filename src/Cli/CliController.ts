import type { Service } from "../Service.js"
import { CliService } from "./CliService.js"
import { CliView } from "./CliView.js"
import { Repl } from "./Repl.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class CliController {
	private readonly _cliService: CliService
	private readonly _cliView: typeof CliView
	private readonly _repl: typeof Repl
	
	constructor(service: Service) {
		this._cliService = new CliService(service)
		this._cliView = CliView
		
		this._repl = Repl
		this._repl.registerCommands(...this._formatServiceRegister())
		this._repl.registerError(this._errorCommand)
	}
	
	public start() {
		this._repl.start()
	}
	
	private get _services() {
		return [
			// MEMO: serviceをここに登録
			this._cliService.scramble,
			this._cliService.solve,
			this._cliService.sequence,
			this._cliService.step,
		]
	}
	
	private _formatServiceRegister() {
		return this._services.map((service): CliServiceRegistrationFormat => ({
			command: service.name,
			func: async (arg: string): Promise<void> => {
				const result: CubeChampleApiResult = await this._cliService[service.name](arg.replaceAll("\"", "")) // MEMO: service(arg)だとバグる
				result.facelets !== "" && this._cliView.draw(result.facelets) // DEBUG:
				this._cliView.success("Finish!")
			},
		}))
	}
	
	private _errorCommand = (message: string): void => this._cliView.error(message)
	
}
