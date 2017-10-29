var content = document.getElementsByClassName('content')[0];
var mainBox = document.getElementById('mainBox');
var cellMask = document.getElementById('cellMask');
var maskScore = document.getElementById('maskScore');
var showView = content.getElementsByClassName('showView')[0];
var nextBox = showView.getElementsByClassName('nextBox')[0];
var levelBox = document.getElementById('level');
var lineBox = document.getElementById('line');
var scoreBox = document.getElementById('score');
var starButton = document.getElementById('start');
var TIME;

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

var data = {
  row: 20,
  col: 10,
  start: false,
  pause: false,
  currentBoxType: 0,
  currentBoxRotate: 0,
  currentBoxBase: [0, 0],
  nextBoxType: false,
  timeInterval: 1000,
  level: 0,
  line: 0,
  score: 0,
  scoreValue: [100, 200, 400, 800],
  clearAnimation: [],
  box: [],
  nextBox: []
}

data.boxType = [
  [
    [
      [0,0,0],
      [0,1,1],
      [1,1,0]
    ],
    [
      [0,1,0],
      [0,1,1],
      [0,0,1]
    ]
  ], //S
  [
    [
      [0,0,0],
      [1,1,0],
      [0,1,1]
    ],
    [
      [0,0,1],
      [0,1,1],
      [0,1,0]
    ]
  ], //Z
  [
    [
      [0,0,1],
      [1,1,1],
      [0,0,0]
    ],
    [
      [0,1,0],
      [0,1,0],
      [0,1,1]
    ],
    [
      [0,0,0],
      [1,1,1],
      [1,0,0]
    ],
    [
      [1,1,0],
      [0,1,0],
      [0,1,0]
    ]
  ], //L
  [
    [
      [1,0,0],
      [1,1,1],
      [0,0,0]
    ],
    [
      [0,1,1],
      [0,1,0],
      [0,1,0]
    ],
    [
      [0,0,0],
      [1,1,1],
      [0,0,1]
    ],
    [
      [0,1,0],
      [0,1,0],
      [1,1,0]
    ]
  ], //J
  [
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0],
    ],
    [
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0],
    ]
  ], //I
  [
    [
      [1,1],
      [1,1]
    ]
  ], //O
  [
    [
      [0,0,0],
      [1,1,1],
      [0,1,0]
    ],
    [
      [0,1,0],
      [1,1,0],
      [0,1,0]
    ],
    [
      [0,1,0],
      [1,1,1],
      [0,0,0]
    ],
    [
      [0,1,0],
      [0,1,1],
      [0,1,0]
    ] //T
  ]
];

data.boxShift = [
  [3, 0, 1, 2], [3, 0, 1, 2], [3, 0, 0, 4], [3, 0, 0, 4], [4, 0, 1, 2], [2, 1, 0, 1], [3, 0, 1, 4]
];//length, shiftX, shiftY, rotateType

addEvent(starButton, 'click', starGame);
addEvent(document, 'keydown', keydownEvent);

function starGame () {
  if (data.start === false) { //游戏未开始
    if (data.pause === false) {
      cellMask.style.display = 'none';
      data.start = true;
      starButton.innerHTML = 'PAUSE';
      initialization();
      createDropBox();
      TIME = setInterval(inGame, data.timeInterval);
    }
  } else { //游戏已开始
    if (data.pause === false) { //未暂停
      data.pause = true;
      clearInterval(TIME);
      starButton.innerHTML = 'GO ON';
    } else { //已暂停
      data.pause = false;
      TIME = setInterval(inGame, data.timeInterval);
      starButton.innerHTML = 'PAUSE';
    }
  }
}

function keydownEvent (e) {
  var keynum = window.event ? e.keyCode : e.which;
  if (data.start === true && data.pause === false) {
    switch (keynum) {
      //左
      case 37: changeDirectionLeft(); e.preventDefault(); break;
      //上
      case 38: changeRotate(); e.preventDefault(); break;
      //右
      case 39: changeDirectionRight(); e.preventDefault(); break;
      //下
      case 40: boxDrop(); e.preventDefault(); break;
    }
    changeSpanColor(mainBox, data.box, data.col);
  }
}

function inGame () {
  boxDrop();
  changeSpanColor(mainBox, data.box, data.col);
}

function createDropBox () {
  if (data.nextBoxType !== false) {
    data.currentBoxType = data.nextBoxType;
  } else {
    data.currentBoxType = parseInt(Math.random() * data.boxType.length * 100) % data.boxType.length;
  }
  data.nextBoxType = parseInt(Math.random() * data.boxType.length * 100) % data.boxType.length;
  var length = data.boxShift[data.currentBoxType][0],
      shiftX = data.boxShift[data.currentBoxType][1],
      shiftY = data.boxShift[data.currentBoxType][2];
  data.currentBoxBase = [0 - shiftY, 3 + shiftX];
  data.currentBoxRotate = 0;
  outer:for (var i = 0 + shiftY, len = length; i < len; i++) {
    for (var j = 3 + shiftX; j < 3 + len + shiftX; j++) {
      if (data.boxType[data.currentBoxType][0][i][j - shiftX - 3] === 1) {   
        if (data.box[i - shiftY][j].type !== false) {
          fail();
          break outer;
        }
        data.box[i - shiftY][j].type = data.currentBoxType + 1;
      }
    }
  }
  var nextShiftX = data.boxShift[data.nextBoxType][1],
      nextShiftY = data.boxShift[data.nextBoxType][2];
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 4; j++) {
      if (data.boxType[data.nextBoxType][0][i + nextShiftY][j - nextShiftX] === 1) {
        data.nextBox[i][j].type = data.nextBoxType + 1;
      } else {
        data.nextBox[i][j].type = false;
      }
    } 
  }
  changeSpanColor(mainBox, data.box, data.col);
  changeSpanColor(nextBox, data.nextBox, 4);
}

function boxDrop () {
  var flag = true;
  var left = boxLimit().left, right = boxLimit().right,
      top = boxLimit().top, bottom = boxLimit().bottom;
  outer:for (var j = left; j <= right; j++) {
    for (var i = top; i <= bottom; i++) {
      if (data.box[i][j].type >= 1 && data.box[i][j].type <= 7) {
        if (i + 1 === 20 || data.box[i + 1][j].type === 0) {
          isBottom = true;
          flag = false;
          break outer;
        }
      }
    }
  }
  if (flag) {
    data.currentBoxBase[0]++;
    for (var j = left; j <= right; j++) {
      for (var i = bottom; i >= top; i--) {
        if (data.box[i][j].type >= 1 && data.box[i][j].type <= 7) {
          data.box[i + 1][j].type = data.box[i][j].type;
          data.box[i][j].type = false; 
        }
      }
    }
  } else {
    for (var j = left; j <= right; j++) {
      for (var i = bottom; i >= top; i--) {
        if (data.box[i][j].type >= 1 && data.box[i][j].type <= 7) {
          data.box[i][j].type = 0;
        }
      }
    }
    judgeLineFull();
  }
}

function changeDirectionLeft () {
  var flag = true;
  var left = boxLimit().left, right = boxLimit().right,
      top = boxLimit().top, bottom = boxLimit().bottom;
  outer:for (var i = top; i <= bottom; i++) {
    for (var j = left; j <= right; j++) {
      if (data.box[i][j].type >= 1 && data.box[i][j].type <= 7) {
        if (j <= 0 || data.box[i][j - 1].type === 0) {
          flag = false;
          break outer;
        } else {
          break;
        }
      }
    }
  }
  if (flag) {
    data.currentBoxBase[1]--;
    for (var i = top; i <= bottom; i++) {
      for (var j = left; j <= right; j++) {
        if (data.box[i][j].type >= 1 && data.box[i][j].type <= 7) {
          data.box[i][j - 1].type = data.box[i][j].type;
          data.box[i][j].type = false;
        }
      }
    }
  }
}

function changeDirectionRight () {
  var flag = true;
  var left = boxLimit().left, right = boxLimit().right,
      top = boxLimit().top, bottom = boxLimit().bottom;
  outer:for (var i = top; i <= bottom; i++) {
    for (var j = right; j >= left; j--) {
      if (data.box[i][j].type >= 1 && data.box[i][j].type <= 7) {
        if (j >= data.col - 1 || data.box[i][j + 1].type === 0) {
          flag = false;
          break outer;
        } else {
          break;
        }
      }
    }
  }
  if (flag) {
    data.currentBoxBase[1]++;
    for (var i = top; i <= bottom; i++) {
      for (var j = right; j >= left; j--) {
        if (data.box[i][j].type >= 1 && data.box[i][j].type <= 7) {
          data.box[i][j + 1].type = data.box[i][j].type;
          data.box[i][j].type = false;
        }
      }
    }
  }
}

function changeRotate () {
  var flag = true;
  var left = boxLimit().left, right = boxLimit().right,
      top = boxLimit().top, bottom = boxLimit().bottom;
  var baseLimit = data.boxShift[data.currentBoxType][0];
  var tempBoxRotate = (data.currentBoxRotate + 1) % data.boxShift[data.currentBoxType][3];
  outer:for (var i = 0; i < baseLimit; i++) {
    for (var j = 0; j < baseLimit; j++) {
      if (data.boxType[data.currentBoxType][tempBoxRotate][i][j] === 1) {
        try {
          if (data.box[data.currentBoxBase[0] + i][data.currentBoxBase[1] + j].type === 0) {
            flag = false;
            break outer;
          }
        } catch(e) {
          flag = false;
          //Out of range
        }
      } 
    }
  }
  if (flag) {
    data.currentBoxRotate = tempBoxRotate;
    for (var i = 0; i < baseLimit; i++) {
      for (var j = 0; j < baseLimit; j++) {
        if (data.box[data.currentBoxBase[0] + i][data.currentBoxBase[1] + j].type >= 1 && data.box[data.currentBoxBase[0] + i][data.currentBoxBase[1] + j].type <= 7) {
          data.box[data.currentBoxBase[0] + i][data.currentBoxBase[1] + j].type = false;
        }
      }
    }
    for (var i = 0; i < baseLimit; i++) {
      for (var j = 0; j < baseLimit; j++) {
        if (data.boxType[data.currentBoxType][tempBoxRotate][i][j] === 1) {
          data.box[data.currentBoxBase[0] + i][data.currentBoxBase[1] + j].type = data.currentBoxType + 1;
        }
      }
    }
  }
}

function boxLimit () {
  var limitX = [], limitY = [], flag = true, starBox = false;
  outer:for (var i = 0; i < data.row; i++) {
    if (starBox === true) {
      flag = false;
    }
    for (var j = 0; j < data.col; j++) {
      if (data.box[i][j].type >= 1 && data.box[i][j].type <= 7) {
        if (starBox === false) {
          starBox = true;
        }
        flag = true;
        limitY.push(i);
        limitX.push(j);
      }
    }
    if (!flag) {
      break outer;
    }
  }
  limitX.sort(function (a, b) {
    return a - b;
  });
  limitY.sort(function (a, b) {
    return a - b;
  });
  var top = limitY[0];
  var bottom = limitY[limitY.length - 1];
  var left = limitX[0];
  var right = limitX[limitX.length - 1];
  var length = Math.max((bottom - top), (right - left)) + 1;
  return {top, bottom, left, right, length};
}

function changeSpanColor (ele, transferData, col) {
  for (var i = 0, len = ele.getElementsByTagName('span').length; i < len ; i++) {
    var currentBox = transferData[parseInt(i / col)][parseInt(i % col)];
    if (currentBox.type === 0) {
      currentBox.ele.className = '';
      currentBox.ele.addClass('typed');
      currentBox.ele.addClass('level' + data.level);
    } else if (currentBox.type >= 1 && currentBox.type <= 7) {
      currentBox.ele.className = '';
      currentBox.ele.addClass('typed');
      currentBox.ele.addClass('type' + currentBox.type);
    } else {
      currentBox.ele.className = '';
    }
  }
}

function judgeLineFull () {
  var flag, line = [];
  outer:for (var i = data.row - 1; i >= 0; i--) {
    flag = true;
    for (var j = 0; j < data.col; j++) {
      if (data.box[i][j].type !== 0) {
        flag = false;  
        break;
      }
    }
    if (flag) {
      line.push(i);
    }
  }
  var clearTimes = line.length;
  flag = false;
  if (clearTimes >= 1) {
    data.score += data.scoreValue[clearTimes - 1];
    data.line += clearTimes;
    clearInterval(TIME);
    for (var i = 0; i < line.length; i++) {
      _animation(line[i]);
    }
  } else {
    createDropBox();
  }

  function _animation (line) {
    var opacity = 1, alphaOpacity = 0;
    opacityAnimation();
    function opacityAnimation () {
      opacity -= 0.05;
      alphaOpacity += 5;
      for (var i = 0; i < data.col; i++) {
        data.box[line][i].ele.style.opacity = opacity;
      }
      if (alphaOpacity <= 100) {
        setTimeout(opacityAnimation, data.timeInterval / 60);
      } else {
        for (var i = 0; i < data.col; i++) {
          data.box[line][i].ele.style.opacity = 1;
        }
        if (!flag) {
          _refreshAllBox();
          _upLevel();
          levelBox.getElementsByTagName('span')[0].innerHTML = PrefixInteger(data.level, 2);
          lineBox.getElementsByTagName('span')[0].innerHTML = PrefixInteger(data.line, 2);
          scoreBox.getElementsByTagName('span')[0].innerHTML = PrefixInteger(data.score, 5);
        }
      }
    }
  }

  function _refreshAllBox () {
    flag = true;
    for (var times = 0; times < clearTimes; times++) {
      for (var j = 0; j < data.col; j++) {
        for (var i = line[0] + times, clearLine = line[0]; i >= 1; i--) {
          data.box[i][j].type = data.box[i - 1][j].type;
        } 
      }  
      line.shift();
    }
    createDropBox();
    changeSpanColor(mainBox, data.box, data.col);
    TIME = setInterval(inGame, data.timeInterval);
  }

  function _upLevel () {
    data.level = Math.min(parseInt(data.line / 30) + 1, 7);
    switch (data.level) {
      case 1: data.timeInterval = 1000; break;
      case 2: data.timeInterval = 850; break;
      case 3: data.timeInterval = 700; break;
      case 4: data.timeInterval = 550; break;
      case 5: data.timeInterval = 400; break;
      case 6: data.timeInterval = 200; break;
      case 7: data.timeInterval = 100; break;
    }
  }
}

function fail () {
  clearInterval(TIME);
  maskScore.innerHTML = data.score;
  data.start = false;
  data.pause = false;
  cellMask.style.display = 'block';
  starButton.innerHTML = 'RESTART';
}

function initialization () {
  createFrame();
  data.start = true;
  data.timeInterval = 1000;
  data.level = 1;
  data.line = 0;
  data.score = 0;
  data.box = [];
  data.nextBox = [];
  data.box = new Array(data.row);
  data.nextBox = new Array(2);
  data.clearAnimation = new Array(4);
  for (var i = 0, currentDivs = mainBox.getElementsByTagName('div'), ilen = currentDivs.length; i < ilen; i++) {
    data.box[i]  = new Array(data.col);
    var currentDiv = currentDivs[i];
    for (var j = 0, currentSpans = currentDiv.getElementsByTagName('span'), jlen = currentSpans.length; j < jlen; j++) {
      data.box[i][j] = {};
      data.box[i][j].ele = currentSpans[j];
      data.box[i][j].type = false;
      // 格子类型 false:空 0:buttom 1:S 2:Z 3:L 4:J 5:I 6:O 7:T
    }
  }
  for (var i = 0, currentDivs = nextBox.getElementsByTagName('div'), ilen = currentDivs.length; i < ilen; i++) {
    data.nextBox[i]  = new Array(2);
    var currentDiv = currentDivs[i];
    for (var j = 0, currentSpans = currentDiv.getElementsByTagName('span'), jlen = currentSpans.length; j < jlen; j++) {
      data.nextBox[i][j] = {};
      data.nextBox[i][j].ele = currentSpans[j];
      data.nextBox[i][j].type = false;
    }
  }
  levelBox.getElementsByTagName('span')[0].innerHTML = PrefixInteger(data.level, 2);
  lineBox.getElementsByTagName('span')[0].innerHTML = PrefixInteger(data.line, 2);
  scoreBox.getElementsByTagName('span')[0].innerHTML = PrefixInteger(data.score, 5);
}

function createFrame () {
  createFrameContext(mainBox, data.row, data.col);
  createFrameContext(nextBox, 2, 4);
}

function createFrameContext (ele, rowValue, colValue) {
  ele.innerHTML = '';
  var row = new Array(rowValue);
  for (var i = 0; i < rowValue; i++) {
    data.box[i] = new Array(data.colValue);
    row[i] = document.createElement('div');
    row[i].setAttribute('row', i);
    for (var j = 0; j < colValue; j++) {
      var col = new Array(colValue);
      col[j] = document.createElement('span');
      col[j].setAttribute('col', j);
      row[i].appendChild(col[j]);
    }
    ele.appendChild(row[i]);
  }
}

function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}

