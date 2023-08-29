/* eslint no-undef: 0 */
export const textInput = () => {
	Alpine.directive("text-input", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "text-input-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.textInput = id
		
		const placeholder = expression
		
		const classList = [
			"flex",
			"w-full",
			"h-16",
			"px-4",
			"py-2",
			"bg-white",
			"border-2",
			"rounded-md",
			"border-neutral-400",
			"ring-offset-background",
			"text-gray-700",
			"placeholder:text-neutral-400",
			"focus:border-neutral-300",
			"focus:outline-none",
			"focus:ring-2",
			"focus:ring-offset-2",
			"focus:ring-neutral-400",
			"disabled:cursor-not-allowed",
			"disabled:opacity-50",
			
			"text-lg",
			"md:text-2xl",
		]
		
		
		
		const html = /* html */ `
			<input type="text"
				id="${id}"
				placeholder="${placeholder}"
				class="${classList.join(" ")}"
			/>
		`
		el.innerHTML += html
		
	})
}
