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
      _AIScore(i, j, currentPlayer);
    }
  }

  var tempPosition, scoreMax = 0;
  outer:for (var i = 0; i < 15; i++) { //初始化tempPosition位置
    for (var j = 0; j < 15; j++) {
      if (chess[i][j] === false) {
        tempPosition = [i, j];
        break outer;
      }
    }
  }

  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (chess[i][j] !== false) {
        continue;
      }
      if (AIchess.we[i][j] > scoreMax) {
        scoreMax = AIchess.we[i][j];
        tempPosition = [i, j];
      }
    }
  }

  //输出得分表
  for (var i = 0; i < 15; i++) {
    var m = [];
    for (var j = 0; j < 15; j++) {
      m.push(AIchess.we[i][j]);
    }
    console.log(m);
  }

  playChess(tempPosition[1], tempPosition[0]);
  
  function _AIScore (i, j, type) { //判断得分
    chess[i][j] = type;

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

    chess[i][j] = false;
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
      chess[row][j] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (chess[row][j + 1] === false && chess[row][j - 4] === false) {
          return 10000; //活4
        } else if (chess[row][j + 1] === false || chess[row][j - 4] === false) {
          death4++; //死4
        }
      }
    }
  
    //纵向判断
    continuity = 0;
    for (var i = limitTop; i <= limitBottom; i++) {
      chess[i][col] === type ? continuity++ : continuity = 0;
      if (continuity == continuityChess) {
        if (chess[row + 1][j] === false && chess[row - 4][j] === false) {
          return 10000; //活4
        } else if (chess[row + 1][j] === false || chess[row - 4][j] === false) {
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
        if (chess[row + 1][j - 1] === false && chess[row - 4][j + 4] === false) {
          return 10000; //活4
        } else if (chess[row + 1][j - 1] === false || chess[row - 4][j + 4] === false) {
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
        if (chess[row + 1][j + 1] === false && chess[row - 4][j - 4] === false) {
          return 10000; //活4
        } else if (chess[row + 1][j + 1] === false || chess[row - 4][j - 4] === false) {
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

function judgeContinuity (type, row, col, continuityChess) { //判断连续
  var length = 4;
  var limitLeft = Math.max(0, col - length),
      limitRight = Math.min(14, col + length);
      limitTop = Math.max(0, row - length),
      limitBottom = Math.min(14, row + length);

  // 横向判断
  var continuity = 0;
  for (var j = limitLeft; j <= limitRight; j++) {
    chess[row][j] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }

  //纵向判断
  continuity = 0;
  for (var i = limitTop; i <= limitBottom; i++) {
    chess[i][col] === type ? continuity++ : continuity = 0;
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
    chess[i][j] === type ? continuity++ : continuity = 0;
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
    chess[i][j] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }

  return false;
}