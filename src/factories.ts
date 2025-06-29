import { config } from "./config.js"

import type { Device } from "./Device/Device.js"
import { OpnizDevice } from "./Device/Opniz/OpnizDevice.js"
import { MockDevice } from "./Device/MockDevice.js"

import type { ScrambleDao } from "./Dao/ScrambleDao/ScrambleDao.js"
import { ScrambleJsonDao } from "./Dao/ScrambleDao/ScrambleJsonDao.js"

import type { WebServer } from "./WebServer/WebServer.js"
import { ExpressServer } from "./WebServer/ExpressServer.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "./utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "./types.js"



export const deviceFactory = (): Device => {
	switch(config.DEVICE_TYPE) {
		case "opniz": return new OpnizDevice()
		case "mock": return new MockDevice()
		default: return new MockDevice()
	}
}

export const scrambleDaoFactory = (): ScrambleDao => ScrambleJsonDao

export const webServerFactory = (): WebServer => new ExpressServer()
