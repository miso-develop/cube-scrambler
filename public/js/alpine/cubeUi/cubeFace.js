/* eslint no-undef: 0 */
export const cubeFace = () => {
	Alpine.directive("cube-face", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "cube-face-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.cubeFace = id
		
		
		
		const direction = modifiers[0]
		
		const direction2Color = {
			"up": "yellow",
			"right": "red",
			"front": "blue",
			"down": "white",
			"left": "orange",
			"back": "green",
		}
		
		const color = direction2Color[direction] || "yellow"
		
		
		
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
				"border-t-4",
				"border-l-4",
				"md:border-t-2",
				"md:border-l-2",
				
				"grid",
				"grid-cols-3",
				"grid-rows-3",
				"border-neutral-700",
			],
			
			cell: [
				"w-20",
				"h-20",
				"md:w-12",
				"md:h-12",
				
				"border-b-4",
				"border-r-4",
				"md:border-b-2",
				"md:border-r-2",
				"border-neutral-700",
				
				color2BgColorClass[color],
			],
		}
		
		
		
		Alpine.data("cubeFaceData", () => ({
			changeCellColor: function(newColor, oldColor, el) {
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
		
		const createCubeCellDataString = (index) => `{ direction: ${direction ? "'" + direction + "'" : undefined }, index: ${index} }`
		const cubeCellWatchString = "$watch('$store.cube.state[direction || $store.cube.selectedFace][index]', (...colors) => changeCellColor(...colors, $el))"
		
		
		
		const html = /* html */ `
			<div id="${id}" x-data="cubeFaceData" class="${classList.frame.join(" ")}">
				
				<div x-data="${createCubeCellDataString(0)}" x-color-ring
					class="${classList.cell.join(" ")}"
					x-init="${cubeCellWatchString}"
				></div>
				
				<div x-data="${createCubeCellDataString(1)}" x-color-ring
					class="${classList.cell.join(" ")}"
					x-init="${cubeCellWatchString}"
				></div>
				
				<div x-data="${createCubeCellDataString(2)}" x-color-ring
					class="${classList.cell.join(" ")}"
					x-init="${cubeCellWatchString}"
				></div>
				
				<div x-data="${createCubeCellDataString(3)}" x-color-ring
					class="${classList.cell.join(" ")}"
					x-init="${cubeCellWatchString}"
				></div>
				
				<!-- MEMO: center cell -->
				<div x-data="${createCubeCellDataString(4)}"
					class="${classList.cell.join(" ")}"
					@touchstart="event.preventDefault()"
					x-init="${cubeCellWatchString}"
				></div>
				
				<div x-data="${createCubeCellDataString(5)}" x-color-ring
					class="${classList.cell.join(" ")}"
					x-init="${cubeCellWatchString}"
				></div>
				
				<div x-data="${createCubeCellDataString(6)}" x-color-ring
					class="${classList.cell.join(" ")}"
					x-init="${cubeCellWatchString}"
				></div>
				
				<div x-data="${createCubeCellDataString(7)}" x-color-ring
					class="${classList.cell.join(" ")}"
					x-init="${cubeCellWatchString}"
				></div>
				
				<div x-data="${createCubeCellDataString(8)}" x-color-ring
					class="${classList.cell.join(" ")}"
					x-init="${cubeCellWatchString}"
				></div>
				
			</div>
		`
		el.innerHTML += html
		
	})
}
