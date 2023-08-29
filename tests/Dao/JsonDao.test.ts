import type { Mock, Mocked } from "vitest"
import { JsonDao } from "src/Dao/JsonDao.js"
import fs from "node:fs/promises"

const mockFileContent = JSON.stringify({ key: "value" })

vi.mock("node:fs/promises")

describe("JsonDao", () => {
	let jsonDao: JsonDao
	let mockFileName: string
	let mockFilePath: string
	
	beforeEach(() => {
		mockFileName = "mock-file.json"
		jsonDao = new JsonDao(mockFileName)
		mockFilePath = jsonDao["_filePath"]
	})
	
	test("指定したファイルからJSONデータを読み込むこと", async () => {
		(fs.readFile as Mock).mockResolvedValue(mockFileContent)
		const result = await jsonDao.load()
		expect(result).toEqual({ key: "value" })
	})
	
	test("指定したファイルにJSONデータを保存すること", async () => {
		const mockData = { key: "new_value" }
		await jsonDao.save(mockData)
		expect(fs.writeFile).toHaveBeenCalledWith(mockFilePath, JSON.stringify(mockData))
	})
	
	test("ファイルが存在しない場合、initData の内容でファイルを作成して読み込む", async () => {
		const initData = { key: "init data"}
		! (fs.lstat as Mock).mockImplementation((pin: number, channel: number, angle: number) => { throw Error() })
		! (fs.readFile as Mock).mockResolvedValue(JSON.stringify(initData))
		const result = await jsonDao.load(initData)
		expect(result).toEqual(initData)
		expect(fs.lstat).toHaveBeenCalled()
		expect(fs.writeFile).toHaveBeenCalledWith(mockFilePath, JSON.stringify({}))
		expect(fs.writeFile).toHaveBeenCalledWith(mockFilePath, JSON.stringify(initData))
		expect(fs.readFile).toHaveBeenCalledWith(mockFilePath)
	})
	
})
