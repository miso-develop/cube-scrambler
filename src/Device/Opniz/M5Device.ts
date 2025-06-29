export interface M5Device {
	STAND_SERVO_PIN: number
	ARM_SERVO_PIN: number
	
	onrun: () => Promise<void>
	onstop: (result: boolean) => Promise<void>
}
