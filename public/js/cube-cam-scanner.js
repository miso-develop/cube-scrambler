/* eslint-disable */

const { log } = console

export class CubeCamScanner {
	colors = [
		{ name: "yellow", initial: "Y", code: "#dbd12f", rgb: { r: 219, g: 209, b: 47 } },
		{ name: "blue", initial: "B", code: "#0089ec", rgb: { r: 0, g: 137, b: 236 } },
		{ name: "red", initial: "R", code: "#e72d15", rgb: { r: 231, g: 45, b: 21 } },
		{ name: "green", initial: "G", code: "#00d064", rgb: { r: 0, g: 208, b: 100 } },
		{ name: "orange", initial: "O", code: "#f07900", rgb: { r: 240, g: 121, b: 0 } },
		{ name: "white", initial: "W", code: "#f0f0f0", rgb: { r: 232, g: 232, b: 232 } },
		
		{ name: "black", initial: "-", code: "#404040", rgb: { r: 64, g: 64, b: 64 } },
		{ name: "gray", initial: "-", code: "#808080", rgb: { r: 128, g: 128, b: 128 } },
		{ name: "cyan", initial: "-", code: "#02fefe", rgb: { r: 2, g: 254, b: 254 } },
		{ name: "magenta", initial: "-", code: "#fe01fd", rgb: { r: 254, g: 1, b: 253 } },
		{ name: "purple", initial: "-", code: "#884898", rgb: { r: 136, g: 72, b: 152 } },
		{ name: "brown", initial: "-", code: "#8f6446", rgb: { r: 143, g: 100, b: 70 } },
	]
	
	video = null
	canvas = null
	ctx = null
	stream = null
	
	faceIndex = null
	result = null
	
	// 自動スキャン用の変数
	isScanning = false
	stableFrameCount = 0
	lastColors = null
	scanInterval = null
	checkResultInterval = null
	
	cameraSize = 480 // カメラの解像度（ピクセル）
	overlaySizeRatio = 0.8 // オーバーレイのカメラ内比率
	requiredStableFrames = 8 // 安定したフレーム数
	colorStabilityThreshold = 0.8 // 色の安定性閾値
	sampleSize = 15 // 色サンプリングサイズ（ピクセル）
	scanIntervalTime = 100 // スキャンの間隔（ミリ秒）
	checkResultIntervalTime = 100 // 結果チェックの間隔（ミリ秒）
	
	onscan = () => {}



	constructor(elem, {
		cameraSize = this.cameraSize,
		overlaySizeRatio = this.overlaySizeRatio,
		requiredStableFrames = this.requiredStableFrames,
		colorStabilityThreshold = this.colorStabilityThreshold,
		sampleSize = this.sampleSize,
		scanIntervalTime = this.scanIntervalTime,
		checkResultIntervalTime = this.checkResultIntervalTime,
	} = {}) {
		this.cameraSize = cameraSize
		this.overlaySizeRatio = overlaySizeRatio
		this.requiredStableFrames = requiredStableFrames
		this.colorStabilityThreshold = colorStabilityThreshold
		this.sampleSize = sampleSize
		this.scanIntervalTime = scanIntervalTime
		this.checkResultIntervalTime = checkResultIntervalTime
		
		elem.innerHTML = this.style() + this.html()
		this.video = document.querySelector(".___cube-cam-scanner video")
		this.canvas = document.querySelector(".___cube-cam-scanner canvas")
		this.ctx = this.canvas.getContext("2d")
	}



	async scan(faceIndex) {
		try {
			if(this.isScanning) return false
			
			// 背面カメラを優先的に使用
			const constraints = {
				video: {
					facingMode: { ideal: "environment" },
					width: { ideal: this.cameraSize },
					height: { ideal: this.cameraSize }
				}
			}
			
			this.stream = await navigator.mediaDevices.getUserMedia(constraints)
			this.video.srcObject = this.stream
			
			this.result = null
			this.faceIndex = faceIndex
			
			// ビデオが準備できたら自動スキャンを開始
			this.video.addEventListener("loadedmetadata", () => {
				this.startScanning()
			}, { once: true })
			
			// 結果返却
			return await this.checkResult()
			
		} catch (error) {
			console.error("カメラエラー:", error)
			this.isScanning = false
			throw error
		}
	}



	startScanning() {
		this.isScanning = true
		this.onscan()
		
		// 
		document.querySelector(".___cube-cam-scanner").style.display = "block"
		// オーバーレイ中央セルの色を読み取り対象面の色にする
		const centerCellRgba = `rgba(${this.colorCode2Rgb(this.getFaceCenterColorCode(this.faceIndex)).join(",")},0.67)`
		document.querySelector(".___cube-cam-scanner .center-cell").style.backgroundColor = centerCellRgba
		
		this.scanInterval = setInterval(() => {
			this.checkForScan()
		}, this.scanIntervalTime)
	}

	stopScanning() {
		if (this.scanInterval) {
			clearInterval(this.scanInterval)
			this.scanInterval = null
		}
	}



	checkForScan() {
		if (!this.video.videoWidth || !this.video.videoHeight) return
		
		// キャンバスサイズをビデオに合わせる
		this.canvas.width = this.video.videoWidth
		this.canvas.height = this.video.videoHeight
		
		// 現在のフレームをキャンバスに描画
		this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
		
		
		
		// 色を分析
		const currentColors = this.analyzeColors()
		// console.log(currentColors)
		
		
		// 色の正しさ、安定性をチェック
		if (this.validateColors(currentColors) && this.isColorStable(currentColors)) {
			this.stableFrameCount++
			
			// グリッドオーバーレイの状態を更新
			this.updateGridOverlayState(true)
			
			if (this.stableFrameCount >= this.requiredStableFrames) {
				// スキャン完了
				this.completeScanning(currentColors)
				this.stableFrameCount = 0
			}
		} else {
			this.stableFrameCount = 0
			this.updateGridOverlayState(false)
		}
		
		this.lastColors = currentColors
	}

	// 
	validateColors(currentColors) {
		// 識別できてない色があればNG
		if (currentColors.some(color => color.initial === "-")) return false
		
		// 面中央のマスが正しくない場合はNG（白面中央マスはチェックしない）
		const currentFaceCenterColor = this.getFaceCenterColorCode(this.faceIndex)
		if (currentColors[4].code !== currentFaceCenterColor && this.faceIndex !== 5) return false
		
		return true
	}

	// 同じ色が安定して続いているかをチェック
	isColorStable(currentColors) {
		if (!this.lastColors) return false
		
		let matchingColors = 0
		for (let i = 0; i < currentColors.length; i++) {
			if (currentColors[i].code === this.lastColors[i].code) {
				matchingColors++
			}
		}
		
		const stability = matchingColors / currentColors.length
		return stability >= this.colorStabilityThreshold
	}

	updateGridOverlayState(isStable) {
		const gridOverlay = document.querySelector(".___cube-cam-scanner .grid-overlay")
		if (isStable) {
			gridOverlay.style.borderColor = "#00ff00"
			gridOverlay.style.boxShadow = "0 0 2rem rgba(0,255,0,0.8)"
		} else {
			gridOverlay.style.borderColor = "#fff"
			gridOverlay.style.boxShadow = "0 0 4rem rgba(255,0,0,0.5)"
		}
	}



	analyzeColors() {
		const colors = []
		const gridSize = 3
		
		// グリッドの範囲を計算
		const startX = Math.floor(this.canvas.width * (1 - this.overlaySizeRatio) / 2)
		const startY = Math.floor(this.canvas.height * (1 - this.overlaySizeRatio) / 2)
		const gridWidth = Math.floor(this.canvas.width * this.overlaySizeRatio)
		const gridHeight = Math.floor(this.canvas.height * this.overlaySizeRatio)
		
		const cellWidth = gridWidth / gridSize
		const cellHeight = gridHeight / gridSize
		
		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				const x = startX + col * cellWidth + cellWidth / 2
				const y = startY + row * cellHeight + cellHeight / 2
				
				const imageData = this.ctx.getImageData(x - this.sampleSize, y - this.sampleSize, this.sampleSize * 2, this.sampleSize * 2)
				const avgColor = this.getAverageColor(imageData)
				const dominantColor = this.getDominantColor(avgColor)
				
				colors.push(dominantColor)
			}
		}
		
		return colors
	}

	getAverageColor(imageData) {
		const data = imageData.data
		let r = 0, g = 0, b = 0
		const pixels = data.length / 4
		
		for (let i = 0; i < data.length; i += 4) {
			r += data[i]
			g += data[i + 1]
			b += data[i + 2]
		}
		
		return {
			r: Math.round(r / pixels),
			g: Math.round(g / pixels),
			b: Math.round(b / pixels),
		}
	}

	getDominantColor(avgColor) {
		const { r, g, b } = avgColor
		
		// ルービックキューブの標準色に最も近い色を判定
		let minDistance = Infinity
		let dominantColor = this.colors[6]
		
		this.colors.forEach(color => {
			const distance = Math.sqrt(
				Math.pow(r - color.rgb.r, 2) +
				Math.pow(g - color.rgb.g, 2) +
				Math.pow(b - color.rgb.b, 2)
			)
			
			if (distance < minDistance) {
				minDistance = distance
				dominantColor = color
			}
		})
		
		return dominantColor
	}



	getFaceCenterColorCode = (faceIndex) => {
		return [
			this.colors.filter(color => color.initial === "Y")[0].code,
			this.colors.filter(color => color.initial === "B")[0].code,
			this.colors.filter(color => color.initial === "R")[0].code,
			this.colors.filter(color => color.initial === "G")[0].code,
			this.colors.filter(color => color.initial === "O")[0].code,
			this.colors.filter(color => color.initial === "W")[0].code,
		][faceIndex] || this.colors[0].code
	}

	colorInitial2FaceInitial(colorInitial) {
		return {
			"W": "U",
			"Y": "D",
			"R": "R",
			"O": "L",
			"G": "B",
			"B": "F",
		}[colorInitial] || "-"
	}

	colorCode2Rgb(colorCode) {
		// 先頭の # を取り除く
		colorCode = colorCode.replace(/^#/, "")
		// 3桁の形式を6桁に変換（例: #fc0 → #ffcc00）
		if (colorCode.length === 3) {
			colorCode = colorCode.split("").map(c => c + c).join("")
		}
		// R, G, Bをそれぞれ10進数に変換
		const bigint = parseInt(colorCode, 16)
		const r = (bigint >> 16) & 255
		const g = (bigint >> 8) & 255
		const b = bigint & 255
		return [r, g, b]
	}

	getFacelets(colors) {
		return colors.map(color => this.colorInitial2FaceInitial(color.initial)).join("")
	}



	completeScanning(colors) {
		// MEMO: 白面中央マス補正
		if (this.faceIndex === 5) colors[4] = this.colors[5]
		
		this.stopScanning()
		
		// グリッドオーバーレイをリセット
		this.updateGridOverlayState(false)
		
		// カメラ非表示
		document.querySelector(".___cube-cam-scanner").style.display = "none"
		
		// 結果返却
		this.result = colors.map(color => color.name)
	}



	checkResult() {
		return new Promise(res => {
			this.checkResultInterval = setInterval(() => {
				if (this.result) {
					this.stopCheckResult()
					this.isScanning = false
					res(this.result)
				}
			}, this.checkResultIntervalTime)
		})
	}

	stopCheckResult() {
		if (this.checkResultInterval) {
			clearInterval(this.checkResultInterval)
			this.checkResultInterval = null
		}
	}



	stop() {
		document.querySelector(".___cube-cam-scanner").style.display = "none"
		
		this.stopScanning()
		this.stopCheckResult()
		
		this.stream = null
		
		this.faceIndex = null
		this.result = null
		
		this.isScanning = false
		this.stableFrameCount = 0
		this.lastColors = null
		
		this.scanInterval = null
		this.checkResultInterval = null
	}



	isVideoReady() {
		return this.video.readyState > 0
	}



	style() {
		return /* html */ `<style>
.___cube-cam-scanner {
	display: none;
	width: 100%;
	margin: 0 auto;
}

.___cube-cam-scanner .camera-container {
	position: relative;
	width: 100%;
	border: 4px solid #444;
	border-radius: 16px;
	overflow: hidden;
}

.___cube-cam-scanner video {
	width: 100%;
	height: auto;
	display: block;
}

.___cube-cam-scanner .overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

/* グリッドオーバーレイのアニメーション用スタイルを追加 */
.___cube-cam-scanner .grid-overlay {
	position: absolute;
	top: 50%;
	left: 50%;
	width: ${this.overlaySizeRatio * 100}%;
	height: ${this.overlaySizeRatio * 100}%;
	transform: translate(-50%, -50%);
	border: 4px solid #f0f0f0;
	background: rgba(255,255,255,0.1);
	box-shadow: 0 0 2rem rgba(255,255,255,0.5);
	transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* スキャン準備完了時のスタイル */
.___cube-cam-scanner .grid-overlay.ready {
	border-color: #00ff00;
	box-shadow: 0 0 2rem rgba(0,255,0,0.8);
	animation: pulse 1s infinite;
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 1rem rgba(0,255,0,0.8);
	}
	50% {
		box-shadow: 0 0 3rem rgba(0,255,0,1);
	}
	100% {
		box-shadow: 0 0 1rem rgba(0,255,0,0.8);
	}
}

.___cube-cam-scanner .grid-overlay::before {
	content: "";
	position: absolute;
	top: 33.33%;
	left: 0;
	right: 0;
	height: 4px;
	background: #f0f0f0;
}

.___cube-cam-scanner .grid-overlay::after {
	content: "";
	position: absolute;
	top: 66.66%;
	left: 0;
	right: 0;
	height: 4px;
	background: #f0f0f0;
}

.___cube-cam-scanner .grid-overlay .vertical-line-1,
.___cube-cam-scanner .grid-overlay .vertical-line-2 {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 4px;
	background: #f0f0f0;
}

.___cube-cam-scanner .grid-overlay .vertical-line-1 {
	left: 33.33%;
}

.___cube-cam-scanner .grid-overlay .vertical-line-2 {
	left: 66.66%;
}

.___cube-cam-scanner .grid-overlay .center-cell {
	position: absolute;
	top: calc(33.3% + 4px);
	left: calc(33.3% + 4px);
	height: calc(33.3% - 4px);
	width: calc(33.3% - 4px);
	background-color: rgba(64,64,64,0.67);
}

.___cube-cam-scanner canvas {
	display: none;
}
</style>`
	}



	html() {
		return /* html */ `
<div class="___cube-cam-scanner">
	<div class="camera-container">
		<video autoplay playsinline></video>
		<div class="overlay">
			<div class="grid-overlay">
				<div class="center-cell"></div>
				<div class="vertical-line-1"></div>
				<div class="vertical-line-2"></div>
			</div>
		</div>
	</div>
	<canvas></canvas>
</div>
		`
	}
	
}
