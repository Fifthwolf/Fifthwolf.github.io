

var content = document.getElementsByClassName('content')[0];
var chessBoard = document.getElementById('chessBoard');
var PVE = document.getElementById('PVE');
var PVP = document.getElementById('PVP');
var startButton = document.getElementById('startButton');
var historyDiv = document.getElementById('showHistory');
var inGameDiv = document.getElementById('inGame');
var currentColor = inGameDiv.getElementsByTagName('span')[0];
var falseMove = inGameDiv.getElementsByClassName('falseMove')[0];
var surrender = inGameDiv.getElementsByClassName('surrender')[0];


window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

var data = {
  chess: [],
  chessStep: [],
  currentPlayer: 0, // 默认黑子先手，0为当前黑执子，1为当前白执子
  currentStep: 0,
  amai: false,
}

addEvent(startButton, 'click', startGame);

function startGame () {
  createFrame();
  resetData();
  addEvent(chessBoard, 'click', playing);
  addEvent(falseMove, 'click', revoke);
  addEvent(surrender, 'click', function () {
    playerWin(data.currentPlayer, false);
  });
  addEvent(historyDiv, 'click', showHistory);
}

function resetData () { //data.chess数据重置
  data.chess = [];
  data.chess = new Array(15);
  for (var i = 0; i < 15; i++) {
    data.chess[i] = new Array(15);
    for (var j = 0; j < 15; j++) {
      data.chess[i][j] = false; //false无子，0黑子，1白子
    }
  }
  data.currentPlayer = 0;
  data.currentStep = 0;
  PVE.checked ? data.amai = true : data.amai = false;
  PVE.setAttribute('disabled', true);
  PVP.setAttribute('disabled', true);
  inGameDiv.style.display = 'block';
  startButton.style.display = 'none';
  historyDiv.style.display = 'none';
  currentColor.innerHTML = data.currentPlayer === 0 ? '黑' : '白';
  falseMove.addClass('disabled');
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
  if (_clickPosition(e) !== false) {
    var clickX = _clickPosition(e).clickX;
    var clickY = _clickPosition(e).clickY;
    if (playChess(clickX, clickY) && data.amai === true) {
      amai(data.chess, data.currentPlayer);
    } 
  }

  function _clickPosition (e) {
    var clickX = parseInt((_getMousePos(e).x + 17.5) / 35 - 1);
    var clickY = parseInt((_getMousePos(e).y + 17.5) / 35 - 1);
    var x = _getMousePos(e).x - (clickX + 1) * 35;
    var y = _getMousePos(e).y - (clickY + 1) * 35;
    var deviation = x * x + y * y;
    if (deviation < 196) {
      return {clickX, clickY};
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
}

function playChess (clickX, clickY) {
  if (data.chess[clickY][clickX] === false) {
    data.chess[clickY][clickX] = data.currentPlayer;
    data.chessStep[data.currentStep] = [clickY, clickX];
    drawChess(clickX, clickY, data.currentPlayer);
    if (judgeContinuity(data.currentPlayer, clickY, clickX, 5) !== false) {
      playerWin(data.currentPlayer, true);
      return false;
    }
    data.currentPlayer = (data.currentPlayer + 1) % 2;
    data.currentStep++;
    data.currentStep >= 2 ? falseMove.removeClass('disabled') : falseMove.addClass('disabled');
    currentColor.innerHTML = data.currentPlayer === 0 ? '黑' : '白';
    return true;
  }
  return false;
}

function revoke () {
  var len = Math.min(2, data.currentStep);
  if (len < 2) {
    return false;
  } else
  while(len--) {
    _resetChess(data.chessStep[data.currentStep - 1][0], data.chessStep[data.currentStep - 1][1]);
  }
  createFrame();
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (data.chess[i][j] !== false) {
        drawChess(j, i, data.chess[i][j]);
      }
    }
  }
  data.currentStep >= 2 ? falseMove.removeClass('disabled') : falseMove.addClass('disabled');

  function _resetChess (i, j) {
    data.chess[i][j] = false;
    data.currentStep--;
    data.chessStep.length = data.currentStep;
  }
}

function showHistory () {
  removeEvent(historyDiv, 'click', showHistory);
  createFrame();
  var x, y;
  for (var i = 0, len = data.chessStep.length; i < len; i++) {
    x = data.chessStep[i][0];
    y = data.chessStep[i][1];
    drawChess(y, x, data.chess[x][y]);
    _drawNumber(y, x, data.chess[x][y], i);
  }

  function _drawNumber (clickX, clickY, type, number) {
    var x = (clickX + 1) * 35;
    var y = (clickY + 1) * 35;
    var cxt = chessBoard.getContext('2d');
    cxt.beginPath();
    type === 0 ? cxt.fillStyle = '#fff' : cxt.fillStyle = '#000';
    cxt.font = 'bold 14px Microsoft YaHei';
    cxt.textAlign = 'center';
    cxt.textBaseline = 'middle';
    cxt.fillText(number + 1, x, y);
  }
}

function drawChess (clickX, clickY, type) {
  var x = (clickX + 1) * 35;
  var y = (clickY + 1) * 35;
  var chessRadius = 14;
  var cxt = chessBoard.getContext('2d');
  cxt.beginPath();
  var chessColor = cxt.createRadialGradient(x - chessRadius / 2, y + chessRadius / 2, chessRadius, x + chessRadius / 2, y - chessRadius / 2, chessRadius);
  if (type === 0) {
    chessColor.addColorStop(0, '#444');
    chessColor.addColorStop(1, '#000');
  } else {
    chessColor.addColorStop(0, '#111');
    chessColor.addColorStop(1, '#fff');
  }
  cxt.fillStyle = chessColor;
  cxt.arc(x, y, chessRadius, 0, 2 * Math.PI);
  cxt.fill();
  if (type === 0) {
    cxt.beginPath();
    cxt.fillStyle = 'rgba(255, 255, 255, 0.8)';
    cxt.arc(x + 7, y - 4, chessRadius / 5, 0, 2 * Math.PI);
    cxt.fill();
  }
}

function judgeContinuity (type, row, col, continuityChess) { //判断连续
  var length = 4;
  var limitLeft = Math.max(0, col - length),
      limitRight = Math.min(14, col + length);
      limitTop = Math.max(0, row - length),
      limitBottom = Math.min(14, row + length);

  // 横向判断
  var continuity = 0;
  for (var j = limitLeft; j <= limitRight; j++) {
    data.chess[row][j] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }

  //纵向判断
  continuity = 0;
  for (var i = limitTop; i <= limitBottom; i++) {
    data.chess[i][col] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }

  //正斜判断
  continuity = 0;
  for (var i = row - 4, j = col + 4, len = 0; len < 9; i++, j--, len++) {
    if (i < 0 || j < 0 || i > 14 || j > 14) {
      continue;
    }
    data.chess[i][j] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }

  //反斜判断
  continuity = 0;
  for (var i = row - 4, j = col - 4, len = 0; len < 9; i++, j++, len++) {
    if (i < 0 || j < 0 || i > 14 || j > 14) {
      continue;
    }
    data.chess[i][j] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }

  return false;
}

function playerWin (player, type) {
  removeEvent(chessBoard, 'click', playing);
  inGameDiv.style.display = 'none';
  startButton.innerHTML = '再来一局';
  startButton.style.display = 'block';
  historyDiv.style.display = 'block';
  PVE.removeAttribute('disabled');
  PVP.removeAttribute('disabled');
  _drawWinText(player, type);

  function _drawWinText (player, type) {
    var text;
    if (type) {
      text = player ? '白方胜利' : '黑方胜利';
    } else {
      text = player ? '白方认输' : '黑方认输';
    }
    var cxt = chessBoard.getContext('2d');
    cxt.beginPath();
    cxt.fillStyle = 'rgba(85, 102, 119, 0.75)';
    cxt.fillRect(15, 15, 530, 530);
    cxt.fillStyle = '#fff';
    cxt.font = 'bold 80px Microsoft YaHei';
    cxt.textAlign = 'center';
    cxt.textBaseline = 'middle';
    cxt.fillText(text, 280, 280);
  }
}

/*
function amai () { //AI落子
  var AIchess = {
    we: [],
    other: []
  }

  AIchess.we = new Array(15);
  AIchess.other = new Array(15);

  /* 逐格打分 */ /*
  for (var i = 0; i < 15; i++) {
    AIchess.we[i] = new Array(15);
    AIchess.other[i] = new Array(15);
    for (var j = 0; j < 15; j++) {
      AIchess.we[i][j] = 0;
      AIchess.other[i][j] = 0;
      if (data.chess[i][j] !== false) {
        continue;
      }
      //_AIScore(i, j, data.currentPlayer);
    }
  }

  /*
  var tempPosition, scoreMax = 0;
  outer:for (var i = 0; i < 15; i++) { //初始化tempPosition位置
    for (var j = 0; j < 15; j++) {
      if (data.chess[i][j] === false) {
        tempPosition = [i, j];
        break outer;
      }
    }
  }
  */
/*
  var tempPosition, scoreMax = 0;
  var i = 7, j = 7, direction = 0, limit = 1;
  outer:while (true) {
    var len = limit, flag = true;
    for (p = 0; p < len; p++) {
      if (data.chess[i][j] === false) {
        tempPosition = [i, j];
        break outer;
      }
      switch (direction) {
        case 0: i--; break;
        case 1: j++; if (flag) {limit++; flag = false}; break;
        case 2: i++; break;
        case 3: j--; if (flag) {limit++; flag = false}; break;
      }
    }
    direction = (direction + 1) % 4;
  }

  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (data.chess[i][j] !== false) {
        continue;
      }
      if (AIchess.we[i][j] > scoreMax) {
        scoreMax = AIchess.we[i][j];
        tempPosition = [i, j];
      }
    }
  }

  playChess(tempPosition[1], tempPosition[0]);
  
  function _AIScore (i, j, type) { //判断得分
    data.chess[i][j] = type;

    if (judgeContinuity(type, i, j, 5) !== false) { //落子即胜利，即连5
      AIchess.we[i][j] += 100000;
    } else if (judgeContinuity(type, i, j, 4) !== false) { //即连4
      AIchess.we[i][j] += 10000;
    }

    var length = 4;
    var limitLeft = Math.max(0, j - length),
        limitRight = Math.min(14, j + length);
        limitTop = Math.max(0, i - length),
        limitBottom = Math.min(14, i + length);

    data.chess[i][j] = false;
  }

  function _judgeContinuity4 (type, row, col) { //判断连续4
    var length = 4, continuityChess = 4, death4 = 0;
    var limitLeft = Math.max(0, col - length),
    limitRight = Math.min(14, col + length);
    limitTop = Math.max(0, row - length),
    limitBottom = Math.min(14, row + length);

    // 横向判断
    var continuity = 0;
    for (var j = limitLeft; j <= limitRight; j++) {
      data.chess[row][j] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (data.chess[row][j + 1] === false && data.chess[row][j - 4] === false) {
          return 10000; //活4
        } else if (data.chess[row][j + 1] === false || data.chess[row][j - 4] === false) {
          death4++; //死4
        }
      }
    }
  
    //纵向判断
    continuity = 0;
    for (var i = limitTop; i <= limitBottom; i++) {
      data.chess[i][col] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (data.chess[row + 1][j] === false && data.chess[row - 4][j] === false) {
          return 10000; //活4
        } else if (data.chess[row + 1][j] === false || data.chess[row - 4][j] === false) {
          death4++; //死4
        }
      }
    }
  
    //正斜判断
    continuity = 0;
    for (var i = row - 4, j = col + 4, len = 0; len < 9; i++, j--, len++) {
      if (i < 0 || j < 0 || i > 14 || j > 14) {
        continue;
      }
      data.chess[i][j] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (data.chess[row + 1][j - 1] === false && data.chess[row - 4][j + 4] === false) {
          return 10000; //活4
        } else if (data.chess[row + 1][j - 1] === false || data.chess[row - 4][j + 4] === false) {
          death4++; //死4
        }
      }
    }
  
    //反斜判断
    continuity = 0;
    for (var i = row - 4, j = col - 4, len = 0; len < 9; i++, j++, len++) {
      if (i < 0 || j < 0 || i > 14 || j > 14) {
        continue;
      }
      data.chess[i][j] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (data.chess[row + 1][j + 1] === false && data.chess[row - 4][j - 4] === false) {
          return 10000; //活4
        } else if (data.chess[row + 1][j + 1] === false || data.chess[row - 4][j - 4] === false) {
          death4++; //死4
        }
      }
    }
  
    if (death4 >= 2) {
      return 10000;
    }
  
    return false;
  }
}
*/

/*
data.currentPlayer = 1;
playChess(0,0);
data.currentPlayer = 1;
playChess(1,1);
data.currentPlayer = 1;
playChess(2,2);
data.currentPlayer = 1;
playChess(3,3);

for (var i = 0; i < 15; i++) {
  var m = [];
  for (var j = 0; j < 15; j++) {
    m.push(data.chess[i][j]);
  }
  console.log(m);
}
*/