/* eslint no-undef: 0 */
export const cubeUiSp = () => {
	Alpine.directive("cube-ui-sp", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "cube-ui-sp-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.cubeUiSp = id
		
		const html = /* html */ `
			<div class="grid gap-10">
				<div class="grid grid-cols-4 grid-rows-3 gap-2">
					<div x-cube-mini-face.up class="col-start-2"></div>
					<div x-cube-mini-face.left class="col-start-1"></div>
					<div x-cube-mini-face.front></div>
					<div x-cube-mini-face.right></div>
					<div x-cube-mini-face.back></div>
					<div x-cube-mini-face.down class="col-start-2"></div>
				</div>
				
				<div class="flex justify-center">
					<div x-cube-face></div>
				</div>
			</div>
		`
		el.innerHTML += html
	})
}
