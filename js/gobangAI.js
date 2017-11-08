/*
chess: array 棋盘2维数组数据
currentPlayer: int 当前落子
*/
function amai (chess, currentPlayer) { //AI落子
  var AIchess = {
    we: [],
    other: []
  }

  AIchess.we = new Array(15);
  AIchess.other = new Array(15);

  /* 逐格打分 */
  for (var i = 0; i < 15; i++) {
    AIchess.we[i] = new Array(15);
    AIchess.other[i] = new Array(15);
    for (var j = 0; j < 15; j++) {
      AIchess.we[i][j] = 0;
      AIchess.other[i][j] = 0;
      if (chess[i][j] !== false) {
        continue;
      }
      _AIScore(i, j, currentPlayer, AIchess.we);
      _AIScore(i, j, (currentPlayer + 1) % 2, AIchess.other);
    }
  }
  /* 逐格打分 */

  var tempPosition, i = 7, j = 7, direction = 0, limit = 1; //初始化tempPosition位置
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

  var wePosition = [tempPosition], otherPosition = [tempPosition],
      weScoreMax = 0, otherScoreMax = 0;
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (chess[i][j] !== false) {
        continue;
      }
      if (AIchess.we[i][j] > weScoreMax) {
        weScoreMax = AIchess.we[i][j];
        wePosition = [[i, j]];
      } else if (AIchess.we[i][j] === weScoreMax) {
        wePosition.push([i, j]);
      }
      if (AIchess.other[i][j] > otherScoreMax) {
        otherScoreMax = AIchess.other[i][j];
        otherPosition = [[i, j]];
      } else if (AIchess.other[i][j] === otherScoreMax) {
        otherPosition.push([i, j]);
      }
    }
  }

  if (weScoreMax >= otherScoreMax) {
    console.log('attack');
    if (wePosition.length === 1) {
      tempPosition = wePosition[0];
    } else {
      tempPosition = _maxPosition(wePosition, AIchess.other, wePosition[0]);
    }
  } else {
    console.log('defense');
    if (otherPosition.length === 1) {
      tempPosition = otherPosition[0];
    } else {  
      tempPosition = _maxPosition(otherPosition, AIchess.we, otherPosition[0]);

    }
  }

  /*
  for (var i = 0; i < 15; i++) {
    var m = [];
    for (var j = 0; j < 15; j++) {
      m.push(AIchess.we[i][j]);
    }
    console.log(m);
  }
  */
  for (var i = 0; i < 15; i++) {
    var m = [];
    for (var j = 0; j < 15; j++) {
      m.push(AIchess.other[i][j]);
    }
    console.log(m);
  }
  
 
  function _maxPosition (currentPosition, compareChess, tempPosition) {
    var position = tempPosition, maxScore = 0;
    for (var i = 0; i < currentPosition.length; i++) {
      if (compareChess[currentPosition[i][0]][currentPosition[i][1]] > maxScore) {
        maxScore = compareChess[currentPosition[i][0]][currentPosition[i][1]];
        position = [currentPosition[i][0], currentPosition[i][1]];
      }
    }
    return position;
  }
  
  playChess(tempPosition[1], tempPosition[0]);

  function _AIScore (i, j, type, AIchess) { //判断得分
    chess[i][j] = type;

    var chessType = {
      die4: 0,
      alive4: 0,
      die3: 0,
      alive3: 0,
      die2: 0,
      alive2: 0
    }
   
    //横向
    switch (judgeTransverseContinuity(type, i, j).position) {
      case 5: AIchess[i][j] += 100000; break;
      case 4: judgeTransverseContinuity4(type, i, judgeTransverseContinuity(type, i, j).startX); break;
      case 3: judgeTransverseContinuity3(type, i, judgeTransverseContinuity(type, i, j).startX); break;
      case 2: AIchess[i][j] += 100; break;
    }

    //纵向
    switch (judgePortraitContinuity(type, i, j).position) {
      case 5: AIchess[i][j] += 100000; break;
      case 4: judgePortraitContinuity4(type, j, judgePortraitContinuity(type, i, j).startY); break;
      case 3: judgePortraitContinuity3(type, j, judgePortraitContinuity(type, i, j).startY); break;
      case 2: AIchess[i][j] += 100; break;
    }

    //正斜
    switch (judgeInclinedContinuity(type, i, j).position) {
      case 5: AIchess[i][j] += 100000; break;
      case 4: judgeInclinedContinuity4(type, judgeInclinedContinuity(type, i, j).startX, judgeInclinedContinuity(type, i, j).startY);
              break;
      case 3: judgeInclinedContinuity3(type, judgeInclinedContinuity(type, i, j).startX, judgeInclinedContinuity(type, i, j).startY);
              break;
      case 2: AIchess[i][j] += 100; break;
    }

    //反斜
    switch (judgeAntiInclinedContinuity(type, i, j).position) {
      case 5: AIchess[i][j] += 100000; break;
      case 4: judgeAntiInclinedContinuity4(type, judgeAntiInclinedContinuity(type, i, j).startX, judgeAntiInclinedContinuity(type, i, j).startY);
              break;
      case 3: judgeAntiInclinedContinuity3(type, judgeAntiInclinedContinuity(type, i, j).startX, judgeAntiInclinedContinuity(type, i, j).startY);
              break;
      case 2: AIchess[i][j] += 100; break;
    }

    sumChessScore(i, j);

    chess[i][j] = false;

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
      return {'position': Math.min(5, continuity), 'startX': startX};
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
      return {'position': Math.min(5, continuity), 'startY': startY};
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
      return {'position': Math.min(5, continuity), 'startX': startX, 'startY': startY};
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
      return {'position': Math.min(5, continuity), 'startX': startX, 'startY': startY};
    }

    function judgeTransverseContinuity4 (type, row, startX) { //横向连4判断
      if (startX - 1 >= 0 && startX + 4 <= 14) {
        if (chess[row][startX - 1] === false && chess[row][startX + 4] === false) {
          chessType.alive4++;
        } else if (chess[row][startX - 1] !== false && chess[row][startX + 4] !== false) {
          //nothing
        } else {
          chessType.die4++;
        }
      } else if (startX - 1 < 0 && chess[row][startX + 4] === false) {
        chessType.die4++;
      } else if (startX + 4 > 14 && chess[row][startX - 1] === false) {
        chessType.die4++;
      }
    }

    function judgePortraitContinuity4 (type, col, startY) { //纵向连4判断
      if (startY - 1 >= 0 && startY + 4 <= 14) {
        if (chess[startY - 1][col] === false && chess[startY + 4][col] === false) {
          chessType.alive4++;
        } else if (chess[startY - 1][col] !== false && chess[startY + 4][col] !== false) {
          //nothing
        } else {
          chessType.die4++;
        }
      } else if (startY - 1 < 0 && chess[startY + 4][col] === false) {
        chessType.die4++;
      } else if (startY + 4 > 14 && chess[startY - 1][col] === false) {
        chessType.die4++;
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
          chessType.die4++;
        }
      } else if ((rTpoint.x < 0 && lBpoint.y >= 0 || rTpoint.y > 14 && lBpoint.x >= 14 )
        && chess[lBpoint.x][lBpoint.y] === false) {
        chessType.die4++;
      } else if ((lBpoint.x > 14 && rTpoint.y <= 14 || lBpoint.y < 0 && rTpoint.x <= 0 )
        && chess[rTpoint.x][rTpoint.y] === false) {
        chessType.die4++;
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
          chessType.die4++;
        }
      } else if ((lTpoint.y < 0 && rBpoint.x <= 14 || lTpoint.x < 0 && rBpoint.y <= 14 )
        && chess[rBpoint.x][rBpoint.y] === false) {
        chessType.die4++;
      } else if ((lTpoint.x >= 0 && rBpoint.y > 14 || lTpoint.y >= 0 && rBpoint.x > 14 )
        && chess[lTpoint.x][lTpoint.y] === false) {
        chessType.die4++;
      }
    }

    function judgeTransverseContinuity3 (type, row, startX) { //横向连3判断
      var falseType = (type + 1) % 2;
      var simulationChess = [false, false, type, type, type, false, false];
      if (startX - 2 < 0 || chess[row][startX - 2] === falseType) {
        simulationChess[0] = falseType;
      } else if (chess[row][startX - 2] === type) {
        simulationChess[0] = type;
      }
      if (startX - 1 < 0 || chess[row][startX - 1] !== false) {
        simulationChess[1] = falseType;
      }
      if (startX + 3 > 14 || chess[row][startX + 3] !== false) {
        simulationChess[5] = falseType;
      }
      if (startX + 4 > 14 || chess[row][startX + 4] === falseType) {
        simulationChess[6] = falseType;
      } else if (chess[row][startX + 4] === type) {
        simulationChess[0] = type;
      }
      scoreContinuity3(simulationChess, type, falseType);
    }

    function judgePortraitContinuity3 (type, col, startY) { //纵向连3判断
      var falseType = (type + 1) % 2;
      var simulationChess = [false, false, type, type, type, false, false];
      if (startY - 2 < 0 || chess[startY - 2][col] === falseType) {  
        simulationChess[0] = falseType;
      } else if (chess[startY - 2][col] === type) {
        simulationChess[0] = type;
      }
      if (startY - 1 < 0 || chess[startY - 1][col] !== false) {
        simulationChess[1] = falseType;
      }
      if (startY + 3 > 14 || chess[startY + 3][col] !== false) {
        simulationChess[5] = falseType;
      }
      if (startY + 4 > 14 || chess[startY + 4][col] === falseType) {
        simulationChess[6] = falseType;
      } else if (chess[startY + 4][col] === type) {
        simulationChess[0] = type;
      }
      scoreContinuity3(simulationChess, type, falseType);
    }

    function judgeInclinedContinuity3 (type ,startX, startY) { //正斜连3判断
      var falseType = (type + 1) % 2;
      var simulationChess = [false, false, type, type, type, false, false];
      if (startY - 2 < 0 || startX + 2 > 14
        || chess[startY - 2][startX + 2] === falseType) {  
        simulationChess[0] = falseType;
      } else if (chess[startY - 2][startX + 2] === type) {
        simulationChess[0] = type;
      }
      if (startY - 1 < 0 || startX + 1 > 14
        || chess[startY - 1][startX + 1] !== false) {
        simulationChess[1] = falseType;
      }
      if (startY + 3 > 14 || startX - 3 < 0
        || chess[startY + 3][startX - 3] !== false) {
        simulationChess[5] = falseType;
      }
      if (startY + 4 > 14 || startX - 4 < 0
        || chess[startY + 4][startX - 4] === falseType) {
        simulationChess[6] = falseType;
      } else if (chess[startY + 4][startX - 4] === type) {
        simulationChess[0] = type;
      }
      scoreContinuity3(simulationChess, type, falseType);
    }

    function judgeAntiInclinedContinuity3 (type ,startX, startY) { //反斜连3判断
      var falseType = (type + 1) % 2;
      var simulationChess = [false, false, type, type, type, false, false];
      if (startY - 2 < 0 || startX - 2 < 0
        || chess[startY - 2][startX - 2] === falseType) {  
        simulationChess[0] = falseType;
      } else if (chess[startY - 2][startX - 2] === type) {
        simulationChess[0] = type;
      }
      if (startY - 1 < 0 || startX - 1 < 0
        || chess[startY - 1][startX - 1] !== false) {
        simulationChess[1] = falseType;
      }
      if (startY + 3 > 14 || startX + 3 > 14
        || chess[startY + 3][startX + 3] !== false) {
        simulationChess[5] = falseType;
      }
      if (startY + 4 > 14 || startX + 4 > 14
        || chess[startY + 4][startX + 4] === falseType) {
        simulationChess[6] = falseType;
      } else if (chess[startY + 4][startX + 4] === type) {
        simulationChess[0] = type;
      }
      scoreContinuity3(simulationChess, type, falseType);
    }

    function scoreContinuity3 (simulationChess, type, falseType) {
      if (simulationChess[1] === false && simulationChess[5] === false) {
        if (simulationChess[0] === falseType && simulationChess[6] === falseType) { //均为对手棋子
          chessType.die3++;
        } else if (simulationChess[0] === type || simulationChess[6] === type) { //只要一个为自己的棋子
          chessType.die4++;
        } else if (simulationChess[0] === false || simulationChess[6] === false) { //只要有一个空
          chessType.alive3++;
        }
      } else if (simulationChess[1] === falseType && simulationChess[5] === falseType) {
        //nothing
      } else if (simulationChess[1] === false || simulationChess[5] === false) {
        if (simulationChess[1] === falseType) {
          if (simulationChess[6] === false) {
            chessType.die3++;
          } else if (simulationChess[6] === type) {
            chessType.die4++;
          }
        }
        if (simulationChess[5] === falseType) {
          if (simulationChess[0] === false) {
            chessType.die3++;
          } else if (simulationChess[0] === type) {
            chessType.die4++;
          }
        }
      }
    }

    function sumChessScore (i, j) {
      if (chessType.alive4 >= 1 || chessType.die4 >= 2 || chessType.die4 >= 1 && chessType.alive3 >= 1) {
        AIchess[i][j] += 10000;
      }
      if (chessType.alive3 >= 2) {
        AIchess[i][j] += 5000;
      }
      if (chessType.die3 >= 1 && chessType.alive3 >= 1) {
        AIchess[i][j] += 1000;
      }
      if (chessType.die4 >= 1) {
        AIchess[i][j] += 500;
      }
      if (chessType.alive3 >= 1) {
        AIchess[i][j] += 100;
      }
      if (chessType.alive2 >= 2) {
        AIchess[i][j] += 50;
      }
      if (chessType.alive2 >= 1) {
        AIchess[i][j] += 10;
      }
      if (chessType.die3 >= 1) {
        AIchess[i][j] += 5;
      }
      if (chessType.die2 >= 1) {
        AIchess[i][j] += 2;
      }
    }
  }
}
