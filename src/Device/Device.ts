import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export interface Device {
	STAND_SERVO_PIN: number
	ARM_SERVO_PIN: number
	
	connectWait(): Promise<boolean>
	isConnected(): boolean
	
	sleep(ms: number): Promise<void>
	abortSleep(): void
	resetAbortSleep(): void
	
	turn(pin: number, channel: number, angle: number): Promise<void>
	ledcWrite(pin: number, duty: number, channel: number, freq: number, resolutionBits: number): Promise<void>
	
	emitRun(): void
	emitStop(result: boolean): void
	
	onconnect: () => Promise<void>
	onclose: () => Promise<void>
	onbutton: (button?: string, count?: number) => Promise<void>
	
	onrun: () => Promise<void>
	onstop: (result: boolean) => Promise<void>
}
