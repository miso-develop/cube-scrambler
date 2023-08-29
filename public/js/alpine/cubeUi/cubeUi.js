/* eslint no-undef: 0 */
export const cubeUi = () => {
	Alpine.directive("cube-ui", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "cube-ui-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.cubeUi = id
		
		const html = /* html */ `
			<div class="grid grid-cols-4 grid-rows-3   gap-1 md:gap-3">
				<div x-cube-face.up class="col-start-2"></div>
				
				<div x-cube-face.left class="col-start-1"></div>
				<div x-cube-face.front></div>
				<div x-cube-face.right></div>
				<div x-cube-face.back></div>
				
				<div x-cube-face.down class="col-start-2"></div>
			</div>
		`
		el.innerHTML += html
	})
}
