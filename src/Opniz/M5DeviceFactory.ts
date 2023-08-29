import { M5Device } from "./M5Device.js"
import type { M5Unified } from "opniz/dist/devices/M5Unified.js"
import { AtomS3Lite } from "./M5Device/AtomS3Lite.js"
import { AtomS3 } from "./M5Device/AtomS3.js"
import { AtomLite } from "./M5Device/AtomLite.js"
import { M5StackCore2 } from "./M5Device/M5StackCore2.js"
import { M5Stack } from "./M5Device/M5Stack.js"
import { M5StickC } from "./M5Device/M5StickC.js"
import { BlankDevice } from "./M5Device/BlankDevice.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export const m5DeviceFactory = async (opniz: M5Unified): Promise<M5Device> => {
	const boardId = opniz.BoardType[(await opniz.getBoard()) || 0]
	switch (boardId) {
		case opniz.BoardType.board_M5AtomS3Lite: return new AtomS3Lite(opniz)
		case opniz.BoardType.board_M5AtomS3: return new AtomS3(opniz)
		case opniz.BoardType.board_M5Atom: return new AtomLite(opniz)
		case opniz.BoardType.board_M5StackCore2: return new M5StackCore2(opniz)
		case opniz.BoardType.board_M5Stack: return new M5Stack(opniz)
		case opniz.BoardType.board_M5StickC: return new M5StickC(opniz)
		default: return new BlankDevice(opniz)
	}
}
