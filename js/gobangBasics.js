var listPosition4 = [0, 5],
    listPosition3 = [0, 1, 5, 6],
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

function judgeContinuity4 (chess, type, row, col, startX, startY, direction) { //连4判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, type, type, type, type, false];
  for (var i = 0, len = listPosition4.length; i < len; i++) {
    var index = listPosition4[i];
    switch (direction) {
      case 1: simulationChess[index] = simTransverseChess(chess, type, row, startX, index - 1); break;
      case 2: simulationChess[index] = simPortraitChess(chess, type, col, startY, index - 1); break;
      case 3: simulationChess[index] = simInclinedChess(chess, type, startX, startY, index - 1); break;
      case 4: simulationChess[index] = simAntiInclinedChess(chess, type, startX, startY, index - 1); break;
    }
  }
  return simulationChess;
}

function judgeTransverseContinuity3 (chess, type, row, startX) { //横向连3判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, type, type, type, false, false];
  for (var i = 0, len = listPosition3.length; i < len; i++) {
    var index = listPosition3[i];
    simulationChess[index] = simTransverseChess(chess, type, row, startX, index - 2);
  }
  return simulationChess;
}

function judgePortraitContinuity3 (chess, type, col, startY) { //纵向连3判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, type, type, type, false, false];
  for (var i = 0, len = listPosition3.length; i < len; i++) {
    var index = listPosition3[i];
    simulationChess[index] = simPortraitChess(chess, type, col, startY, index - 2);
  }
  return simulationChess;
}

function judgeInclinedContinuity3 (chess, type ,startX, startY) { //正斜连3判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, type, type, type, false, false];
  for (var i = 0, len = listPosition3.length; i < len; i++) {
    var index = listPosition3[i];
    simulationChess[index] = simInclinedChess(chess, type, startX, startY, index - 2);
  }
  return simulationChess;
}

function judgeAntiInclinedContinuity3 (chess, type ,startX, startY) { //反斜连3判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, type, type, type, false, false];
  for (var i = 0, len = listPosition3.length; i < len; i++) {
    var index = listPosition3[i];
    simulationChess[index] = simAntiInclinedChess(chess, type, startX, startY, index - 2);
  }
  return simulationChess;
}

function judgeTransverseContinuity2 (chess, type, row, startX) { //横向连2判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, type, type, false, false, false];
  for (var i = 0, len = listPosition2.length; i < len; i++) {
    var index = listPosition2[i];
    simulationChess[index] = simTransverseChess(chess, type, row, startX, index - 3);
  }
  return simulationChess;
}

function judgePortraitContinuity2 (chess, type, col, startY) { //纵向连2判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, type, type, false, false, false];
  for (var i = 0, len = listPosition2.length; i < len; i++) {
    var index = listPosition2[i];
    simulationChess[index] = simPortraitChess(chess, type, col, startY, index - 3);
  }
  return simulationChess;
}

function judgeInclinedContinuity2 (chess, type ,startX, startY) { //正斜连2判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, type, type, false, false, false];
  for (var i = 0, len = listPosition2.length; i < len; i++) {
    var index = listPosition2[i];
    simulationChess[index] = simInclinedChess(chess, type, startX, startY, index - 3);
  }
  return simulationChess;
}

function judgeAntiInclinedContinuity2 (chess, type ,startX, startY) { //反斜连2判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, type, type, false, false, false];
  for (var i = 0, len = listPosition2.length; i < len; i++) {
    var index = listPosition2[i];
    simulationChess[index] = simAntiInclinedChess(chess, type, startX, startY, index - 3);
  }
  return simulationChess;
}

function judgeTransverseContinuity1 (chess, type, row, startX) { //横向单1判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, false, type, false, false, false, false];
  for (var i = 0, len = listPosition1.length; i < len; i++) {
    var index = listPosition1[i];
    simulationChess[index] = simTransverseChess(chess, type, row, startX, index - 4);
  }
  return simulationChess;
}

function judgePortraitContinuity1 (chess, type, col, startY) { //纵向单1判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, false, type, false, false, false, false];
  for (var i = 0, len = listPosition1.length; i < len; i++) {
    var index = listPosition1[i];
    simulationChess[index] = simPortraitChess(chess, type, col, startY, index - 4);
  }
  return simulationChess;
}

function judgeInclinedContinuity1 (chess, type ,startX, startY) { //正斜单1判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, false, type, false, false, false, false];
  for (var i = 0, len = listPosition1.length; i < len; i++) {
    var index = listPosition1[i];
    simulationChess[index] = simInclinedChess(chess, type, startX, startY, index - 4);
  }
  return simulationChess;
}

function judgeAntiInclinedContinuity1 (chess, type ,startX, startY) { //反斜单1判断
  var falseType = (type + 1) % 2;
  var simulationChess = [false, false, false, false, type, false, false, false, false];
  for (var i = 0, len = listPosition1.length; i < len; i++) {
    var index = listPosition1[i];
    simulationChess[index] = simAntiInclinedChess(chess, type, startX, startY, index - 4);
  }
  return simulationChess;
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
