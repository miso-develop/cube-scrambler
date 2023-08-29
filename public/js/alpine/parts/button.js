/* eslint no-undef: 0 */
export const button = () => {
	Alpine.directive("button", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "button-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.button = id
		
		const expressionObject = JSON.parse(expression)
		const text = expressionObject.text
		const color = expressionObject.color || "black"
		
		
		
		const color2Style = {
			"black":	["text-neutral-600", "bg-white", "border-neutral-600",   "active:text-white", "active:bg-neutral-600"],
			"red":		["text-red-600", "bg-white", "border-red-600",   "active:text-white", "active:bg-red-600"],
			"blue":		["text-blue-600", "bg-white", "border-blue-600",   "active:text-white", "active:bg-blue-600"],
			"green":	["text-green-600", "bg-white", "border-green-600",   "active:text-white", "active:bg-green-600"],
			"yellow":	["text-yellow-500", "bg-white", "border-yellow-500",   "active:text-white", "active:bg-yellow-500"],
			"orange":	["text-orange-500", "bg-white", "border-orange-500",   "active:text-white", "active:bg-orange-500"],
			
			// MEMO: reverse
			// "black":	["text-white", "bg-neutral-600", "border-neutral-600",   "active:text-neutral-600", "active:bg-white"],
			// "red":		["text-white", "bg-red-600", "border-red-600",   "active:text-red-600", "active:bg-white"],
			// "blue":		["text-white", "bg-blue-600", "border-blue-600",   "active:text-blue-600", "active:bg-white"],
			// "green":	["text-white", "bg-green-600", "border-green-600",   "active:text-green-600", "active:bg-white"],
			// "yellow":	["text-white", "bg-yellow-500", "border-yellow-500",   "active:text-yellow-500", "active:bg-white"],
			// "orange":	["text-white", "bg-orange-500", "border-orange-500",   "active:text-orange-500", "active:bg-white"],
		}
		
		
		
		const classList = [
			"inline-flex",
			"items-center",
			"justify-center",
			"font-medium",
			"tracking-wide",
			"transition-colors",
			"duration-100",
			"rounded-lg",
			"w-full",
			
			"border-4",
			"px-8",
			"py-4",
			
			"text-xl",
			"md:text-2xl",
			
			"disabled:bg-neutral-200",
			
			...color2Style[color],
		]
		
		
		
		const html = /* html */ `
			<button type="button"
				id="${id}"
				class="${classList.join(" ")}">
				${text}
			</button>
		`
		el.innerHTML += html
		
	})
}
