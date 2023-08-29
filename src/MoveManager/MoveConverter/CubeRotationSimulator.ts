import { MoveParser } from "../MoveParser.js"
import { FaceOrientation } from "./FaceOrientation.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

export class CubeRotationSimulator {
	
	private static readonly _moveParser = MoveParser
	private static readonly _faceOrientation = FaceOrientation
	
	
	
	public static simulateRobotCubeRotations(robotCubeState: CubeState, moves: RobotMove[]): CubeState {
		moves.forEach(move => robotCubeState = this._simulateRobotCubeRotation(robotCubeState, move))
		return robotCubeState
	}
	
	private static _simulateRobotCubeRotation(robotCubeState: CubeState, move: RobotMove): CubeState {
		const { position, opposite, count } = this._moveParser.parseRobotMove(move)
		const prime = opposite ? "'" : ""
		const notation = `${position}${prime}`
		
		switch (notation) {
			case "x":	return this._faceOrientation.rotateX(robotCubeState, count)
			case "y":	return this._faceOrientation.rotateY(robotCubeState, count)
			case "y'":	return this._faceOrientation.rotateY(robotCubeState, count * -1)
			default: return robotCubeState
		}
	}
	
	
	
	public static simulateCubeRotation(cubeState: CubeState, rotate: RotationMove | undefined): CubeState {
		if (!rotate) return cubeState
		
		const { position, opposite, two } = this._moveParser.parseMove(rotate)
		const prime = opposite ? "'" : ""
		const count = two ? 2 : 1
		const notation = `${position}${prime}`
		
		switch (notation) {
			case "x":	return this._faceOrientation.rotateX(cubeState, count)
			case "x'":	return this._faceOrientation.rotateX(cubeState, count * -1)
			case "y":	return this._faceOrientation.rotateY(cubeState, count)
			case "y'":	return this._faceOrientation.rotateY(cubeState, count * -1)
			case "z":	return this._faceOrientation.rotateZ(cubeState, count)
			case "z'":	return this._faceOrientation.rotateZ(cubeState, count * -1)
			default: return cubeState
		}
	}
	
}
