/* eslint no-undef: 0 */
export const stores = () => {
	
	Alpine.store("view", {
		isSp() {
			return window.innerWidth < 768
		},
	})
	
	
	
	Alpine.store("cube", {
		// MEMO: facelets()でfacelets文字列化する際に、state内のfaceの並びは↓のようにUDRLFBじゃないとダメ！
		state: {
			up: ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
			down: ["white", "white", "white", "white", "white", "white", "white", "white", "white"],
			right: ["red", "red", "red", "red", "red", "red", "red", "red", "red"],
			left: ["orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange"],
			front: ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
			back: ["green", "green", "green", "green", "green", "green", "green", "green", "green"],
		},
		
		selectedFace: "up",
		
		selectFace(direction) {
			this.selectedFace = direction
		},
		
		facelets() {
			const color2directionNotation = {
				yellow:	"U",
				red:	"R",
				blue:	"F",
				white:	"D",
				orange:	"L",
				green:	"B",
			}
			
			const faceletsIndex = {
				up: 1,
				right: 2,
				front: 3,
				down: 4,
				left: 5,
				back: 6,
			}
			
			const facelets = Object.entries(this.state)
				.sort((next, current) => faceletsIndex[next[0]] < faceletsIndex[current[0]] ? -1 : 1)
				.map(([face, colors]) => colors)
				.map(colors => colors.map(color => color2directionNotation[color]).join(""))
				.join("")
			// console.log(facelets) // DEBUG:
			
			return facelets
		},
	})
	
	
	
	Alpine.store("api", {
		toast: {},
		includeToast(toast) {
			this.toast = toast
		},
		
		async scramble(type = 0) {
			await this.request("scramble", { type })
		},
		async solve(facelets) {
			await this.request("solve", { facelets })
		},
		async sequence(sequence) {
			await this.request("sequence", { sequence })
		},
		async step(number) {
			await this.request("step", { number })
		},
		
		async request(path = "", queryObject = undefined) {
			const baseUri = `/`
			const apiPath = `api/${path}`
			const query = this.createQuery(queryObject)
			
			const endpoint = `${baseUri}${apiPath}${query}`
			// console.log({endpoint}) // DEBUG:
			
			const response = await fetch(endpoint)
			const data = await response.json()
			// console.log({data}) // DEBUG:
			
			if (response.status === 200) {
				this.toast.success("Finish!")
			} else {
				this.toast.error(data)
			}
			
			return data
		},
		createQuery(queryObject) {
			if (!queryObject) return ""
			return "?" + Object.entries(queryObject).map(([key, value]) => `${key}=${value}`).join("&")
		},
		
	})
	
	
	
	Alpine.store("toast", {
		view: {},
		includeView(view) {
			this.view = view
		},
		
		success(message, description = "") {
			const option = {
				type: "success",
				position: this.view.isSp() ? "bottom-center" : "top-right",
				description
			}
			toast(message, option)
		},
		error(message, description = "") {
			const option = {
				type: "danger",
				position: this.view.isSp() ? "bottom-center" : "top-right",
				description
			}
			toast(message, option)
		},
	})
	
	
	
	// includes
	Alpine.store("toast").includeView(Alpine.store("view"))
	Alpine.store("api").includeToast(Alpine.store("toast"))
	
}
