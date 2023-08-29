import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export type ParsedMove = { position: string; opposite: boolean; wide: boolean; two: boolean }
export type ParsedRobotMove = { position: string; opposite: boolean; count: number }

export class MoveParser {
	
	public static isMoves(moves: string[]): moves is Move[] {
		return moves.every(this.isMove)
	}
	
	public static isMove(move: string): move is Move {
		return (MOVE_LIST as readonly string[]).includes(move)
	}
	
	public static isRobotMoves(moves: string[]): moves is RobotMove[] {
		return moves.every(this.isRobotMove)
	}
	
	public static isRobotMove(move: string): move is RobotMove {
		return (ROBOT_MOVE_LIST as readonly string[]).includes(move)
	}
	
	
	
	public static parseMove(move: Move): ParsedMove {
		const matchedMove = move.match(/^([a-zA-Z])('?)(w?)(2?)$/)
		if (!matchedMove) throw Error("Invalid move notation!")
		
		return {
			position: matchedMove![1],
			opposite: matchedMove![2] !== "",
			wide: matchedMove![3] !== "",
			two: matchedMove![4] !== "",
		}
	}
	
	public static parseRobotMove(move: RobotMove): ParsedRobotMove {
		const matchedMove = move.match(/^([Dxy])('?)([23]?)$/)
		if (!matchedMove) throw Error("Invalid robot move notation!")
		
		return {
			position: matchedMove![1],
			opposite: matchedMove![2] !== "",
			count: matchedMove![3] !== "" ? Number(matchedMove![3]) : 1,
		}
	}
	
	
	
	public static parseSequence(sequence: string): Move[] {
		// dbg(this._cleanseSequence(sequence))
		const moves = this._cleanseSequence(sequence).split(" ")
		if (!this.isMoves(moves)) throw Error("Invalid sequence!")
		return moves
	}
	
	private static _cleanseSequence(sequence: string): string {
		return sequence
			.replace(/(\/|\||-)/g, "")
			.replace(/(\s|　){1,}/g, " ") // eslint-disable-line no-irregular-whitespace
			.replace(/"/g, "")
			.trim()
	}
	
	
	
	public static reverseSequence(sequence: string): string {
		return this.parseSequence(sequence)
			.reverse()
			.map(move => this._reversePrime(move))
			.join(" ")
	}
	
	private static _reversePrime(move: Move): Move {
		const { position, opposite, wide, two } = this.parseMove(move)
		const primeReversedMove = [
			position,
			opposite ? "" : "'",
			wide ? "w" : "",
			two ? "2" : "",
		].join("") as Move
		return primeReversedMove
	}
}
