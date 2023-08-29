import type { Mock, Mocked } from "vitest"
import { FaceOrientation } from "src/MoveManager/MoveConverter/FaceOrientation.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

describe("FaceOrientation", () => {
	
	describe("getFullface", () => {
		test("指定されたCubeStateからFullFaceを取得すること", () => {
			const state: CubeState = { u: "D", r: "B", f: "L" }
			const fullFace: FullFace = {
				u: "D",
				r: "B",
				f: "L",
				d: "U",
				l: "F",
				b: "R",
			}
			const result = FaceOrientation.getFullface(state)
			expect(result).toEqual(fullFace)
		})
	})
	
	describe("rotateX", () => {
		test("指定されたCubeStateをX軸で回転すること", () => {
			const state: CubeState = { u: "U", r: "R", f: "F" }
			const count = 1
			const rotatedState: CubeState = { u: "F", r: "R", f: "D" }
			const result = FaceOrientation.rotateX(state, count)
			expect(result).toEqual(rotatedState)
		})
	})
	
	describe("rotateY", () => {
		test("指定されたCubeStateをY軸で回転すること", () => {
			const state: CubeState = { u: "U", r: "R", f: "F" }
			const count = 1
			const rotatedState: CubeState = { u: "U", r: "B", f: "R" }
			const result = FaceOrientation.rotateY(state, count)
			expect(result).toEqual(rotatedState)
		})
	})
	
	describe("rotateZ", () => {
		test("指定されたCubeStateをZ軸で回転すること", () => {
			const state: CubeState = { u: "U", r: "R", f: "F" }
			const count = 1
			const rotatedState: CubeState = { u: "L", r: "U", f: "F" }
			const result = FaceOrientation.rotateZ(state, count)
			expect(result).toEqual(rotatedState)
		})
	})
	
	describe("findFacePosition", () => {
		test("指定されたCubeStateから特定の色の方向を取得すること", () => {
			const state: CubeState = { u: "D", r: "B", f: "L" }
			const Face: Face = "F"
			const facePosition = "l"
			const result = FaceOrientation.findFacePosition(state, Face)
			expect(result).toEqual(facePosition)
		})
	})
	
})
