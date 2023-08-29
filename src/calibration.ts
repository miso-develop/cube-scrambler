import { CubeRobot } from "./CubeRobot/CubeRobot.js"

(async () => {
	console.log("Calibrating...")
	const robot = new CubeRobot()
	await robot.connect()
	await robot.init()
	console.log("Calibration complete!")
})()
