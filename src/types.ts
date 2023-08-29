import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "./utils.js"



export type TurnDirection = 1 | -1



export type ArmState = "hold" | "release"



export type Face = "F" | "U" | "R" | "B" | "D" | "L"
export type FacePosition = "f" | "u" | "r" | "b" | "d" | "l"

export type FullFace = { [K in FacePosition]: Face }

export type FaceLine = [Face, Face, Face, Face]

export type CubeState = Omit<FullFace, "b" | "d" | "l">



// export const BASIC_MOVE_LIST = [ "F", "U", "R", "B", "D", "L" ] as const
// export const BASIC_PRIME_MOVE_LIST = BASIC_MOVE_LIST.map(move => `${move}'`)
// export const BASIC_TWO_MOVE_LIST = BASIC_MOVE_LIST.map(move => `${move}2`)
// export const BASIC_PRIME_TWO_MOVE_LIST = BASIC_PRIME_MOVE_LIST.map(move => `${move}2`)
// export const BASIC_MOVE_ALL_LIST = [
// 	...BASIC_MOVE_LIST,
// 	...BASIC_PRIME_MOVE_LIST,
// 	...BASIC_TWO_MOVE_LIST,
// 	...BASIC_PRIME_TWO_MOVE_LIST,
// ]

export const BASIC_MOVE_LIST = [
	"F", "F2", "F'", "F'2",
	"U", "U2", "U'", "U'2",
	"R", "R2", "R'", "R'2",
	"B", "B2", "B'", "B'2",
	"D", "D2", "D'", "D'2",
	"L", "L2", "L'", "L'2",
] as const

export const SLICE_MOVE_LIST = [
	"M", "M2", "M'", "M'2",
	"E", "E2", "E'", "E'2",
	"S", "S2", "S'", "S'2",
] as const

export const WIDE_MOVE_LIST = [
	"Fw", "F'w", "Fw2", "F'w2",
	"Uw", "U'w", "Uw2", "U'w2",
	"Rw", "R'w", "Rw2", "R'w2",
	"Bw", "B'w", "Bw2", "B'w2",
	"Dw", "D'w", "Dw2", "D'w2",
	"Lw", "L'w", "Lw2", "L'w2",
] as const

export const ROTATION_MOVE_LIST = [
	"x", "x2", "x'", "x'2",
	"y", "y2", "y'", "y'2",
	"z", "z2", "z'", "z'2",
] as const

export const MOVE_LIST = [
	...BASIC_MOVE_LIST,
	...SLICE_MOVE_LIST,
	...WIDE_MOVE_LIST,
	...ROTATION_MOVE_LIST,
] as const



export type BasicMove = (typeof BASIC_MOVE_LIST)[number]
export type SliceMove = (typeof SLICE_MOVE_LIST)[number]
export type WideMove = (typeof WIDE_MOVE_LIST)[number]
export type RotationMove = (typeof ROTATION_MOVE_LIST)[number]
export type Move = BasicMove | SliceMove | WideMove | RotationMove



export const ROBOT_MOVE_LIST = [
	"D", "D2", "D'", "D'2",
	"x", "x2", "x3",
	"y", "y2", "y'", "y'2",
] as const

export type RobotMove = (typeof ROBOT_MOVE_LIST)[number]



export type Facelets = string
export type Sequence = string

export type CubeChampleApiResult = {
	facelets: Facelets
	sequence: Sequence
}



export type ScrambleData = {
	cornerOnly: CubeChampleApiResult[]
	edgeOnly: CubeChampleApiResult[]
	parity: CubeChampleApiResult[]
	nonParity: CubeChampleApiResult[]
}



export const SCRAMBLE_TYPE = {
	random: 0,
	cornerOnly: 1,
	edgeOnly: 2,
	parity: 3,
	nonParity: 4,
} as const

export type ScrambleType = (typeof SCRAMBLE_TYPE)[keyof typeof SCRAMBLE_TYPE]

export const SCRAMBLE_TYPE_KEYS = Object.keys(SCRAMBLE_TYPE)

export const SCRAMBLE_TYPE_REVERSE = reverseObject(SCRAMBLE_TYPE)



export type StepData = {
	"2": Facelets[]
	"3": Facelets[]
	"4": Facelets[]
	"5": Facelets[]
	"6": Facelets[]
	"7": Facelets[]
}



export type ApiServiceFunction = (query: any) => CubeChampleApiResult | Promise<CubeChampleApiResult>
export type ApiServiceRegistrationFormat = { api: string; func: ApiServiceFunction }

export type CliServiceFunction = (arg: string) => void | Promise<void>
export type CliServiceRegistrationFormat = { command: string; func: CliServiceFunction }
