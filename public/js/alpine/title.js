/* eslint no-undef: 0 */
export const title = () => {
	Alpine.directive("title", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		
		const title = "Cube Scrambler"
		
		const html = /* html */ `
			<div class="relative flex flex-col items-center mb-4 md:mb-10">
				<h1 x-text="'${title}'" class="text-4xl md:text-5xl font-black text-neutral-800"></h1>
			</div>
		`
		el.innerHTML += html
	})
}
