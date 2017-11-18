var content = document.getElementsByClassName('content')[0];
var chessBoard = document.getElementById('chessBoard');
var PVE = document.getElementById('PVE');
var weUpperHand = document.getElementById('weUpperHand');
var aiUpperHand = document.getElementById('aiUpperHand');
var PVP = document.getElementById('PVP');
var handCut = document.getElementById('handCut');
var handCutText = handCut.parentNode.getElementsByTagName('span')[0];
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
  weUpperHand: true,
  handCut: false
}

addEvent(startButton, 'click', startGame);
addEvent(PVE, 'click', function () {
  weUpperHand.removeAttribute('disabled');
  aiUpperHand.removeAttribute('disabled');
});
addEvent(PVP, 'click', function () {
  weUpperHand.setAttribute('disabled', true);
  aiUpperHand.setAttribute('disabled', true);
});

function startGame () {
  createFrame();
  resetData();
  addEvent(chessBoard, 'click', playing);
  addEvent(falseMove, 'click', revoke);
  addEvent(surrender, 'click', function () {
    playerWin(data.currentPlayer, false);
  });
  addEvent(historyDiv, 'click', showHistory);
  if (data.amai === true && data.weUpperHand === false) {
    var position = amai(data.chess, data.currentPlayer);
    playChess(position.x, position.y);
  }
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
  data.chessStep = [];
  data.currentPlayer = 0;
  data.currentStep = 0;
  PVE.checked ? data.amai = true : data.amai = false;
  weUpperHand.checked ? data.weUpperHand = true : data.weUpperHand = false;
  handCut.checked ? data.handCut = true : data.handCut = false;
  PVE.setAttribute('disabled', true);
  weUpperHand.setAttribute('disabled', true);
  aiUpperHand.setAttribute('disabled', true);
  PVP.setAttribute('disabled', true);
  handCut.setAttribute('disabled', true);
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
    cxt.fillRect(35 - 20, 35 - 20, 35 * 14 + 20 * 2, 35 * 14 + 20 * 2);
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
    if (data.handCut === true && data.currentPlayer === 0) {
      if (judgeHandCut(data.chess, clickY, clickX, 0)) {
        handCutPrompt();
        return;
      }
    }
    if (playChess(clickX, clickY) && data.amai === true) {
      var position = amai(data.chess, data.currentPlayer);
      playChess(position.x, position.y);
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
      var x = e.clientX - chessBoard.getBoundingClientRect().left;
      var y = e.clientY - chessBoard.getBoundingClientRect().top;
      return {'x': x, 'y': y};
    }
  }
}

function playChess (clickX, clickY) {
  if (data.chess[clickY][clickX] === false) {
    createFrame();
    var x, y;
    for (var i = 0, len = data.chessStep.length; i < len; i++) {
      x = data.chessStep[i][0];
      y = data.chessStep[i][1];
      drawChess(y, x, data.chess[x][y], false);
    }
    data.chess[clickY][clickX] = data.currentPlayer;
    data.chessStep[data.currentStep] = [clickY, clickX];
    drawChess(clickX, clickY, data.currentPlayer, true);
    if (judgeContinuity(data.currentPlayer, clickY, clickX, 5) !== false) {
      playerWin(data.currentPlayer, true);
      return false;
    }
    data.currentPlayer = (data.currentPlayer + 1) % 2;
    data.currentStep++;
    data.currentStep >= 2 ? falseMove.removeClass('disabled') : falseMove.addClass('disabled');
    if (data.currentStep === 225) {
      playerWin(data.currentPlayer, true);
      return false;
    }
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
  if (data.currentStep > 0) {
    drawSign (data.chessStep[data.currentStep - 1][1], data.chessStep[data.currentStep - 1][0]);
  }
  data.currentStep >= 2 ? falseMove.removeClass('disabled') : falseMove.addClass('disabled');

  function _resetChess (i, j) {
    data.chess[i][j] = false;
    data.currentStep--;
    data.chessStep.length = data.currentStep;
  }

  drawSign()
}

function showHistory () {
  removeEvent(historyDiv, 'click', showHistory);
  createFrame();
  var x, y;
  for (var i = 0, len = data.chessStep.length; i < len; i++) {
    x = data.chessStep[i][0];
    y = data.chessStep[i][1];
    drawChess(y, x, data.chess[x][y], false);
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

function drawChess (clickX, clickY, type, sign) {
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
  if (sign) {
    drawSign(clickX ,clickY);
  }
}

function drawSign (clickX, clickY) {
  var x = (clickX + 1) * 35;
  var y = (clickY + 1) * 35;
  var cxt = chessBoard.getContext('2d');
  cxt.beginPath();
  cxt.strokeStyle = "red";
  cxt.lineCap = "square";
  cxt.lineWidth = 4;
  cxt.moveTo(x - 16, y - 12);
  cxt.lineTo(x - 16, y - 16);
  cxt.lineTo(x - 12, y - 16);

  cxt.moveTo(x + 12, y - 16);
  cxt.lineTo(x + 16, y - 16);
  cxt.lineTo(x + 16, y - 12);

  cxt.moveTo(x - 16, y + 12);
  cxt.lineTo(x - 16, y + 16);
  cxt.lineTo(x - 12, y + 16);

  cxt.moveTo(x + 16, y + 12);
  cxt.lineTo(x + 16, y + 16);
  cxt.lineTo(x + 12, y + 16);
  cxt.stroke();
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
  weUpperHand.removeAttribute('disabled');
  aiUpperHand.removeAttribute('disabled');
  PVP.removeAttribute('disabled');
  handCut.removeAttribute('disabled');
  _drawWinText(player, type);

  function _drawWinText (player, type) {
    var text;
    if (data.currentStep === 225) {
      text = '和局';
    } else {
      if (type) {
        text = player ? '白方胜利' : '黑方胜利';
      } else {
        text = player ? '白方认输' : '黑方认输';
      }
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

function handCutPrompt () {
  var flag = 3;
  _colorChange(flag);

  function _colorChange (flag) {
    if (flag % 2 === 1) {
      handCutText.style.color = 'red';
    } else {
      handCutText.style.color = 'black';
    }
    if (flag > 0) {
      flag--;
      setTimeout(function () {
        _colorChange(flag);
      }, 200);
    }
  }
}

function judgeHandCut (chess, i, j, type) {
  var chessType = {
    alive3: 0,
    alive4: 0,
    long: 0
  }
  chess[i][j] = type;

  var listPosition3 = [0, 1, 5, 6],
      listPosition2 = [0, 1, 2, 5, 6, 7];
      listPosition1 = [0, 1, 2, 3, 5, 6, 7, 8];

  //横向
  switch (judgeTransverseContinuity(type, i, j).position) {
    case 5: chess[i][j] = false; return true; break;
    case 4: judgeTransverseContinuity4(type, i, judgeTransverseContinuity(type, i, j).startX); break;
    case 3: judgeTransverseContinuity3(type, i, judgeTransverseContinuity(type, i, j).startX); break;
    case 2: judgeTransverseContinuity2(type, i, judgeTransverseContinuity(type, i, j).startX); break;
    case 1: judgeTransverseContinuity1(type, i, judgeTransverseContinuity(type, i, j).startX); break;
    default: chessType.long++;
  }

  //纵向
  switch (judgePortraitContinuity(type, i, j).position) {
    case 5: chess[i][j] = false; return true; break;
    case 4: judgePortraitContinuity4(type, j, judgePortraitContinuity(type, i, j).startY); break;
    case 3: judgePortraitContinuity3(type, j, judgePortraitContinuity(type, i, j).startY); break;
    case 2: judgePortraitContinuity2(type, j, judgePortraitContinuity(type, i, j).startY); break;
    case 1: judgePortraitContinuity1(type, j, judgePortraitContinuity(type, i, j).startY); break;
    default: chessType.long++;
  }

  //正斜
  switch (judgeInclinedContinuity(type, i, j).position) {
    case 5: chess[i][j] = false; return true; break;
    case 4: judgeInclinedContinuity4(type, judgeInclinedContinuity(type, i, j).startX, judgeInclinedContinuity(type, i, j).startY);
            break;
    case 3: judgeInclinedContinuity3(type, judgeInclinedContinuity(type, i, j).startX, judgeInclinedContinuity(type, i, j).startY);
            break;
    case 2: judgeInclinedContinuity2(type, judgeInclinedContinuity(type, i, j).startX, judgeInclinedContinuity(type, i, j).startY);
            break;
    case 1: judgeInclinedContinuity1(type, judgeInclinedContinuity(type, i, j).startX, judgeInclinedContinuity(type, i, j).startY);
            break;
    default: chessType.long++;
  }

  //反斜
  switch (judgeAntiInclinedContinuity(type, i, j).position) {
    case 5: chess[i][j] = false; return true; break;
    case 4: judgeAntiInclinedContinuity4(type, judgeAntiInclinedContinuity(type, i, j).startX, judgeAntiInclinedContinuity(type, i, j).startY);
            break;
    case 3: judgeAntiInclinedContinuity3(type, judgeAntiInclinedContinuity(type, i, j).startX, judgeAntiInclinedContinuity(type, i, j).startY);
            break;
    case 2: judgeAntiInclinedContinuity2(type, judgeAntiInclinedContinuity(type, i, j).startX, judgeAntiInclinedContinuity(type, i, j).startY);
            break;
    case 1: judgeAntiInclinedContinuity1(type, judgeAntiInclinedContinuity(type, i, j).startX, judgeAntiInclinedContinuity(type, i, j).startY);
            break;
    default: chessType.long++;
  }

  chess[i][j] = false;
  if (sumChessType()) {
    return true;
  } else {
    return false;
  }

  function judgeTransverseContinuity (type, row, col) { //判断横向连续

    var length = 4, start;
        limitLeft = Math.max(0, col - length),
        limitRight = Math.min(14, col + length);
    var continuity = 0, flag = true;
    for (var j = limitLeft; j <= limitRight; j++) {
      if (j === col) {
        flag = false;
      }
      if (chess[row][j] === type) {
        continuity++;
      } else {
        if (flag) {
          continuity = 0;
        } else {
          break;
        }
      }
      startX = j + 1 - continuity;
    }
    return {'position': continuity, 'startX': startX};
  }

  function judgePortraitContinuity (type, row, col) { //判断纵向连续
    var length = 4,
        limitTop = Math.max(0, row - length),
        limitBottom = Math.min(14, row + length);
    var continuity = 0, flag = true;
    for (var i = limitTop; i <= limitBottom; i++) {
      if (i === row) {
        flag = false;
      }
      if (chess[i][col] === type) {
        continuity++;
      } else {
        if (flag) {
          continuity = 0;
        } else {
          break;
        }
      }
      startY = i + 1 - continuity;
    }
    return {'position': continuity, 'startY': startY};
  }

  function judgeInclinedContinuity (type, row, col) { //判断正斜连续
    var continuity = 0, flag = true;
    for (var i = row - 4, j = col + 4, len = 0; len < 9; i++, j--, len++) {
      if (i < 0 || j < 0 || i > 14 || j > 14) {
        continue;
      }
      if (i === row && j === col) {
        flag = false;
      }
      if (chess[i][j] === type) {
        continuity++;
      } else {
        if (flag) {
          continuity = 0;
        } else {
          break;
        }
      }
      startX = j - 1 + continuity;
      startY = i + 1 - continuity;
    }
    return {'position': continuity, 'startX': startX, 'startY': startY};
  }

  function judgeAntiInclinedContinuity (type, row, col) { //判断反斜连续
    var continuity = 0, flag = true;
    for (var i = row - 4, j = col - 4, len = 0; len < 9; i++, j++, len++) {
      if (i < 0 || j < 0 || i > 14 || j > 14) {
        continue;
      }
      if (i === row && j === col) {
        flag = false;
      }
      if (chess[i][j] === type) {
        continuity++;
      } else {
        if (flag) {
          continuity = 0;
        } else {
          break;
        }
      }
      startX = j + 1 - continuity;
      startY = i + 1 - continuity;
    }
    return {'position': continuity, 'startX': startX, 'startY': startY};
  }

  function judgeTransverseContinuity4 (type, row, startX) { //横向连4判断
    if (startX - 1 >= 0 && startX + 4 <= 14) {
      if (chess[row][startX - 1] === false && chess[row][startX + 4] === false) {
        chessType.alive4++;
      } else if (chess[row][startX - 1] !== false && chess[row][startX + 4] !== false) {
        //nothing
      } else {
        chessType.alive4++;
      }
    } else if (startX - 1 < 0 && chess[row][startX + 4] === false) {
      chessType.alive4++;
    } else if (startX + 4 > 14 && chess[row][startX - 1] === false) {
      chessType.alive4++;
    }
  }

  function judgePortraitContinuity4 (type, col, startY) { //纵向连4判断
    if (startY - 1 >= 0 && startY + 4 <= 14) {
      if (chess[startY - 1][col] === false && chess[startY + 4][col] === false) {
        chessType.alive4++;
      } else if (chess[startY - 1][col] !== false && chess[startY + 4][col] !== false) {
        //nothing
      } else {
        chessType.alive4++;
      }
    } else if (startY - 1 < 0 && chess[startY + 4][col] === false) {
      chessType.alive4++;
    } else if (startY + 4 > 14 && chess[startY - 1][col] === false) {
      chessType.alive4++;
    }
  }

  function judgeInclinedContinuity4 (type ,startX, startY) { //正斜连4判断
    var rTpoint = { //右上角点
      x: startY - 1,
      y: startX + 1
    }
    var lBpoint = { //左下角点
      x: startY + 4,
      y: startX - 4
    }
    if (lBpoint.x <= 14 && lBpoint.y >= 0 && rTpoint.x >= 0 && rTpoint.y <= 14) {
      if (chess[rTpoint.x][rTpoint.y] === false && chess[lBpoint.x][lBpoint.y] === false) {
        chessType.alive4++;
      } else if (chess[rTpoint.x][rTpoint.y] !== false && chess[lBpoint.x][lBpoint.y] !== false) {
        //nothing
      } else {
        chessType.alive4++;
      }
    } else if ((rTpoint.x < 0 && lBpoint.y >= 0 || rTpoint.y > 14 && lBpoint.x <= 14 )
      && chess[lBpoint.x][lBpoint.y] === false) {
      chessType.alive4++;
    } else if ((lBpoint.x > 14 && rTpoint.y <= 14 || lBpoint.y < 0 && rTpoint.x >= 0 )
      && chess[rTpoint.x][rTpoint.y] === false) {
      chessType.alive4++;
    }
  }

  function judgeAntiInclinedContinuity4 (type ,startX, startY) { //反斜连4判断
    var lTpoint = { //左上角点
      x: startY - 1,
      y: startX - 1
    }
    var rBpoint = { //右下角点
      x: startY + 4,
      y: startX + 4
    }
    if (lTpoint.x >= 0 && rBpoint.x <= 14  && lTpoint.y >= 0 && rBpoint.y <= 14) {
      if (chess[lTpoint.x][lTpoint.y] === false && chess[rBpoint.x][rBpoint.y] === false) {
        chessType.alive4++;
      } else if (chess[lTpoint.x][lTpoint.y] !== false && chess[rBpoint.x][rBpoint.y] !== false) {
        //nothing
      } else {
        chessType.alive4++;
      }
    } else if ((lTpoint.y < 0 && rBpoint.x <= 14 || lTpoint.x < 0 && rBpoint.y <= 14 )
      && chess[rBpoint.x][rBpoint.y] === false) {
      chessType.alive4++;
    } else if ((lTpoint.x >= 0 && rBpoint.y > 14 || lTpoint.y >= 0 && rBpoint.x > 14 )
      && chess[lTpoint.x][lTpoint.y] === false) {
      chessType.alive4++;
    }
  }

  function judgeTransverseContinuity3 (type, row, startX) { //横向连3判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, type, type, type, false, false];
    for (var i = 0, len = listPosition3.length; i < len; i++) {
      var index = listPosition3[i];
      simulationChess[index] = simTransverseChess(type, row, startX, index - 2);
    }
    scoreContinuity3(simulationChess, type, falseType);
  }

  function judgePortraitContinuity3 (type, col, startY) { //纵向连3判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, type, type, type, false, false];
    for (var i = 0, len = listPosition3.length; i < len; i++) {
      var index = listPosition3[i];
      simulationChess[index] = simPortraitChess(type, col, startY, index - 2);
    }
    scoreContinuity3(simulationChess, type, falseType);
  }

  function judgeInclinedContinuity3 (type ,startX, startY) { //正斜连3判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, type, type, type, false, false];
    for (var i = 0, len = listPosition3.length; i < len; i++) {
      var index = listPosition3[i];
      simulationChess[index] = simInclinedChess(type, startX, startY, index - 2);
    }
    scoreContinuity3(simulationChess, type, falseType);
  }

  function judgeAntiInclinedContinuity3 (type ,startX, startY) { //反斜连3判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, type, type, type, false, false];
    for (var i = 0, len = listPosition3.length; i < len; i++) {
      var index = listPosition3[i];
      simulationChess[index] = simAntiInclinedChess(type, startX, startY, index - 2);
    }
    scoreContinuity3(simulationChess, type, falseType);
  }

  function judgeTransverseContinuity2 (type, row, startX) { //横向连2判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, false, type, type, false, false, false];
    for (var i = 0, len = listPosition2.length; i < len; i++) {
      var index = listPosition2[i];
      simulationChess[index] = simTransverseChess(type, row, startX, index - 3);
    }
    scoreContinuity2(simulationChess, type, falseType);
  }

  function judgePortraitContinuity2 (type, col, startY) { //纵向连2判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, false, type, type, false, false, false];
    for (var i = 0, len = listPosition2.length; i < len; i++) {
      var index = listPosition2[i];
      simulationChess[index] = simPortraitChess(type, col, startY, index - 3);
    }
    scoreContinuity2(simulationChess, type, falseType);
  }

  function judgeInclinedContinuity2 (type ,startX, startY) { //正斜连2判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, false, type, type, false, false, false];
    for (var i = 0, len = listPosition2.length; i < len; i++) {
      var index = listPosition2[i];
      simulationChess[index] = simInclinedChess(type, startX, startY, index - 3);
    }
    scoreContinuity2(simulationChess, type, falseType);
  }

  function judgeAntiInclinedContinuity2 (type ,startX, startY) { //反斜连2判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, false, type, type, false, false, false];
    for (var i = 0, len = listPosition2.length; i < len; i++) {
      var index = listPosition2[i];
      simulationChess[index] = simAntiInclinedChess(type, startX, startY, index - 3);
    }
    scoreContinuity2(simulationChess, type, falseType);
  }

  function judgeTransverseContinuity1 (type, row, startX) { //横向单1判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, false, false, type, false, false, false, false];
    for (var i = 0, len = listPosition1.length; i < len; i++) {
      var index = listPosition1[i];
      simulationChess[index] = simTransverseChess(type, row, startX, index - 4);
    }
    scoreContinuity1(simulationChess, type, falseType);
  }

  function judgePortraitContinuity1 (type, col, startY) { //纵向单1判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, false, false, type, false, false, false, false];
    for (var i = 0, len = listPosition1.length; i < len; i++) {
      var index = listPosition1[i];
      simulationChess[index] = simPortraitChess(type, col, startY, index - 4);
    }
    scoreContinuity1(simulationChess, type, falseType);
  }

  function judgeInclinedContinuity1 (type ,startX, startY) { //正斜单1判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, false, false, type, false, false, false, false];
    for (var i = 0, len = listPosition1.length; i < len; i++) {
      var index = listPosition1[i];
      simulationChess[index] = simInclinedChess(type, startX, startY, index - 4);
    }
    scoreContinuity1(simulationChess, type, falseType);
  }

  function judgeAntiInclinedContinuity1 (type ,startX, startY) { //反斜单1判断
    var falseType = (type + 1) % 2;
    var simulationChess = [false, false, false, false, type, false, false, false, false];
    for (var i = 0, len = listPosition1.length; i < len; i++) {
      var index = listPosition1[i];
      simulationChess[index] = simAntiInclinedChess(type, startX, startY, index - 4);
    }
    scoreContinuity1(simulationChess, type, falseType);
  }

  function simTransverseChess (type, row, startX, position) { //横向模型类型
    var falseType = (type + 1) % 2;
    if (position < 0) {
      if (startX + position < 0 || chess[row][startX + position] === falseType) {
        return falseType;
      }
    } else {
      if (startX + position > 14 || chess[row][startX + position] === falseType) {
        return falseType;
      }
    }
    if (chess[row][startX + position] === type) {
      return type;
    } else {
      return false;
    }
  }

  function simPortraitChess (type, col, startY, position) { //纵向模型类型
    var falseType = (type + 1) % 2;
    if (position < 0) {
      if (startY + position < 0 || chess[startY + position][col] === falseType) {
        return falseType;
      }
    } else {
      if (startY + position > 14 || chess[startY + position][col] === falseType) {
        return falseType;
      }
    }
    if (chess[startY + position][col] === type) {
      return type;
    } else {
      return false;
    }
  }

  function simInclinedChess (type ,startX, startY, position) { //正斜模型类型
    var falseType = (type + 1) % 2;
    if (position < 0) {
      if (startY + position < 0 || startX - position > 14
        || chess[startY + position][startX - position] === falseType) {  
        return falseType;
      }
    } else {
      if (startY + position > 14 || startX - position < 0
        || chess[startY + position][startX - position] === falseType) {
        return falseType;
      }
    }
    if (chess[startY + position][startX - position] === type) {
      return type;
    } else {
      return false;
    }
  }

  function simAntiInclinedChess (type ,startX, startY, position) { //反斜模型类型
    var falseType = (type + 1) % 2;
    if (position < 0) {
      if (startY + position < 0 || startX + position < 0
        || chess[startY + position][startX + position] === falseType) {  
        return falseType;
      }
    } else {
      if (startY + position > 14 || startX + position > 14
        || chess[startY + position][startX + position] === falseType) {
        return falseType;
      }
    }
    if (chess[startY + position][startX + position] === type) {
      return type;
    } else {
      return false;
    }
  }

  function scoreContinuity3 (simulationChess, type, falseType) { //连3得分
    if (simulationChess[1] === false && simulationChess[5] === false) {
      chessType.alive3++;
    }
    if (simulationChess[0] === type && simulationChess[1] === false
      && simulationChess[5] === false && simulationChess[6] === type) {
      chessType.alive4 += 2;
    }
  }

  function scoreContinuity2 (simulationChess, type, falseType) { //连2得分
    if (simulationChess[2] === false && simulationChess[5] === false) {
      if (simulationChess[6] === type && simulationChess[7] === type
        && simulationChess[1] === type && simulationChess[0] === type) {
        chessType.alive4 += 2;
      }
      if (simulationChess[6] === type && simulationChess[7] === false
        || simulationChess[1] === type && simulationChess[0] === false) {
        chessType.alive3++;
      }
    }
  }

  function scoreContinuity1 (simulationChess, type, falseType) { //单1得分
    if (simulationChess[6] === type && simulationChess[7] === type) {
      if (simulationChess[3] === false || simulationChess[8] === false) {
        chessType.alive4++;
      }
    }
    if (simulationChess[1] === type && simulationChess[2] === type) {
      if (simulationChess[0] === false || simulationChess[5] === false) {
        chessType.alive4++;
      }
    }
  }

  function sumChessType () {
    if (chessType.alive4 + chessType.alive3 >= 2) {
      return true;
    }
    if (chessType.long >= 1) {
      return true;
    }
    return false;
  }
}
