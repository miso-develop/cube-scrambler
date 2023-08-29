```mermaid
classDiagram

class Avatar {
	画面付きM5Stackデバイスでアバター表示する
}
Avatar --> AvatarCore
Avatar --> AvatarState
Avatar --> AvatarMotion: [arg] AvatarCore, AvatarState
Avatar --> AvatarFace



class AvatarCore {
	アバター関連コアAPI、定数を実装
}

class AvatarState {
	アバターの状態管理（initialized, stopping）
}

class AvatarFace {
	アバター表情のパターン実装
}

class AvatarMotion {
	Eye, Eyebrow, Mouse, EmotionMarkとsleepを組み合わせたモーション実装
}
AvatarMotion --> AvatarMotionQueue: [arg] AvatarCore, AvatarState
AvatarMotion --> AvatarEyebrow: [arg] AvatarCore
AvatarMotion --> AvatarEye: [arg] AvatarCore
AvatarMotion --> AvatarMouse: [arg] AvatarCore
AvatarMotion --> AvatarEmotionMark: [arg] AvatarCore
AvatarMotion --> AvatarFace



class AvatarMotionQueue {
	キューに登録されたモーションを指定間隔で直列実行する
}

namespace AvatarParts {
	class AvatarEyebrow {
		アバターの眉毛の描画
	}
	
	class AvatarEye {
		アバターの目の描画
	}
	
	class AvatarMouse {
		アバターの口の描画
	}
	
	class AvatarEmotionMark {
		アバターのエモーションマークの描画
	}
}


