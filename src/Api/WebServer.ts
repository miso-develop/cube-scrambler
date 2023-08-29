import express from "express"
import type { Express, Request, Response } from "express"
import { RpsLimiter } from "./RpsLimiter.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class WebServer {
	private readonly _STATIC_ROOT = "public"
	
	private readonly _express: Express
	
	private readonly _rpsLimiter: typeof RpsLimiter
	
	
	
	constructor() {
		this._express = express()
		this._express.use(express.static(this._STATIC_ROOT))
		
		this._rpsLimiter = RpsLimiter
	}
	
	public listen(port: number): void {
		this._express.listen(port, () => console.log(`listening on port ${port}!`))
	}
	
	
	
	public registerGetRoutes = (...apiServices: ApiServiceRegistrationFormat[]): void => {
		apiServices.forEach(this.registerGetRoute)
	}
	
	private registerGetRoute = (apiService: ApiServiceRegistrationFormat): void => {
		this._express.get(`/api/${apiService.api}`, async (req: Request, res: Response): Promise<any> => {
			
			if (!this._rpsLimiter.isWithinRate()) return res.json({ message: "RPS Limit!" })
			
			try {
				res.json(await apiService.func(req.query))
			} catch (e) {
				res.status(400).json(e.message)
			}
		})
	}
	
}

