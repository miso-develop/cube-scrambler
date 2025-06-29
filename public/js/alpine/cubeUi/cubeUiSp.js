/* eslint no-undef: 0 */
import { CubeCamScanner } from "../../cube-cam-scanner.js"

const {log} = console

export const cubeUiSp = () => {
	Alpine.directive("cube-ui-sp", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "cube-ui-sp-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.cubeUiSp = id
		
		Alpine.data("camScannerSpData", (scanButtonSelector) => ({
			scanner: undefined,
			
			cubeFaceElem: document.querySelector("div[x-cube-face]"),
			
			toast: Alpine.store("toast"),
			
			init: function() {
				if (!this.$el.parentNode.parentNode.checkVisibility()) return
				
				this.scanner = new CubeCamScanner(this.$el)
				document.querySelector(scanButtonSelector).addEventListener("click", () => this.scan())
			},
			
			scan: async function() {
				if (this.scanner.isScanning) { return this.stop() }
				console.log("[scan]")
				
				if(!this.scanner.isVideoReady()) this.toast.info("Loading camera...")
				
				const faceIndex = [
					"up",
					"front",
					"right",
					"back",
					"left",
					"down",
				].indexOf(this.$store.cube.selectedFace)
				
				const baseSize = this.cubeFaceElem.clientWidth
				const borderWidth = 4
				const areaSize = (baseSize / 8 * 10) + (borderWidth * 2)
				this.$el.style.width = areaSize + "px"
				this.$el.style.height = areaSize + "px"
				this.$el.style.top = (baseSize / 8 * -1) - borderWidth + "px"
				this.$el.style.display = "block"
				
				this.scanner.onscan = () => this.cubeFaceElem.style.visibility = "hidden"
				
				try {
					const scanColors = await this.scanner.scan(faceIndex)
					this.$store.cube.state[this.$store.cube.selectedFace] = scanColors
					console.log(scanColors)
				} catch(e) {
					this.toast.error("The camera could not be accessed!")
				}
				
				this.$el.style.display = "none"
				this.cubeFaceElem.style.visibility = "visible"
			},
			
			stop: function() {
				if (!this.scanner.isScanning) return
				console.log("[stop]")
				
				this.scanner.stop()
				
				this.$el.style.display = "none"
				this.cubeFaceElem.style.visibility = "visible"
			},
			
		}))
		
		
		
		Alpine.data("faceSelectData", () => ({
			faceElemList: undefined,
			
			init() {
				// 面elementの一覧取得
				this.faceElemList = Array.from(this.$el.querySelectorAll(":scope > div"))
				
				// 上面の選択状態css切り替え
				this.faceElemList[0].classList.add("selected-face-shadow")
			},
			
			select(face) {
				// 面選択状態css切り替え
				this.faceElemList.forEach(faceElem => faceElem.classList.remove("selected-face-shadow"))
				this.$el.classList.add("selected-face-shadow")
				
				// 面選択状態更新
				this.$store.cube.selectFace(face)
			},
			
		}))
		
		
		
		const html = /* html */ `
			<div class="grid gap-10">
				<div x-data="faceSelectData" class="grid grid-cols-4 grid-rows-3 gap-2">
					<div x-cube-mini-face.up @click="select('up')" class="col-start-2"></div>
					<div x-cube-mini-face.left @click="select('left')" class="col-start-1"></div>
					<div x-cube-mini-face.front @click="select('front')"></div>
					<div x-cube-mini-face.right @click="select('right')"></div>
					<div x-cube-mini-face.back @click="select('back')"></div>
					<div x-cube-mini-face.down @click="select('down')" class="col-start-2"></div>
					
					<div></div>
					<div class="w-[3.75rem]">
						<button class="scan-button flex justify-center items-center w-full h-full text-5xl">📸</button>
					</div>
				</div>
				
				<div class="flex justify-center relative">
					<div x-data="camScannerSpData('.scan-button')" @click.away="stop()" class="absolute left-auto overflow-hidden hidden"></div>
					<div x-cube-face></div>
				</div>
			</div>
		`
		el.innerHTML += html
	})
}
