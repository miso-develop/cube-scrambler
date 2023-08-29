# Cube Scrambler

<br>
<div align="center"><img src="https://user-images.githubusercontent.com/22117028/263312284-4a45ead8-43d8-465b-83cc-ac5fa2a3b997.png" alt="Checker cube solve demo" width="800" /></div>
<br>

### 日本語 | [English](./README.en.md)

キューブを自動で崩したり揃えたりする、LEGOで作れるロボットです。  

<div align="center"><img src="https://user-images.githubusercontent.com/22117028/262297192-1c5727ee-eac5-48f8-9f05-78393aee8d66.gif" alt="Checker cube solve demo" width="800" /></div>

<br>



## できること

### SCRAMBLE
キューブをランダムに崩します。  

<kbd><img src="https://user-images.githubusercontent.com/22117028/262303455-274f2514-ce27-4533-8128-0e90a65a41e4.png" alt="Scramble View" width="480" /></kbd>

<br>

### SOLVE
キューブを揃えます。  
揃えたいキューブの状態はWeb UIから入力します。  

<kbd><img src="https://user-images.githubusercontent.com/22117028/262561440-069af811-6cc9-40f9-822b-e0ba6eb88752.gif" alt="Solve View" width="480" /></kbd>

<br>

### SEQUENCE
任意のシーケンスを実行します。  

<kbd><img src="https://user-images.githubusercontent.com/22117028/262303463-ad40b2a1-7162-47dc-9d8c-88733c1c1688.png" alt="Sequence View" width="480" /></kbd>

<br>

### STEP
[M2Lメソッド](https://cubevoyage.net/how-to-solve/beginner-m2l/)の各ステップのランダムな状態に崩します。  
練習したいステップを重点的に練習できます。  

<kbd><img src="https://user-images.githubusercontent.com/22117028/262303474-189cc5a7-ee65-4022-a528-fad7327ea009.png" alt="Step View" width="480" /></kbd>

<br>



## Web UI Demo

### [➡ Demo Page](https://cube-scrambler-ui-demo.vercel.app/)

<br>



## Solve Demo
https://user-images.githubusercontent.com/22117028/263312158-341433ec-7d1b-41f1-87f2-6504da62a6ea.mp4

<br>



## 作り方
Node.jsアプリケーション、LEGOロボットに分けてそれぞれのセットアップ方法を公開しています。  

### [➡ Node.jsアプリケーション](./docs/setup-guide.md)

### [➡ LEGOロボット](https://drive.google.com/file/d/1LfaUZmzZbCQRWulfV_bqecyGe_8wCMht/view)

セットアップ方法で分からないことがあったらGitHubのIssueか、私のメールアドレス <<miso.develop@gmail.com>> までご連絡ください。  

<br>

<img src="https://user-images.githubusercontent.com/22117028/263433813-eee6a7b1-f17d-4ff5-a04a-4e80cd8f1318.png" alt="Instructions sample" width="720" />

<br>



## システム構成

![System Configuration](https://user-images.githubusercontent.com/22117028/262561898-dc999ef7-9472-418e-ba5f-efde677de099.png)

Cube Scramblerの制御にはNode.jsアプリケーションを使用します。  
Node.jsアプリケーションでは、Web UIを提供するWebサーバーと、マイコンを制御するWebSocket（[opniz](https://github.com/miso-develop/opniz-sdk-nodejs)）サーバーを実行します。  

ロボットの動作には[GeekServo](https://www.switch-science.com/products/6811)というレゴにくっつけられるモーターを使用します。  
モーターは[ATOM Lite](https://www.switch-science.com/products/6262)で制御します（他のM5Stackシリーズのデバイスも使えます）。  
マイコンは[opniz](https://github.com/miso-develop/opniz-sdk-nodejs)というIoTフレームワークを使用し、WebSocketを介してNode.jsアプリケーションで制御します。  

<br>



## YouTube

[![youtube](https://user-images.githubusercontent.com/22117028/265181351-b4e88e4c-4d8d-463b-bcc7-4b5a18824e6d.png)](https://youtu.be/fbkrc3qQbqk)

<br>



## もっと詳しく

### ➡ [ProtoPedia](https://protopedia.net/prototype/4244)

<br>



## LICENSE

### [MIT](./LICENSE)
