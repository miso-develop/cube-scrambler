import type { Mock, Mocked } from "vitest"
import { MoveConverter } from "src/MoveManager/MoveConverter/MoveConverter.js"
import { MoveParser } from "src/MoveManager/MoveParser.js"
import { CubeRotationSimulator } from "src/MoveManager/MoveConverter/CubeRotationSimulator.js"
import { FaceOrientation } from "src/MoveManager/MoveConverter/FaceOrientation.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

type ConvertMovesAndRotate<T, U> = { moves: readonly T[]; rotate: U }
type ConvertTable<T, U> = { [prop: string]: ConvertMovesAndRotate<T, U> }

describe("MoveConverter", () => {
	
	beforeEach(() => {
		// MEMO: _lastCorrectOrientationを実行するため、_LAST_CORRECT_ORIENTATIONを強制的にtrueにする
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		MoveConverter["_LAST_CORRECT_ORIENTATION"] = true
	})
	
	describe("convert", () => {
		test("正しい変換が行われる（Basic）", () => {
			const moves: Move[] = [
				"U", "U2", "U'", "U'2",
				"R", "R2", "R'", "R'2",
				"F", "F2", "F'", "F'2",
				"D", "D2", "D'", "D'2",
				"L", "L2", "L'", "L'2",
				"B", "B2", "B'", "B'2",
			]
			const expected: RobotMove[] = ["x2", "D", "D2", "D'", "D'2", "y'", "x", "D", "D2", "D'", "D'2", "y", "x", "D", "D2", "D'", "D'2", "y'", "x", "D", "D2", "D'", "D'2", "y", "x", "D", "D2", "D'", "D'2", "y'", "x", "D", "D2", "D'", "D'2",]
			if (MoveConverter["_lastCorrectOrientation"]) expected.push("x2", "y'", "x")
			const result = MoveConverter.convert(moves)
			expect(result).toEqual(expected)
		})
		
		test("正しい変換が行われる（Slice）", () => {
			const moves: Move[] = [
				"M", "M2", "M'", "M'2",
				"E", "E2", "E'", "E'2",
				"S", "S2", "S'", "S'2",
			]
			const expected: RobotMove[] = ["y'", "x", "D", "x2", "D'", "x2", "D2", "x2", "D'2", "x2", "D'", "x2", "D", "x2", "D'2", "x2", "D2", "x3", "D", "x2", "D'", "x2", "D2", "x2", "D'2", "x2", "D'", "x2", "D", "x2", "D'2", "x2", "D2", "y'", "x", "D'", "x2", "D", "x2", "D'2", "x2", "D2", "x2", "D", "x2", "D'", "x2", "D2", "x2", "D'2",]
			if (MoveConverter["_lastCorrectOrientation"]) expected.push("x2", "y2", "x")
			const result = MoveConverter.convert(moves)
			expect(result).toEqual(expected)
		})
		
		test("正しい変換が行われる（Wide）", () => {
			const moves: Move[] = [
				"Uw", "U'w", "Uw2", "U'w2",
				"Rw", "R'w", "Rw2", "R'w2",
				"Fw", "F'w", "Fw2", "F'w2",
				"Dw", "D'w", "Dw2", "D'w2",
				"Lw", "L'w", "Lw2", "L'w2",
				"Bw", "B'w", "Bw2", "B'w2",
			]
			const expected: RobotMove[] = ["D", "D'", "D2", "D'2", "y", "x", "D", "y", "x", "D'", "y", "x", "D2", "y", "x", "D'2", "x", "D", "x", "D'", "x", "D2", "x", "D'2", "x2", "D", "x2", "D'", "x2", "D2", "x2", "D'2", "y'", "x", "D", "y'", "x", "D'", "y'", "x", "D2", "y'", "x", "D'2", "x3", "D", "x3", "D'", "x3", "D2", "x3", "D'2",]
			if (MoveConverter["_lastCorrectOrientation"]) expected.push("x2", "y'", "x")
			const result = MoveConverter.convert(moves)
			expect(result).toEqual(expected)
		})
		
		test("正しい変換が行われる（Rotation）", () => {
			const moves: Move[] = [
				"x", "x2", "x'", "x'2",
				"y", "y2", "y'", "y'2",
				"z", "z2", "z'", "z'2",
			]
			const expected: RobotMove[] = []
			if (MoveConverter["_lastCorrectOrientation"]) expected.push("x3", "x")
			const result = MoveConverter.convert(moves)
			expect(result).toEqual(expected)
		})
		
		test("不正なMoveが引数のときにエラーがスローされる", () => {
			const moves: Move[] = ["invalid move"] as any
			const expected = "Invalid move type!"
			const result = () => MoveConverter.convert(moves)
			expect(result).toThrow(expected)
		})
		
	})
	
})
