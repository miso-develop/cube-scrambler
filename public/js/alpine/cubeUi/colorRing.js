/* eslint no-undef: 0 */
/* eslint no-useless-escape: 0 */
export const colorRing = () => {
	Alpine.directive("color-ring", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "color-ring-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.colorRing = id
		
		
		
		const classList = {
			frame: [
				"z-50",
				"fixed",
				"grid",
				"grid-cols-3",
				"grid-rows-6",
			],
			
			outer: [
				"w-20",
				"h-20",
				"md:w-16",
				"md:h-16",
				
				"flex",
				"justify-center",
				"items-center",
				"row-span-2",
				"z-50",
			],
			
			inner: [
				"w-10/12",
				"h-5/6",
				"rounded-full",
				"border",
				"z-50",
			],
		}
		
		
		
		Alpine.data("colorRingData", () => ({
			
			colorRingOpen: false,
			
			toggleColorRing: function(event, el, frame) {
				event.preventDefault()
				this.colorRingOpen = true
				
				// MEMO: リング表示位置の補正
				const correctPosition = window.innerWidth < 640 ? 82 : 73
				const elementPosition = el.getBoundingClientRect()
				
				frame.style.top = `${elementPosition.top - correctPosition}px`
				frame.style.left = `${elementPosition.left - correctPosition}px`
			},
			
			changeColor: function(color) {
				this.$store.cube.selectedFace = this.direction ? this.direction : this.$store.cube.selectedFace
				this.$store.cube.state[this.$store.cube.selectedFace][this.index] = color
			},
			
			
			
			calcRadian: (x, y) => (Math.atan2(x, y) + Math.PI) / Math.PI / 2,
			
			swipeState: {
				start: { x: 0, y: 0 },
				end: { x: 0, y: 0 },
			},
			
			fetchXY: (event) => {
				const _event = event.clientX ? event : event.touches[0]
				return {
					x: _event.clientX,
					y: _event.clientY,
				}
			},
			
			isSwiping: function() {
				return ![
					this.swipeState.start.x,
					this.swipeState.start.y,
				].some(position => position === -1)
			},
			
			isSwiped: function() {
				return ![
					this.swipeState.start.x,
					this.swipeState.start.y,
					this.swipeState.end.x,
					this.swipeState.end.y,
				].some(position => position === -1)
			},
			
			swipeStart: function(event) {
				event.preventDefault()
				
				this.swipeState.start = this.fetchXY(event)
				this.swipeState.end = { x: -1, y: -1 }
			},
			
			swipeMove: function(event) {
				event.preventDefault()
				if (!this.isSwiping()) return
				
				this.swipeState.end = this.fetchXY(event)
			},
			
			swipeEnd: function(event) {
				event.preventDefault()
				if (!this.isSwiped()) return
				
				const diffX = Math.round(this.swipeState.end.x - this.swipeState.start.x)
				const diffY = Math.round(this.swipeState.end.y - this.swipeState.start.y)
				const radian = this.calcRadian(diffX, diffY)
				
				const thresholdDistance = 35 // MEMO: この値以上スワイプしないとダメな距離
				if (Math.abs(diffX) < thresholdDistance && Math.abs(diffY) < thresholdDistance) return
				
				let color = ""
				if (radian >= 0.92 || radian < 0.08) color = "yellow"
				if (radian >= 0.75 && radian < 0.92) color = "red"
				if (radian >= 0.58 && radian < 0.75) color = "blue"
				if (radian >= 0.42 && radian < 0.58) color = "white"
				if (radian >= 0.25 && radian < 0.42) color = "orange"
				if (radian >= 0.08 && radian < 0.25) color = "green"
				
				this.changeColor(color)
				
				this.swipeState.start = { x: -1, y: -1 }
			},
			
		}))
		
		
		
		const html = /* html */ `
			<div id="${id}" x-data="colorRingData"
				@pointerdown="toggleColorRing(event, $el, $refs.colorRingFrame)"
				@touchstart="swipeStart(event)"
				@touchmove="swipeMove(event)"
				@touchend="swipeEnd(event)"
				class="relative z-50 w-full h-full">
				
				<template x-teleport="body">
					
					
					
					<div
						x-show="colorRingOpen"
						x-transition
						x-ref="colorRingFrame"
						
						@click.away="colorRingOpen=false"
						@pointerup.away="colorRingOpen=false"
						@touchend.away="colorRingOpen=false"
						@mouseup.away="colorRingOpen=false"
						
						class="${classList.frame.join(" ")}">
						
						
						
						
						<div
							@pointerup="changeColor('yellow')"
							class="${classList.outer.join(" ")} col-start-2">
							<div
								@pointerup="changeColor('yellow')"
								class="${classList.inner.join(" ")} bg-yellow-400 border-white"></div>
						</div>
						
						<div
							@pointerup="changeColor('green')"
							class="${classList.outer.join(" ")} col-start-1">
							<div
								@pointerup="changeColor('green')"
								class="${classList.inner.join(" ")} bg-green-500 border-white"></div>
						</div>
						
						<div
							@pointerup="changeColor('red')"
							class="${classList.outer.join(" ")}">
							<div
								@pointerup="changeColor('red')"
								class="${classList.inner.join(" ")} bg-red-500 border-white"></div>
						</div>
						
						<div class="${classList.outer.join(" ")} col-start-2"></div>
						
						<div
							@pointerup="changeColor('orange')"
							class="${classList.outer.join(" ")}">
							<div
								@pointerup="changeColor('orange')"
								class="${classList.inner.join(" ")} bg-orange-400 border-white"></div>
						</div>
						
						<div
							@pointerup="changeColor('blue')"
							class="${classList.outer.join(" ")}">
							<div
								@pointerup="changeColor('blue')"
								class="${classList.inner.join(" ")} bg-blue-500 border-white"></div>
						</div>
						
						<div
							@pointerup="changeColor('white')"
							class="${classList.outer.join(" ")} col-start-2">
							<div
								@pointerup="changeColor('white')"
								class="${classList.inner.join(" ")} bg-white border-neutral-400"></div>
						</div>
						
					</div>
				</template>
			</div>
		`
		el.innerHTML += html
		
	})
}
