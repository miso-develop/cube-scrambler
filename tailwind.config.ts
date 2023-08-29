import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

export default {
	content: ["./public/**/*.{html,js}"],
	theme: {
		extend: {},
	},
	plugins: [
		plugin(function({ addVariant }) {
			addVariant("not-last", "&:not(:last-child)")
		})
	],
} satisfies Config
