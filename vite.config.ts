import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	test: {
		watch: false,
		globals: true,
		include: ["**/tests/**/*.test.ts", ],
		alias: { "src": path.join(__dirname, "src"), },
		coverage: {
			provider: "istanbul",
			exclude: [
				"src/Debugger.ts",
				"src/index.ts",
				"src/utils.ts",
				"src/types.ts",
				"src/calibration.ts",
				
				"src/Device/**/*.ts", // MEMO: 実機デバイスを扱うため別途テスト
				"src/Opniz/OpnizDevice.ts", // MEMO: 実機デバイスを扱うため別途テスト
				"src/Opniz/M5Device/*.ts", // MEMO: 実機デバイスを扱うため別途テスト
				"src/Avatar/**/*.ts", // MEMO: 実機デバイスを扱うため別途テスト
				"src/factories.ts", // MEMO: 実機デバイスを扱うため別途テスト
			],
		},
	},
})
