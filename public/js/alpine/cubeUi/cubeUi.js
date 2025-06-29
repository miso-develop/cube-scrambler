/* eslint no-undef: 0 */
import { CubeCamScanner } from "../../cube-cam-scanner.js"

const {log} = console

export const cubeUi = () => {
	Alpine.directive("cube-ui", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "cube-ui-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.cubeUi = id
		
		
		
		Alpine.data("camScannerPcData", (scanButtonSelector) => ({
			scanner: undefined,
			
			toast: Alpine.store("toast"),
			
			init() {
				if (!this.$el.parentNode.parentNode.checkVisibility()) return
				
				this.scanner = new CubeCamScanner(this.$el, { overlaySizeRatio: 0.6 })
				document.querySelector(scanButtonSelector).addEventListener("click", () => this.scan())
			},
			
			async scan() {
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
				
				this.$el.parentNode.style.display = "flex"
				
				try {
					const scanColors = await this.scanner.scan(faceIndex)
					this.$store.cube.state[this.$store.cube.selectedFace] = scanColors
					console.log(scanColors)
				} catch(e) {
					this.toast.error("The camera could not be accessed!")
				}
				
				this.$el.parentNode.style.display = "none"
			},
			
			stop() {
				if (!this.scanner.isScanning) return
				console.log("[stop]")
				
				this.scanner.stop()
				
				this.$el.parentNode.style.display = "none"
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
			<div class="relative">
				
				<!-- cam scanner -->
				<div class="w-full">
					<div class="absolute top-0 right-0">
						<button class="scan-button text-6xl">📸</button>
					</div>
					
					<div class="absolute top-6 left-0 w-full h-full flex justify-center overflow-hidden hidden">
						<div x-data="camScannerPcData('.scan-button')" @click.away="stop()" class="w-[65%] h-[65%]"></div>
					</div>
				</div>
				
				<!-- cube faces -->
				<div x-data="faceSelectData" class="grid grid-cols-4 grid-rows-3   gap-1 md:gap-3">
					<div x-cube-face.up @click="select('up')" class="col-start-2"></div>
					
					<div x-cube-face.left @click="select('left')" class="col-start-1"></div>
					<div x-cube-face.front @click="select('front')"></div>
					<div x-cube-face.right @click="select('right')"></div>
					<div x-cube-face.back @click="select('back')"></div>
					
					<div x-cube-face.down @click="select('down')" class="col-start-2"></div>
				</div>
				
			</div>
		`
		el.innerHTML += html
	})
}
