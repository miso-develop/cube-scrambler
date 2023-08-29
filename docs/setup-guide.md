# Cube Scrambler セットアップガイド

## 用意するもの

* M5Stackデバイス
	* ATOMS3 Lite, ATOMS3, ATOM Lite, ATOM Matrix, M5Stack Core2, M5Stack, M5StickCで動作確認しています
	* [ATOMS3 Lite](https://www.switch-science.com/products/8778)が安価でおすすめです
* [GeekServo 9G Servo-Gray](https://www.switch-science.com/products/6811) x 2
	* グレーの270°サーボモーターのタイプです
	* 2台必要です
	* 赤やオレンジのものは別物ですので注意してください
* [GROVE - サーボ用2分岐ケーブル](https://www.switch-science.com/products/1250)
	* 必須ではないですが配線がすっきりします
	* ない場合はブレッドボードやジャンパワイヤーでよしなにしてください
* USB Type-Cケーブル
* PC
	* Windows / Mac / LinuxどれでもOK
		* Android (Termux)でもいけました
	* Node.js v18以上をインストールしておいてください
* キューブ
	* 回転が重いものだとうまく動かないと思います
	* 私はTornado V3の[Pioneer](https://store.tribox.com/products/detail.php?product_id=3499)モデルと[Flagship](https://store.tribox.com/products/detail.php?product_id=3498)モデルを使っています
		* 届くまで少し時間がかかりますが[AliExpress](https://ja.aliexpress.com/item/1005005486209524.html)だと安く買えます

<br>



## M5Stackデバイスのセットアップ

### opniz CLIのインストール

[opniz CLI](https://github.com/miso-develop/opniz-cli)をnpmよりインストールします。  
opniz CLIはM5Stackデバイスへopniz Arduino Libraryのテンプレートスケッチを簡単に書き込めるツールです。  

```
npm install -g opniz-cli
```

※ *opniz CLIのインストール時にArduino CLI実行ファイルのダウンロードやESP32環境の構築を行うため、インストールに数分かかります。*  

### M5Stackデバイスへの書き込み

opniz CLIを使ってM5Stackデバイスをセットアップします。  

M5StackデバイスをUSBケーブルでPCと接続してください。  
その後、以下のコマンドを実行し対話モードで必要な情報を入力していきます。  

```
npx opniz upload
```

ここで必要となる情報は以下のとおりです。  

* デバイスのシリアルポート
* M5Stackデバイスが接続するWi-FiのSSID / パスワード
* Node.jsアプリケーションを実行するPCのIPアドレス
* 書き込むM5Stackデバイスの種別
* opnizの通信ポート番号（デフォルトは3000）

このうちWi-Fiパスワード以外は自動的に情報を取得しリスト表示されるので選択するだけです。  
opnizの通信ポート番号はデフォルトの3000のままエンターキーを押してください。  

**[ opniz uploadコマンド実行イメージ ]**

![.](https://user-images.githubusercontent.com/22117028/148371155-569e2ae3-7655-4c5c-a38f-4d13dd1ada4b.gif)

※ *GIF画像では書き込みがさくっと終わっていますが、コンパイル / 書き込みに約10分ほどかかります。*  



<br>

書き込みが完了したらM5Stackデバイスのセットアップは完了です。  

<br>



## Node.jsアプリケーションのセットアップ

### リポジトリのクローン

Cube Scramblerリポジトリを`git clone`します。  

```
git clone https://github.com/miso-develop/cube-scrambler && cd cube-scrambler
```

※ *gitがインストールされていない場合は[Cube ScramblerのGitHubページ](https://github.com/miso-develop/cube-scrambler)へアクセスし、`<> Code`とある緑色のボタンから`Download ZIP`を選択しリポジトリをダウンロードし解凍してください。*  

### 依存パッケージのインストールとアプリケーションのビルド

次のコマンドを実行すると依存パッケージのインストールとアプリケーションのビルドが行われます。  

```
npm install
```

<br>



## GeekServoのキャリブレーション

※ *GeekServoのキャリブレーションは必ずLEGOロボットの組み立て前に行ってください！*  

まずはM5StackデバイスとGeekServoを接続します。  
「[GROVE - サーボ用2分岐ケーブル](https://www.switch-science.com/products/1250)」があるならM5StackデバイスのGroveポートに繋ぐだけです。  

「GROVE - サーボ用2分岐ケーブル」がない場合は、ブレッドボードやジャンパワイヤーを駆使しM5Stackデバイスの適当なピンとGeekServoを繋ぎましょう。  
このときあわせて`config.ts`の`STAND_SERVO_PIN`、`ARM_SERVE_PIN`をM5Stackデバイスに繋いだピン番号に変更してください。  

M5StackデバイスとGeekServoを接続したら次のコマンドを実行します。  

```
npm run calibration
```

GeekServoの軸が動き、`Calibration complete!`と表示されたら成功です。  

<br>



## LEGOロボットの組み立て

リンク先のPDFを参照し、LEGOロボットを組み立ててください。  

### [➡ LEGOロボットの組み立て方](https://drive.google.com/file/d/1LfaUZmzZbCQRWulfV_bqecyGe_8wCMht/view)

<br>



## アプリケーションの実行

次のコマンドを実行し、アプリケーションを起動します。  

```
npm start
```

`Device connected!`と表示されたらM5Stackデバイスと正常に接続できています。  

### Web UIへのアクセス

アプリケーションの実行と同時にWeb UI用のWebサーバーも起動しています。  
PC上でブラウザから`http://localhost:3001`へアクセスしてみてください。  
Web UIが表示されます。  

`http://localhost:3001`のうち`localhost`の部分をPCのIPアドレスにすることで、同じネットワーク上の別の端末からもアクセスできます。  
たとえばPCとスマートフォンが同じネットワークに接続している場合は、スマートフォンからもWeb UIへアクセスできます。  

<br>

あとはWeb UIからLEGOロボットを制御してみてください。  
よいキューブライフを😎  

<br>
<div>
	<kbd><img src="https://user-images.githubusercontent.com/22117028/263659725-6e6f6cd5-cea7-4629-ba0a-662ed955a02c.png" alt="Scramble View" width="190" /></kbd>
	<kbd><img src="https://user-images.githubusercontent.com/22117028/263655815-e07282b3-cc23-4e87-8fc7-ea9e40f1d863.gif" alt="Solve View" width="190" /></kbd>
	<kbd><img src="https://user-images.githubusercontent.com/22117028/263659860-5524fe7c-0ab7-4d0b-ab5e-76ce0994cf4e.png" alt="Sequence View" width="190" /></kbd>
	<kbd><img src="https://user-images.githubusercontent.com/22117028/263659958-84a703b9-3985-432b-bebd-af919df81cbf.png" alt="Step View" width="190" /></kbd>
</div>
<br>



## 動作が安定しないとき
キューブが縦方向に回転しなかったり、スタンドから落ちてしまう場合は`config.ts`ファイルにてサーボモーターの動きを調整します。  

`ARM_PULL_ANGLE`、`ARM_HOLD_ANGLE`、`ARM_RELEASE_ANGLE`でアームの動作を調整できます。  
`ARM_PULL_SLEEP_MSEC`、`SERVO_TURN_SLEEP_MSEC`の値を大きくすると動きが若干遅くなりますが、動作が安定するようになります。  

```ts: config.ts
	ARM_PULL_ANGLE: 173, // ここでアーム側サーボモーターの角度を微調整
	ARM_HOLD_ANGLE: 220, // ここでアーム側サーボモーターの角度を微調整
	ARM_RELEASE_ANGLE: 237, // ここでアーム側サーボモーターの角度を微調整
	ARM_READY_ANGLE: 270, // ここでアーム側サーボモーターの角度を微調整
	
	ARM_PULL_SLEEP_MSEC: 250, // アーム動作のsleep
	// ARM_PULL_SLEEP_MSEC: 350, // アームの動作が不安定な場合はこちらを使用（ネットワーク重めの環境等）
	
	SERVO_TURN_SLEEP_MSEC: 250, // スタンド、アーム共通のsleep
	// SERVO_TURN_SLEEP_MSEC: 350, // モーターの動作が不安定な場合はこちらを使用（ネットワーク重めの環境等）
```

<br>

その他セットアップ方法で分からないことがあったらGitHubのIssueか、私のメールアドレス <<miso.develop@gmail.com>> までご連絡ください。  
