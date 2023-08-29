# Cube Scrambler

<br>
<div align="center"><img src="https://user-images.githubusercontent.com/22117028/263312284-4a45ead8-43d8-465b-83cc-ac5fa2a3b997.png" alt="Checker cube solve demo" width="800" /></div>
<br>

### [日本語](./README.md) | English

This is a robot that can be built with LEGO that automatically scramble and solve cube.  

<div align="center"><img src="https://user-images.githubusercontent.com/22117028/262297192-1c5727ee-eac5-48f8-9f05-78393aee8d66.gif" alt="Checker cube solve demo" width="800" /></div>

<br>



## Features

### SCRAMBLE
Scramble the cube randomly.  

<kbd><img src="https://user-images.githubusercontent.com/22117028/262303455-274f2514-ce27-4533-8128-0e90a65a41e4.png" alt="Scramble View" width="400" /></kbd>

<br>

### SOLVE
Solve the cube.  
The state of the cube to be solved can be entered through the Web UI.  

<kbd><img src="https://user-images.githubusercontent.com/22117028/262561440-069af811-6cc9-40f9-822b-e0ba6eb88752.gif" alt="Solve View" width="400" /></kbd>

<br>

### SEQUENCE
Execute any sequence.  

<kbd><img src="https://user-images.githubusercontent.com/22117028/262303463-ad40b2a1-7162-47dc-9d8c-88733c1c1688.png" alt="Sequence View" width="400" /></kbd>

<br>

### STEP
Scramble each step of the [M2L method](https://cubevoyage.net/how-to-solve/beginner-m2l/) to a random state.  
You can focus on the step you want to practice.  

<kbd><img src="https://user-images.githubusercontent.com/22117028/262303474-189cc5a7-ee65-4022-a528-fad7327ea009.png" alt="Step View" width="400" /></kbd>

<br>



## Web UI Demo

### [➡ Demo Page](https://cube-scrambler-ui-demo.vercel.app/)

<br>



## Solve Demo
https://user-images.githubusercontent.com/22117028/262409631-2e17618e-4031-4c18-ba2e-d9d0367b45a7.mp4

<br>



## Assembly Instructions
Separate sections for Node.js applications and LEGO robots are available to show how to set up each.  

### [➡ Node.js application](./docs/setup-guide.en.md)

### [➡ LEGO Robot](https://drive.google.com/file/d/1LfaUZmzZbCQRWulfV_bqecyGe_8wCMht/view)

If you have any questions on how to set it up, please contact me via Issue on GitHub or my email address <<miso.develop@gmail.com>>.  

<br>

<img src="https://user-images.githubusercontent.com/22117028/263433813-eee6a7b1-f17d-4ff5-a04a-4e80cd8f1318.png" alt="Instructions sample" width="720" />

<br>



## System Configuration

![System Configuration](https://user-images.githubusercontent.com/22117028/262561898-dc999ef7-9472-418e-ba5f-efde677de099.png)

The Cube Scrambler is controlled by a Node.js application.  
The Node.js application runs a Web server that provides a Web UI and a WebSocket ([opniz](https://github.com/miso-develop/opniz-sdk-nodejs)) server that controls the microcontroller.  

The robot uses a motor called [GeekServo](https://www.switch-science.com/products/6811), which can be attached to LEGO.  
The motors are controlled by [ATOM Lite](https://www.switch-science.com/products/6262) (other M5Stack series devices can also be used).  
The microcontroller is controlled by a Node.js application via WebSocket using [opniz](https://github.com/miso-develop/opniz-sdk-nodejs), an IoT framework.  

<br>



## YouTube

[![youtube](https://user-images.githubusercontent.com/22117028/265181351-b4e88e4c-4d8d-463b-bcc7-4b5a18824e6d.png)](https://youtu.be/fbkrc3qQbqk)

<br>



## Project Details

### ➡ [ProtoPedia](https://protopedia.net/prototype/4244)

<br>



## LICENSE

### [MIT](./LICENSE)
