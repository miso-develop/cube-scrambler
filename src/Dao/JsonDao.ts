import fs from "node:fs/promises"
import path from "node:path"

export class JsonDao {
	private readonly _PROJECT_ROOT = path.dirname(process.argv[1].match(/(.*dist)/)![0])
	private readonly _DATA_DIR_NAME = "data"
	private readonly _DATA_DIR_PATH = path.join(this._PROJECT_ROOT, this._DATA_DIR_NAME)
	
	private readonly _filePath: string
	
	constructor(fileName: string) {
		this._filePath = path.join(this._DATA_DIR_PATH, fileName)
	}
	
	public async load<T>(initData?: T): Promise<T> {
		if (!(await this._exists(this._filePath))) await this.save(initData || {})
		
		const buffer = await fs.readFile(this._filePath)
		const dataStr = buffer.toString()
		const data = JSON.parse(dataStr)
		return data
	}
	
	public async save<T>(json: T): Promise<void> {
		if (!(await this._exists(this._DATA_DIR_PATH))) await fs.mkdir(this._DATA_DIR_PATH)
		await fs.writeFile(this._filePath, JSON.stringify(json))
	}
	
	private async _exists(path: string): Promise<boolean> {
		try {
			return !!(await fs.lstat(path))
		} catch (e) {
			return false
		}
	}
}
