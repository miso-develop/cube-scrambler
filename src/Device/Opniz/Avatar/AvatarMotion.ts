import type { AvatarCore } from "./AvatarCore.js"
import type { AvatarState } from "./AvatarState.js"
import { AvatarMotionQueue } from "./AvatarMotionQueue.js"
import type { MotionDefinition } from "./AvatarMotionQueue.js"
import { AvatarEye } from "./AvatarParts/AvatarEye.js"
import type { Eye, Eyes } from "./AvatarParts/AvatarEye.js"
import { AvatarEyebrow } from "./AvatarParts/AvatarEyebrow.js"
import type { Eyebrow, Eyebrows } from "./AvatarParts/AvatarEyebrow.js"
import { AvatarMouse } from "./AvatarParts/AvatarMouse.js"
import type { Mouse } from "./AvatarParts/AvatarMouse.js"
import { AvatarEmotionMark } from "./AvatarParts/AvatarEmotionMark.js"
import type { EmotionMark } from "./AvatarParts/AvatarEmotionMark.js"
import { AvatarFace } from "./AvatarFace.js"
import type { Face } from "./AvatarFace.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../../utils.js"
// import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../types.js"

export class AvatarMotion {
	private readonly _core: AvatarCore
	private readonly _state: AvatarState
	private readonly _motionQueue: AvatarMotionQueue
	
	private readonly _eyebrow: AvatarEyebrow
	private readonly _eye: AvatarEye
	private readonly _mouse: AvatarMouse
	private readonly _emotionMark: AvatarEmotionMark
	private readonly _face: typeof AvatarFace
	
	constructor(core: AvatarCore, state: AvatarState) {
		this._core = core
		this._state = state
		this._motionQueue = new AvatarMotionQueue(this._core, this._state)
		
		this._eyebrow = new AvatarEyebrow(this._core)
		this._eye = new AvatarEye(this._core)
		this._mouse = new AvatarMouse(this._core)
		this._emotionMark = new AvatarEmotionMark(this._core)
		this._face = AvatarFace
	}
	
	
	
	public async keep(
		initFace: Face,
		motionDefinitions: Omit<MotionDefinition, "next">[],
		postMotions: (() => void)[] = []
	): Promise<void> {
		try {
			// 表情初期化
			await this.drawFace(initFace)
			
			// ループ処理
			this._motionQueue.initMotionDefinitions(...motionDefinitions)
			await this._motionQueue.execMotions()
			
			// 停止後処理
			for (let i = 0; i < postMotions.length; i++) await postMotions[i]()
			await this.eraseEmotionMark()
			
			this._state.updateStopping(false)
			
		} catch (e) {
			log(e.message)
		}
	}
	
	
	
	// ======== base motions ======== ======== ======== ========
	public async drawEyebrows(time = 0, char?: Eyebrows | Eyebrow): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._eyebrow.draws(char))
		await this._core.sleep(time)
	}
	
	public async offsetDrawEyebrows(time = 0, x, y): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._eyebrow.offsetDraws(x, y))
		await this._core.sleep(time)
	}
	
	public async eraseEyebrows(time = 0): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._eyebrow.erases())
		await this._core.sleep(time)
	}
	
	public async drawEyes(time = 0, char?: Eyes | Eye): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._eye.draws(char))
		await this._core.sleep(time)
	}
	
	public async offsetDrawEyes(time = 0, x, y): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._eye.offsetDraws(x, y))
		await this._core.sleep(time)
	}
	
	public async eraseEyes(time = 0): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._eye.erases())
		await this._core.sleep(time)
	}
	
	public async drawMouse(time = 0, char?: Mouse): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._mouse.draw(char))
		await this._core.sleep(time)
	}
	
	public async offsetDrawMouse(time = 0, x, y): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._mouse.offsetDraw(x, y))
		await this._core.sleep(time)
	}
	
	public async eraseMouse(time = 0): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._mouse.erase())
		await this._core.sleep(time)
	}
	
	public async drawEmotionMark(time = 0, char?: EmotionMark): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._emotionMark.draw(char))
		await this._core.sleep(time)
	}
	
	public async offsetDrawEmotionMark(time = 0, x, y): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._emotionMark.offsetDraw(x, y))
		await this._core.sleep(time)
	}
	
	public async eraseEmotionMark(time = 0): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec(this._emotionMark.erase())
		await this._core.sleep(time)
	}
	
	
	
	// ======== offset motions ======== ======== ======== ========
	public async randomOffsetEyebrows(time = 1000, amplitude = 500): Promise<void> {
		const x = random(-1, 1)
		const y = random(-1, 1)
		const randomTime = random(time - amplitude, time + amplitude)
		await this.offsetEyebrows(x, y, randomTime)
	}
	
	public async offsetEyebrows(x: number, y: number, time = 1000): Promise<void> {
		await this.offsetDrawEyebrows(0, x, y)
		await this._core.sleep(time)
		await this.drawEyebrows()
	}
	
	public async randomOffsetEyes(time = 1000, amplitude = 500): Promise<void> {
		const x = random(-1, 1)
		const y = random(-1, 1)
		const randomTime = random(time - amplitude, time + amplitude)
		await this.offsetEyes(x, y, randomTime)
	}
	
	public async offsetEyes(x: number, y: number, time = 1000): Promise<void> {
		await this.offsetDrawEyes(0, x, y)
		await this._core.sleep(time)
		await this.drawEyes()
	}
	
	public async randomOffsetMouse(time = 1000, amplitude = 500): Promise<void> {
		const x = random(-1, 1)
		const y = random(-1, 1)
		const randomTime = random(time - amplitude, time + amplitude)
		await this.offsetMouse(x, y, randomTime)
	}
	
	public async offsetMouse(x: number, y: number, time = 1000): Promise<void> {
		await this.offsetDrawMouse(0, x, y)
		await this._core.sleep(time)
		await this.drawMouse()
	}
	
	public async randomOffsetEmotionMark(time = 1000, amplitude = 500): Promise<void> {
		const x = random(-1, 1)
		const y = random(-1, 1)
		const randomTime = random(time - amplitude, time + amplitude)
		await this.offsetEmotionMark(x, y, randomTime)
	}
	
	public async offsetEmotionMark(x: number, y: number, time = 1000): Promise<void> {
		await this.offsetDrawEmotionMark(0, x, y)
		await this._core.sleep(time)
		await this.drawEmotionMark()
	}
	
	
	
	// ======== face motions ======== ======== ======== ========
	public async randomFace(): Promise<void> {
		await this.drawFace(this._face.random())
	}
	
	public async drawFace(face: Face): Promise<void> {
		if (this._state.isStopping()) return
		await this._core.exec([
			face.eyebrows ? this._eyebrow.draws(face.eyebrows) : this._eyebrow.erases(),
			this._eye.draws(face.eyes),
			this._mouse.draw(face.mouse),
			face.emotionMark ? this._emotionMark.draw(face.emotionMark) : this._emotionMark.erase(),
		].flat())
	}
	
	
	
	// ======== eyebrow motions ======== ======== ======== ========
	public async randomUpDownEyebrow(speed = 100): Promise<void> {
		const pattern = [1, 2, 2]
		const count = pattern[random(0, pattern.length - 1)]
		await this.upDownEyebrow(count, speed)
	}
	
	public async upDownEyebrow(count = 1, speed = 100): Promise<void> {
		for (let i = 0; i < count; i++) {
			await this.offsetDrawEyebrows(speed, 0, -1)
			await this.drawEyebrows(speed)
		}
	}
	
	
	
	// ======== eye motions ======== ======== ======== ========
	public async randomWink(speed = 50): Promise<void> {
		const pattern = [1, 1, 1, 2]
		const count = pattern[random(0, pattern.length - 1)]
		await this.wink(count, speed)
	}
	
	public async wink(count = 1, speed = 50): Promise<void> {
		for (let i = 0; i < count; i++) {
			await this.eraseEyes(speed)
			await this.drawEyes(speed)
		}
	}
	
	public async closeEyes(time = 1500, amplitude = 500): Promise<void> {
		const randomTime = random(time - amplitude, time + amplitude)
		const currentChar = this._eye.getCurrent()[0].char
		await this.drawEyes(randomTime, "-")
		await this.drawEyes(0, currentChar)
	}
	
	
	
	// ======== mouse motions ======== ======== ======== ========
	public async eat(speed = 100): Promise<void> {
		const currentChar = this._mouse.getCurrent().char
		await this.drawMouse(speed * 2, "あ")
		for (let i = 0; i < 3; i++) {
			await this.drawMouse(speed, "~")
			await this.drawMouse(speed, "-")
		}
		await this.drawMouse(0, currentChar)
	}
	
	public async talk(speed = 100): Promise<void> {
		const currentChar = this._mouse.getCurrent().char
		for (let i = 0; i < 3; i++) {
			await this.drawMouse(speed, "あ")
			await this.drawMouse(speed, "-")
		}
		await this.drawMouse(0, currentChar)
	}
	
	
	
	// ======== emotions ======== ======== ======== ========
	public async complete(): Promise<void> {
		await this.drawFace(this._face.happy)
		for (let i = 0; i < 2; i++) {
			await this.upDownEyebrow(2, 50)
			await sleep(500)
		}
	}
	
	public async surprise(): Promise<void> {
		await this.drawFace(this._face.surprise)
		await this.wink(4, 25)
		await this.eraseEmotionMark()
	}
	
}
