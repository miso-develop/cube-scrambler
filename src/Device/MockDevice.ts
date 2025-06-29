import type { Device, Servo } from "./Device.js"
import { Repl } from "../Cli/Repl.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class MockDevice implements Device {
	public standServo: Servo = { async turn(angle: number) {} }
	public armServo: Servo = { async turn(angle: number) {} }
	
	constructor() {
		console.log("[Device Mock]")
		
		// MEMO: onbutton動作をreplでシミュレート
		Repl.registerCommands({
			command: "onbutton",
			func: async (arg: unknown): Promise<void> => {
				this.onbutton()
			}
		})
	}
	
	public async connectWait(): Promise<boolean> { return true }
	public isConnected(): boolean { return true }
	public async sleep(ms: number): Promise<void> {}
	public abortSleep(): void {}
	public resetAbortSleep(): void {}
	public async ledcWrite(pin: number, duty: number, channel: number, freq: number, resolutionBits: number): Promise<void> {}
	public emitRun(): void {}
	public emitStop(result: boolean): void {}
	
	public onconnect: () => Promise<void> = async () => {}
	public onclose: () => Promise<void> = async () => {}
	public onbutton: (button?: string, count?: number) => Promise<void> = async () => {}
	public onrun: () => Promise<void> = async () => {}
	public onstop: (result: boolean) => Promise<void> = async (result: boolean) => {}
}
