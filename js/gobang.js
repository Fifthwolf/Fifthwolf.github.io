var content = document.getElementsByClassName('content')[0];
var chessBoard = document.getElementById('chessBoard');
var startButton = document.getElementById('startButton');
var inGameDiv = document.getElementById('inGame');

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

var data = {
  chess: [],
  currentPlayer: 0, // 默认黑子先手，0为当前黑执子，1为当前白执子
  currentStep: 1
}

addEvent(startButton, 'click', startGame);
addEvent(chessBoard, 'click', playing);

function startGame () {
  inGameDiv.style.display = 'block';
  startButton.style.display = 'none';
  createFrame();
  resetData();
  // addEvent(chessBoard, 'click', playing);
}

function resetData () { //data.chess数据重置
  data.chess = [];
  data.chess = new Array(15);
  for (var i = 0; i < 15; i++) {
    data.chess[i] = new Array(15);
    for (var j = 0; j < 15; j++) {
      data.chess[i][j] = {};
      data.chess[i][j].type = false; //false无子，0黑子，1白子
      data.chess[i][j].step = false;
    }
  }
  data.currentPlayer = 0;
  data.currentStep = 1;
}

function victory () { //判断胜利

}

function createFrame () { //创建canvas chessBoard棋盘
  chessBoard.width = 560;
  chessBoard.height = 560;
  var context = chessBoard.getContext('2d');
  _drawBoard(context, 560, 560);
  _shadowReset(context);
  _drawLine(context);
  _drawPoint(context);

  function _drawBoard (cxt, width, height) {
    cxt.beginPath();
    var bgColor = cxt.createLinearGradient(0, 0, width, height);
    bgColor.addColorStop(0, '#ffbf5f');
    bgColor.addColorStop(1, '#9b5f2b');
    cxt.fillStyle = bgColor;
    cxt.shadowColor = '#000';
    cxt.shadowOffsetX = 5;
    cxt.shadowOffsetY = 5;
    cxt.shadowBlur = 5;
    cxt.fillRect(35-20,35-20,35*14+20*2,35*14+20*2);
  }

  function _drawLine (cxt) {
    cxt.fillStyle = "#000";
    cxt.lineCap = 'square';
    cxt.lineWidth = 2;
    for (var i = 1; i <= 15; i++) {
      cxt.beginPath();
      cxt.moveTo(35, i * 35);
      cxt.lineTo(35 * 15, i * 35);
      cxt.stroke();
    }
    for (var i = 1; i <= 15; i++) {
      cxt.beginPath();
      cxt.moveTo(i * 35, 35);
      cxt.lineTo(i * 35, 35 * 15);
      cxt.stroke();
    }
  }

  function _drawPoint (cxt) {
    var pointPosition = [[4, 4], [4, 12], [8, 8], [12, 4], [12, 12]];
    for (var i = 0, len = pointPosition.length; i < len; i++) {
      cxt.beginPath();
      cxt.arc(pointPosition[i][0] * 35, pointPosition[i][1] * 35, 5, 0, 2 * Math.PI);
      cxt.fill();
    }
  }

  function _shadowReset (cxt) {
    cxt.shadowOffsetX = 0;
    cxt.shadowOffsetY = 0;
    cxt.shadowBlur = 0;
  }
}

function playing (e) { //游戏开始后在棋盘落子
  var e = e || window.e;
  _clickPosition(e);
  if (_clickPosition(e) !== false) {
    var x = _clickPosition(e).x;
    var y = _clickPosition(e).y;
    if (data.chess[x][y].type === false) {
      data.chess[x][y].type = data.currentPlayer;
      data.chess[x][y].step = data.currentStep;
      _drawChess(x, y, data.currentPlayer);
      data.currentPlayer = (data.currentPlayer + 1) % 2;
      data.currentStep++;
    }
  }
  //amai();

  victory();
  
  function _clickPosition (e) {
    var clickX = parseInt((_getMousePos(e).x + 17.5) / 35 - 1);
    var clickY = parseInt((_getMousePos(e).y + 17.5) / 35 - 1);
    var x = _getMousePos(e).x - (clickX + 1) * 35;
    var y = _getMousePos(e).y - (clickY + 1) * 35;
    var deviation = x * x + y * y;
    if (deviation < 225) {
      return {'x': clickX, 'y': clickY};
    } else {
      return false;
    }

    function _getMousePos (e) {
      var e = event || window.event;
      var x = e.clientX - chessBoard.getBoundingClientRect().left;
      var y = e.clientY - chessBoard.getBoundingClientRect().top;
      return {'x': x, 'y': y};
    }
  }

  function _drawChess (x, y, type) {
    
  }
}

function amai () { //AI落子

}