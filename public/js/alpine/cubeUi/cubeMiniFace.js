/* eslint no-undef: 0 */
/* eslint no-useless-escape: 0 */
export const cubeMiniFace = () => {
	Alpine.directive("cube-mini-face", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "cube-mini-face-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.cubeMiniFace = id
		
		const direction = modifiers[0]
		
		const direction2Color = {
			"up": "yellow",
			"right": "red",
			"front": "blue",
			"down": "white",
			"left": "orange",
			"back": "green",
		}
		const color = direction2Color[direction]
		
		
		
		const color2BgColorClass = {
			white: "bg-white",
			yellow: "bg-yellow-400",
			green: "bg-green-500",
			blue: "bg-blue-500",
			red: "bg-red-500",
			orange: "bg-orange-400",
		}
		
		const classList = {
			frame: [
				"grid",
				"grid-cols-3",
				"grid-rows-3",
				
				"border-t",
				"border-l",
				"border-neutral-700",
			],
			
			cell: [
				"w-5",
				"h-5",
				
				"border-b",
				"border-r",
				"border-neutral-700",
				color2BgColorClass[color],
			],
		}
		
		
		
		Alpine.data("cubeMiniFaceData", () => ({
			changeColor: function(newColor, oldColor, el) {
				const color2BgColorClass = {
					"white": "bg-white",
					"yellow": "bg-yellow-400",
					"green": "bg-green-500",
					"blue": "bg-blue-500",
					"red": "bg-red-500",
					"orange": "bg-orange-400",
				}
				
				el.classList.remove(color2BgColorClass[oldColor])
				el.classList.add(color2BgColorClass[newColor])
			},
		}))
		
		
		
		const html = /* html */ `
			<div id="${id}"
				x-data="cubeMiniFaceData"
				@click="$store.cube.selectFace('${direction}')"
				class="${classList.frame.join(" ")}">
				
				<div class="${classList.cell.join(" ")}"
					x-init="$watch('$store.cube.state.${direction}[0]', (...colors) => changeColor(...colors, $el))"
				></div>
				
				<div class="${classList.cell.join(" ")}"
					x-init="$watch('$store.cube.state.${direction}[1]', (...colors) => changeColor(...colors, $el))"
				></div>
				
				<div class="${classList.cell.join(" ")}"
					x-init="$watch('$store.cube.state.${direction}[2]', (...colors) => changeColor(...colors, $el))"
				></div>
				
				<div class="${classList.cell.join(" ")}"
					x-init="$watch('$store.cube.state.${direction}[3]', (...colors) => changeColor(...colors, $el))"
				></div>
				
				<div class="${classList.cell.join(" ")}"></div> <!-- MEMO: center cell -->
				
				<div class="${classList.cell.join(" ")}"
					x-init="$watch('$store.cube.state.${direction}[5]', (...colors) => changeColor(...colors, $el))"
				></div>
				
				<div class="${classList.cell.join(" ")}"
					x-init="$watch('$store.cube.state.${direction}[6]', (...colors) => changeColor(...colors, $el))"
				></div>
				
				<div class="${classList.cell.join(" ")}"
					x-init="$watch('$store.cube.state.${direction}[7]', (...colors) => changeColor(...colors, $el))"
				></div>
				
				<div class="${classList.cell.join(" ")}"
					x-init="$watch('$store.cube.state.${direction}[8]', (...colors) => changeColor(...colors, $el))"
				></div>
				
			</div>
		`
		el.innerHTML += html
		
	})
}
