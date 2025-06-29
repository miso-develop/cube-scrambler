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
		}),
		
		function ({ addUtilities }) {
			addUtilities({
				".selected-face-shadow": {
					boxShadow: `0 0 1rem 0.1rem rgba(0, 255, 0, 1)`
				},
			})
		}
	],
} satisfies Config
