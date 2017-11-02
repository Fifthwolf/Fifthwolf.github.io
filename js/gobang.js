var content = document.getElementsByClassName('content')[0];
var chessBoard = document.getElementById('chessBoard');
var startButton = document.getElementById('startButton');

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

var data = {
  chess = [];
}

addEvent(startButton, 'click', startGame);

function startGame () {
  createFrame();
  resetData();
  addEvent(startButton, 'click', playing);
}

function playing () { //游戏开始后在棋盘落子
  //...
  //amai();
  victory();
}

function resetData () { //data.chess数据重置

}

function victory () { //判断胜利

}

function createFrame () { //创建canvas chessBoard棋盘

}

function amai () { //AI落子

}