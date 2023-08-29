import type { Mock, Mocked } from "vitest"
import { MoveParser } from "src/MoveManager/MoveParser.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

describe("MoveParser", () => {
	describe("isMoves", () => {
		test("正しいMoveの配列を正しく判定できる", () => {
			const moves = ["R", "U", "F"]
			const result = MoveParser.isMoves(moves)
			expect(result).toBe(true)
		})
		
		test("不正なMoveの配列を正しく判定できる", () => {
			const moves = ["R", "Invalid", "F"]
			const result = MoveParser.isMoves(moves)
			expect(result).toBe(false)
		})
	})
	
	describe("isMove", () => {
		test("正しいMoveを正しく判定できる", () => {
			const move = "U"
			const result = MoveParser.isMove(move)
			expect(result).toBe(true)
		})
		
		test("不正なMoveを正しく判定できる", () => {
			const move = "Invalid"
			const result = MoveParser.isMove(move)
			expect(result).toBe(false)
		})
	})
	
	
	
	describe("isRobotMoves", () => {
		test("正しいRobotMoveの配列を正しく判定できる", () => {
			const moves = ["D", "x", "y"]
			const result = MoveParser.isRobotMoves(moves)
			expect(result).toBe(true)
		})
		
		test("不正なRobotMoveの配列を正しく判定できる", () => {
			const moves = ["D", "Invalid", "y"]
			const result = MoveParser.isRobotMoves(moves)
			expect(result).toBe(false)
		})
	})
	
	describe("isRobotMove", () => {
		test("正しいRobotMoveを正しく判定できる", () => {
			const move = "D"
			const result = MoveParser.isRobotMove(move)
			expect(result).toBe(true)
		})
		
		test("不正なRobotMoveを正しく判定できる", () => {
			const move = "Invalid"
			const result = MoveParser.isRobotMove(move)
			expect(result).toBe(false)
		})
	})
	
	
	
	describe("parseMove", () => {
		test("正しいMoveを正しくパースできる", () => {
			const move = "Rw2"
			const expected = {
				position: "R",
				opposite: false,
				wide: true,
				two: true,
			}
			const result = MoveParser.parseMove(move)
			expect(result).toEqual(expected)
		})
		
		test("不正なMoveでエラーをスローする", () => {
			const move = "Invalid" as Move
			const result = () => MoveParser.parseMove(move)
			expect(result).toThrow("Invalid move notation!")
		})
	})
	
	describe("parseRobotMove", () => {
		test("正しいRobotMoveを正しくパースできる", () => {
			const move = "x3"
			const expected = {
				position: "x",
				opposite: false,
				count: 3,
			}
			const result = MoveParser.parseRobotMove(move)
			expect(result).toEqual(expected)
		})
		
		test("不正なRobotMoveでエラーをスローする", () => {
			const move = "Invalid" as RobotMove
			const result = () => MoveParser.parseRobotMove(move)
			expect(result).toThrow("Invalid robot move notation!")
		})
	})
	
	
	
	describe("parseSequence", () => {
		test("正しいSequence", () => {
			const sequence = "R U' R'"
			const expected = ["R", "U'", "R'"]
			const result = MoveParser.parseSequence(sequence)
			expect(result).toEqual(expected)
		})
		
		test("不正なSequence", () => {
			const sequence = "A B' Cw D2"
			const result = () => MoveParser.parseSequence(sequence)
			expect(result).toThrow("Invalid sequence!")
		})
	})
	
	
	
	describe("reverseSequence", () => {
		test("正しいSequence", () => {
			const sequence = "R U' R'"
			const expected = "R U R'"
			const result = MoveParser.reverseSequence(sequence)
			expect(result).toEqual(expected)
		})
		
		test("不正なSequence", () => {
			const sequence = "A B' Cw D2"
			const result = () => MoveParser.reverseSequence(sequence)
			expect(result).toThrow("Invalid sequence!")
		})
	})
	
})
