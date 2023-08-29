import type { Mock, Mocked } from "vitest"
import { CubeChampleApiCache } from "src/SequenceGenerator/CubeChampleApi/CubeChampleApiCache.js"

import { CubeChampleApi } from "src/SequenceGenerator/CubeChampleApi/CubeChampleApi.js"
import { ScrambleDao } from "src/Dao/ScrambleDao/ScrambleDao.js"
import { ScrambleJsonDao } from "src/Dao/ScrambleDao/ScrambleJsonDao.js"
import { scrambleDaoFactory } from "src/factories.js"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "src/utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "src/types.js"

vi.mock("src/SequenceGenerator/CubeChampleApi/CubeChampleApi.js")
vi.mock("src/Dao/ScrambleDao/ScrambleJsonDao.js")

describe("CubeChampleApiCache", () => {
	beforeEach(() => {
		! (CubeChampleApi.request as Mock).mockClear()
		! (ScrambleJsonDao.load as Mock).mockClear()
		! (ScrambleJsonDao.save as Mock).mockClear()
	})

	describe("fetch", () => {
		test("キャッシュが空の場合、ロードと更新が行われる", async () => {
			const mockCachedScramble: CubeChampleApiResult[] = [{ facelets: "URFDLB...", sequence: "R U R' U'" }]
			const mockUpdatedScramble: CubeChampleApiResult[] = [{ facelets: "FURBLD...", sequence: "U R U' R'" }]
			
			! (CubeChampleApi.request as Mock).mockResolvedValue([...mockUpdatedScramble])
			! (ScrambleJsonDao.load as Mock).mockResolvedValue({})
			
			const result = await CubeChampleApiCache.fetch(SCRAMBLE_TYPE.random)
			
			expect(CubeChampleApi.request).toHaveBeenCalledWith({
				n: 100,
				t: SCRAMBLE_TYPE.random,
			})
			expect(ScrambleJsonDao.load).toHaveBeenCalled()
			expect(ScrambleJsonDao.save).toHaveBeenCalled()
			// 正しい結果が返されたか確認
			expect(result).toEqual(mockUpdatedScramble[0])
		})

		test("キャッシュが空でない場合、キャッシュから取得される", async () => {
			const mockCachedScramble: CubeChampleApiResult[] = [{ facelets: "URFDLB...", sequence: "R U R' U'" }]
			
			! (CubeChampleApi.request as Mock).mockResolvedValue([...mockCachedScramble])
			! (ScrambleJsonDao.load as Mock).mockResolvedValue({ [SCRAMBLE_TYPE_KEYS[SCRAMBLE_TYPE.random]]: [...mockCachedScramble] })
			
			const result = await CubeChampleApiCache.fetch(SCRAMBLE_TYPE.random)
			
			expect(CubeChampleApi.request).not.toHaveBeenCalled()
			expect(ScrambleJsonDao.load).toHaveBeenCalled()
			expect(ScrambleJsonDao.save).toHaveBeenCalled()
			expect(result).toEqual(mockCachedScramble[0])
		})

		test("キャッシュが空でないが指定したタイプのキャッシュも空の場合、更新が行われる", async () => {
			const mockCachedScramble: CubeChampleApiResult[] = [{ facelets: "URFDLB...", sequence: "R U R' U'" }]
			const mockUpdatedScramble: CubeChampleApiResult[] = [{ facelets: "FURBLD...", sequence: "U R U' R'" }]
			
			! (CubeChampleApi.request as Mock).mockResolvedValue([...mockUpdatedScramble])
			! (ScrambleJsonDao.load as Mock).mockResolvedValue({
				[SCRAMBLE_TYPE_KEYS[SCRAMBLE_TYPE.random]]: [...mockCachedScramble],
				[SCRAMBLE_TYPE_KEYS[SCRAMBLE_TYPE.cornerOnly]]: [],
			})
			
			const result = await CubeChampleApiCache.fetch(SCRAMBLE_TYPE.cornerOnly)
			
			expect(CubeChampleApi.request).toHaveBeenCalledWith({
				n: 100,
				t: SCRAMBLE_TYPE.cornerOnly,
			})
			expect(ScrambleJsonDao.load).toHaveBeenCalled()
			expect(ScrambleJsonDao.save).toHaveBeenCalled()
			expect(result).toEqual(mockUpdatedScramble[0])
		})
	})
	
})
