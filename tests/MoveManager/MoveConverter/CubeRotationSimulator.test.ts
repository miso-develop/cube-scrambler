import type { Mock, Mocked } from "vitest"
import { CubeRotationSimulator } from "src/MoveManager/MoveConverter/CubeRotationSimulator.js"

import { MoveParser } from "src/MoveManager/MoveParser.js"
import { FaceOrientation } from "src/MoveManager/MoveConverter/FaceOrientation.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

describe("CubeRotationSimulator", () => {
	const initCubeState: CubeState = { u: "U", r: "R" , f: "F" }
	
	let cubeRotationSimulator: typeof CubeRotationSimulator
	let mockCubeState: CubeState
	let mockRobotCubeState: CubeState
	
	beforeEach(() => {
		mockCubeState = { u: "U", r: "R", f: "F" }
		mockRobotCubeState = mockCubeState
		cubeRotationSimulator = CubeRotationSimulator
	})
	
	describe("simulateRobotCubeRotations", () => {
		test("simulateRobotCubeRotationsで指定されたロボットの動きをシミュレーションすること", () => {
			const moves: RobotMove[] = ["x", "y", "y'", "D"]
			const expected = { u: "F", r: "R" , f: "D" }
			const result = cubeRotationSimulator.simulateRobotCubeRotations(initCubeState, moves)
			expect(result).toEqual(expected)
		})
	})
	
	
	describe("simulateCubeRotation", () => {
		test("simulateCubeRotationで指定された回転動作をシミュレーションすること: x", () => {
			const rotate: RotationMove = "x"
			const expected = { u: "F", r: "R" , f: "D" }
			const result = cubeRotationSimulator.simulateCubeRotation(initCubeState, rotate)
			expect(result).toEqual(expected)
		})
		
		test("simulateCubeRotationで引数がundefinedの場合CubeStateに変化がないこと", () => {
			const rotate = undefined
			const expected = initCubeState
			const result = cubeRotationSimulator.simulateCubeRotation(initCubeState, rotate)
			expect(result).toEqual(expected)
		})
		
		test("simulateCubeRotationで引数が不正なMoveの場合CubeStateに変化がないこと", () => {
			const rotate: RotationMove = "R" as RotationMove
			const expected = initCubeState
			const result = cubeRotationSimulator.simulateCubeRotation(initCubeState, rotate)
			expect(result).toEqual(expected)
		})
	})
	
})
