import { config } from "./config.js"

export const log = console.log
export const dbg = (...v) => config.DEBUG && log(...v)
export const dev = (...v) => config.ENV === "dev" && log(...v)

export class AbortableSleep {
	private _controller: AbortController = new AbortController()
	
	public readonly isAborted = () => this._controller.signal.aborted
	
	public readonly resetController = () => this._controller = new AbortController()
	
	public readonly sleep = (
		ms: number,
		options?: { controller?: { signal: AbortSignal }; throwError?: boolean }
	):Promise<void> => new Promise((res, rej) => {
		const { signal } = options?.controller || this._controller
		
		const abortListener = () => { clearTimeout(timeoutId); removeListener(); abort() }
		const removeListener = () => signal.removeEventListener("abort", abortListener)
		const abort = () => options?.throwError ? rej(new Error(signal.reason)) : res()
		
		if (signal.aborted) abort()
		const timeoutId = setTimeout(() => res(removeListener()), ms)
		signal.addEventListener("abort", abortListener)
	})
	
	public readonly abort = <T>(reason?: T): void => {
		this._controller.abort(reason)
	}
}

export const abortableSleep = new AbortableSleep()
export const sleep = abortableSleep.sleep
export const abortSleep = abortableSleep.abort

export const envBoolean = (envValue: string | undefined): boolean => envValue?.toLowerCase() === "true"
export const envNumber = (envValue: string | undefined): number => Number(envValue)

export const generateId = () => Math.random().toString(36).slice(2)

export const shuffleArray = <T>(array: T[]): T[] => {
	const cloneArray = [...array]
	for (let i = cloneArray.length - 1; i >= 0; i--) {
		const rand = Math.floor(Math.random() * (i + 1))
		const tmpStorage = cloneArray[i]
		cloneArray[i] = cloneArray[rand]
		cloneArray[rand] = tmpStorage
	}
	return cloneArray
}

export const getYYYYMMDD = (date: Date): string => {
	const y = date.getFullYear()
	const m = date.getMonth() + 1
	const d = date.getDate()
	
	const yyyy = y
	const mm = ("00" + m).slice(-2)
	const dd = ("00" + d).slice(-2)
	
	return yyyy + mm + dd
}


export const getHHMMSS = (date: Date): string => {
	const h = date.getHours()
	const m = date.getMinutes()
	const s = date.getSeconds()
	
	const hh = ("00" + h).slice(-2)
	const mm = ("00" + m).slice(-2)
	const ss = ("00" + s).slice(-2)
	
	return hh + mm + ss
}

export const formatJstDate = (date): string => date.toLocaleString({ timeZone: "Asia/Tokyo" })

export const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

export const stoppableFunc = (func) => {
	let running = true
	
	return async () => {
		if (!running) process.exit()
		
		running = false
		await func()
		running = true
	}
}

export const sequenciableFuncs = (...funcs) => {
	const max = funcs.length - 1
	let num = 0
	
	return async () => {
		await funcs[num]()
		num = ++num > max ? 0 : num
	}
}

export const reverseObject = <T extends object, U extends object>(object: T): U => Object.fromEntries(Object.entries(object).map(entry => entry.reverse()))

export const arrayEquals = <T>(arrayA: T[], arrayB: T[]): boolean => arrayA.every(v => arrayB.includes(v))

export const timeoutClosure = () => {
	const startTime = new Date().getTime()
	return (timeoutMSec: number): boolean => new Date().getTime() - startTime > timeoutMSec
}

export class StopWatch {
	private _timer = { _default: undefined }
	public start = (tag: string = "_default"): void => { this._timer[tag] = new Date().valueOf() }
	public wrap = (tag: string = "_default"): number | undefined => this._timer[tag] && new Date().valueOf() - this._timer[tag]
}
export const stopWatch = new StopWatch()
