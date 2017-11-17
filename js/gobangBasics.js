var listPosition3 = [0, 1, 5, 6],
    listPosition2 = [0, 1, 2, 5, 6, 7];
    listPosition1 = [0, 1, 2, 3, 5, 6, 7, 8];

function judgeTransverseContinuity (chess, type, row, col) { //判断横向连续
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

function judgePortraitContinuity (chess, type, row, col) { //判断纵向连续
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

function judgeInclinedContinuity (chess, type, row, col) { //判断正斜连续
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

function judgeAntiInclinedContinuity (chess, type, row, col) { //判断反斜连续
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

function judgeTransverseContinuity4 (chess, type, row, startX) { //横向连4判断
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

function judgePortraitContinuity4 (chess, type, col, startY) { //纵向连4判断
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

function judgeInclinedContinuity4 (chess, type ,startX, startY) { //正斜连4判断
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
  } else if ((rTpoint.x < 0 && lBpoint.y >= 0 || rTpoint.y > 14 && lBpoint.x <= 14 )
    && chess[lBpoint.x][lBpoint.y] === false) {
    chessType.die4++;
  } else if ((lBpoint.x > 14 && rTpoint.y <= 14 || lBpoint.y < 0 && rTpoint.x >= 0 )
    && chess[rTpoint.x][rTpoint.y] === false) {
    chessType.die4++;
  }
}

function judgeAntiInclinedContinuity4 (chess, type ,startX, startY) { //反斜连4判断
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

function judgeTransverseContinuity3 (chess, type, row, startX) { //横向连3判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, type, type, type, false, false];
  for (var i = 0, len = listPosition3.length; i < len; i++) {
    var index = listPosition3[i];
    simulationChess[index] = simTransverseChess(chess, type, row, startX, index - 2);
  }
  scoreContinuity3(simulationChess, type, falseType);
}

function judgePortraitContinuity3 (chess, type, col, startY) { //纵向连3判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, type, type, type, false, false];
  for (var i = 0, len = listPosition3.length; i < len; i++) {
    var index = listPosition3[i];
    simulationChess[index] = simPortraitChess(chess, type, col, startY, index - 2);
  }
  scoreContinuity3(simulationChess, type, falseType);
}

function judgeInclinedContinuity3 (chess, type ,startX, startY) { //正斜连3判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, type, type, type, false, false];
  for (var i = 0, len = listPosition3.length; i < len; i++) {
    var index = listPosition3[i];
    simulationChess[index] = simInclinedChess(chess, type, startX, startY, index - 2);
  }
  scoreContinuity3(simulationChess, type, falseType);
}

function judgeAntiInclinedContinuity3 (chess, type ,startX, startY) { //反斜连3判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, type, type, type, false, false];
  for (var i = 0, len = listPosition3.length; i < len; i++) {
    var index = listPosition3[i];
    simulationChess[index] = simAntiInclinedChess(chess, type, startX, startY, index - 2);
  }
  scoreContinuity3(simulationChess, type, falseType);
}

function judgeTransverseContinuity2 (chess, type, row, startX) { //横向连2判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, type, type, false, false, false];
  for (var i = 0, len = listPosition2.length; i < len; i++) {
    var index = listPosition2[i];
    simulationChess[index] = simTransverseChess(chess, type, row, startX, index - 3);
  }
  scoreContinuity2(simulationChess, type, falseType);
}

function judgePortraitContinuity2 (chess, type, col, startY) { //纵向连2判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, type, type, false, false, false];
  for (var i = 0, len = listPosition2.length; i < len; i++) {
    var index = listPosition2[i];
    simulationChess[index] = simPortraitChess(chess, type, col, startY, index - 3);
  }
  scoreContinuity2(simulationChess, type, falseType);
}

function judgeInclinedContinuity2 (chess, type ,startX, startY) { //正斜连2判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, type, type, false, false, false];
  for (var i = 0, len = listPosition2.length; i < len; i++) {
    var index = listPosition2[i];
    simulationChess[index] = simInclinedChess(chess, type, startX, startY, index - 3);
  }
  scoreContinuity2(simulationChess, type, falseType);
}

function judgeAntiInclinedContinuity2 (chess, type ,startX, startY) { //反斜连2判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, type, type, false, false, false];
  for (var i = 0, len = listPosition2.length; i < len; i++) {
    var index = listPosition2[i];
    simulationChess[index] = simAntiInclinedChess(chess, type, startX, startY, index - 3);
  }
  scoreContinuity2(simulationChess, type, falseType);
}

function judgeTransverseContinuity1 (chess, type, row, startX) { //横向单1判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, false, type, false, false, false, false];
  for (var i = 0, len = listPosition1.length; i < len; i++) {
    var index = listPosition1[i];
    simulationChess[index] = simTransverseChess(chess, type, row, startX, index - 4);
  }
  scoreContinuity1(simulationChess, type, falseType);
}

function judgePortraitContinuity1 (chess, type, col, startY) { //纵向单1判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, false, type, false, false, false, false];
  for (var i = 0, len = listPosition1.length; i < len; i++) {
    var index = listPosition1[i];
    simulationChess[index] = simPortraitChess(chess, type, col, startY, index - 4);
  }
  scoreContinuity1(simulationChess, type, falseType);
}

function judgeInclinedContinuity1 (chess, type ,startX, startY) { //正斜单1判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, false, type, false, false, false, false];
  for (var i = 0, len = listPosition1.length; i < len; i++) {
    var index = listPosition1[i];
    simulationChess[index] = simInclinedChess(chess, type, startX, startY, index - 4);
  }
  scoreContinuity1(simulationChess, type, falseType);
}

function judgeAntiInclinedContinuity1 (chess, type ,startX, startY) { //反斜单1判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, false, type, false, false, false, false];
  for (var i = 0, len = listPosition1.length; i < len; i++) {
    var index = listPosition1[i];
    simulationChess[index] = simAntiInclinedChess(type, startX, startY, index - 4);
  }
  scoreContinuity1(simulationChess, type, falseType);
}

function simTransverseChess (chess, type, row, startX, position) { //横向模型类型
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

function simPortraitChess (chess, type, col, startY, position) { //纵向模型类型
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

function simInclinedChess (chess, type ,startX, startY, position) { //正斜模型类型
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

function simAntiInclinedChess (chess, type ,startX, startY, position) { //反斜模型类型
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