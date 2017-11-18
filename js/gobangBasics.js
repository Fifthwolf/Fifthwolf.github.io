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