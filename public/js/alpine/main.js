/* eslint no-undef: 0 */
import { stores } from "./stores.js"

import { button } from "./parts/button.js"
import { textInput } from "./parts/textInput.js"
import { toastNotification } from "./parts/toastNotification.js"

import { title } from "./title.js"
import { tabs } from "./tabs.js"

import { cubeUi } from "./cubeUi/cubeUi.js"
import { cubeUiSp } from "./cubeUi/cubeUiSp.js"
import { cubeFace } from "./cubeUi/cubeFace.js"
import { cubeMiniFace } from "./cubeUi/cubeMiniFace.js"
import { colorRing } from "./cubeUi/colorRing.js"

document.addEventListener("alpine:init", () => {
	stores()
	
	button()
	textInput()
	toastNotification()
	
	title()
	tabs()
	
	cubeUi()
	cubeUiSp()
	cubeFace()
	cubeMiniFace()
	colorRing()
	
})
