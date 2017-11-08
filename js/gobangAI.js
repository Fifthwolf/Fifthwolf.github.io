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

    //横向
    switch (judgeTransverseContinuity(type, i, j)) {
      case 5: AIchess[i][j] += 100000; break;
      //case 4: AIchess[i][j] += judgeTransverseContinuity4(type, i, j); break; //连4
      case 3: AIchess[i][j] += 1000; break;
      case 2: AIchess[i][j] += 100; break;
    }

    //纵向
    switch (judgePortraitContinuity(type, i, j)) {
      case 5: AIchess[i][j] += 100000; break;
      //case 4: AIchess[i][j] += judgePortraitContinuity4(type, i, j); break; //连4
      case 3: AIchess[i][j] += 1000; break;
      case 2: AIchess[i][j] += 100; break;
    }

    //正斜
    switch (judgeInclinedContinuity(type, i, j)) {
      case 5: AIchess[i][j] += 100000; break;
      //case 4: AIchess[i][j] += judgeInclinedContinuity4(type, i, j); break; //连4
      case 3: AIchess[i][j] += 1000; break;
      case 2: AIchess[i][j] += 100; break;
    }

    //反斜
    switch (judgeAntiInclinedContinuity(type, i, j)) {
      case 5: AIchess[i][j] += 100000; break;
      //case 4: AIchess[i][j] += judgeAntiInclinedContinuity4(type, i, j); break; //连4
      case 3: AIchess[i][j] += 1000; break;
      case 2: AIchess[i][j] += 100; break;
    }

    chess[i][j] = false;
  }

  function judgeTransverseContinuity (type, row, col) { //判断横向连续
    var length = 4,
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
    }
    return Math.min(5, continuity);
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
    }
    return Math.min(5, continuity);
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
    }
    return Math.min(5, continuity);
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
    }
    return Math.min(5, continuity);
  }

  /*
  function judgeContinuity4 (type, row, col) { //判断连4
    var length = 4, continuityChess = 4, death4 = 0;
    var limitLeft = Math.max(0, col - length),
        limitRight = Math.min(14, col + length);
        limitTop = Math.max(0, row - length),
        limitBottom = Math.min(14, row + length);

    // 横向判断
    var continuity = 0;
    for (var j = limitLeft; j <= limitRight; j++) {
      chess[row][j] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (j + 1 <= 14  && j - 4 >= 0) {
          if (chess[row][j + 1] === false && chess[row][j - 4] === false) {
            return 10000; //活4
          }
        } else if (j + 1 <= 14 && chess[row][j + 1] === false || j - 4 >= 0 && chess[row][j - 4] === false) {
          death4++; //死4
        }
      }
    }

    //纵向判断
    continuity = 0;
    for (var i = limitTop; i <= limitBottom; i++) {
      chess[i][col] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (row + 1 <= 14 && row - 4 >= 0) {
          if (chess[i + 1][col] === false && chess[i - 4][col] === false) {
            return 10000; //活4
          }
        } else if (row + 1 <= 14 && chess[row + 1][j] === false || row - 4 >= 0 && chess[row - 4][j] === false) {
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
      chess[i][j] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (row + 1 <= 14 && j - 1 >= 0 && row - 4 >= 0 && j + 4 <= 14) {
          if (chess[row + 1][j - 1] === false && chess[row - 4][j + 4] === false) {
            return 10000; //活4
          }
        } else if (row + 1 <= 14 && j - 1 >= 0 && chess[row + 1][j - 1] === false ||
          row - 4 >= 0 && j + 4 <= 14 && chess[row - 4][j + 4] === false) {
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
      chess[i][j] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (row + 1 <= 14 && j + 1 <= 14 && row - 4 >= 0 && j - 4 >= 0) {
          if (chess[row + 1][j + 1] === false && chess[row - 4][j - 4] === false) {
            return 10000; //活4
          }
        } else if (row + 1 <= 14 && j + 1 <= 14 && chess[row + 1][j + 1] === false ||
          row - 4 >= 0 && j - 4 >= 0 && chess[row - 4][j - 4] === false) {
          death4++; //死4
        }
      }
    }
    if (death4 >= 2) {
      return 10000;
    }
  
    return false;
  }
  */
}
  

/*
data.chess[4][6] = 0;
data.chess[4][8] = 0;
data.chess[5][8] = 0;
data.chess[5][10] = 0;
data.chess[6][7] = 0;
data.chess[6][9] = 0;
data.chess[7][6] = 0;
data.chess[7][7] = 0;
data.chess[7][8] = 0;
data.chess[7][10] = 0;
data.chess[8][11] = 0;
drawChess(6,4,0);
drawChess(8,4,0);
drawChess(8,5,0);
drawChess(10,5,0);
drawChess(7,6,0);
drawChess(9,6,0);
drawChess(6,7,0);
drawChess(7,7,0);
drawChess(8,7,0);
drawChess(10,7,0);
drawChess(11,8,0);
data.chess[3][5] = 1;
data.chess[3][9] = 1;
data.chess[4][7] = 1;
data.chess[4][9] = 1;
data.chess[5][7] = 1;
data.chess[6][6] = 1;
data.chess[6][8] = 1;
data.chess[7][5] = 1;
data.chess[7][9] = 1;
data.chess[8][7] = 1;
data.chess[9][12] = 1;
drawChess(5,3,1);
drawChess(9,3,1);
drawChess(7,4,1);
drawChess(9,4,1);
drawChess(7,5,1);
drawChess(6,6,1);
drawChess(8,6,1);
drawChess(5,7,1);
drawChess(9,7,1);
drawChess(7,8,1);
drawChess(12,9,1);
*/