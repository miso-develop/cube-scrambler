import type { Config } from "./src/Config.js"
export default {
	
	// デバイスボタンの動作
	BUTTON_ACTION: "random",
	
	// ポート番号の指定
	OPNIZ_PORT: 3000, // 任意の空いてるポートを指定（よくわからなければこのままで）
	SERVER_PORT: 3001, // 任意の空いてるポートを指定（よくわからなければこのままで）
	
	// デバイスへ接続するサーボの制御ピン指定
	STAND_SERVO_PIN: "default",
	ARM_SERVO_PIN: "default",
	
	
	
	// サーボモーターの角度微調整
	STAND_CORRECT_ANGLE: 12, // ここでスタンド側サーボモーターの角度を微調整
	STAND_TURN_ANGLE: 86, // ここでスタンド側サーボモーターの角度を微調整
	
	ARM_PULL_ANGLE: 173, // ここでアーム側サーボモーターの角度を微調整
	ARM_HOLD_ANGLE: 220, // ここでアーム側サーボモーターの角度を微調整
	ARM_RELEASE_ANGLE: 237, // ここでアーム側サーボモーターの角度を微調整
	ARM_READY_ANGLE: 270, // ここでアーム側サーボモーターの角度を微調整
	
	ARM_PULL_SLEEP_MSEC: 250, // アーム動作のsleep
	// ARM_PULL_SLEEP_MSEC: 350, // アームの動作が不安定な場合はこちらを使用（ネットワーク重めの環境等）
	
	SERVO_TURN_SLEEP_MSEC: 250, // スタンド、アーム共通のsleep
	// SERVO_TURN_SLEEP_MSEC: 350, // モーターの動作が不安定な場合はこちらを使用（ネットワーク重めの環境等）
	
	
	
	// その他環境情報
	ENV: "prod",
	DEBUG: false,
	
	DEVICE_TYPE: "opniz",
	
	STAND_TURN_D_MAX_COUNT: 2,
	STAND_DIRECTION: -1,
	STAND_PWM_CHANNEL: 0,
	
	ARM_TURN_X_MAX_COUNT: 3,
	ARM_PWM_CHANNEL: 1,
	
	SERVO_FREQUENCY: 400,
	SERVO_RESOLUTION_BITS: 12,
	SERVO_SPEC_ANGLE: 270,
	SERVO_SPEC_PLUS_MAX: 2.4,
	SERVO_SPEC_PLUS_MIN: 0.5,
	
	RPS_LIMITER_RATE: 4,
	
	LAST_CORRECT_ORIENTATION: false,
	
} as const satisfies Config
