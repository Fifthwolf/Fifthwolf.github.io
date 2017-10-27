var content = document.getElementsByClassName('content')[0];
var mainBox = document.getElementById('mainBox');
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
  currentBoxType: 0,
  currentBoxState: 0,
  currentBoxRotate: 0,
  currentBoxBase: [0, 0],
  nextBoxType: false,
  dropBox: false,
  level: 0,
  timeInterval: 1000,
  score: 0,
  box: [],
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

function starGame () {
  addEvent(document, 'keydown', keydownEvent);
  initialization();
  inGame();
  TIME = setInterval(inGame, data.timeInterval);

  function keydownEvent (e) {
    var keynum = window.event ? e.keyCode : e.which;
    e.preventDefault();
    switch (keynum) {
      //左
      case 37: changeDirectionLeft(); break;
      //上
      case 38: changeRotate(); break;
      //右
      case 39: changeDirectionRight(); break;
      //下
      case 40: boxDrop(); break;
    }
    changeSpanColor();
  }
}

function inGame () {
  if (data.dropBox === false) {
    createDropBox();
  } else {
    boxDrop();
  }
  changeSpanColor();
}

function createDropBox () {
  data.dropBox = true;
  if (data.nextBoxType !== false) {
    data.currentBoxType = data.nextBoxType;
  } else {
    data.currentBoxType = parseInt(Math.random() * data.boxType.length * 100) % data.boxType.length;
  }
  data.nextBoxType = parseInt(Math.random() * data.boxType.length * 100) % data.boxType.length;
  data.currentBoxState = data.boxShift[data.currentBoxType][0];
  var length = data.boxShift[data.currentBoxType][0],
      shiftX = data.boxShift[data.currentBoxType][1],
      shiftY = data.boxShift[data.currentBoxType][2];
  data.currentBoxBase = [0 - shiftY, 3 + shiftX];
  console.log(data.currentBoxBase);
  outer:for (var i = 0 + shiftY, len = length; i < len; i++) {
    for (var j = 3 + shiftX; j < 3 + len + shiftX; j++) {
      if (data.boxType[data.currentBoxType][0][i][j - shiftX - 3] === 1) {   
        if (data.box[i - shiftY][j].type !== false) {
          console.log('fail');
          break outer;
        }
        data.box[i - shiftY][j].type = data.currentBoxType + 1;
      }
    }
  }
}

function boxDrop () {
  console.log(data.currentBoxBase);
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
    createDropBox();
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
  console.log(flag);
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

function changeSpanColor () {
  for (var i = 0, len = mainBox.getElementsByTagName('span').length; i < len ; i++) {
    var currentBox = data.box[parseInt(i / data.col)][parseInt(i % data.col)];
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

function initialization () {
  createFrame();
  data.start = true;
  data.level = 1;
  data.timeInterval = 1000;
  data.score = 0;
  data.box = [];
  data.box = new Array(data.row);
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

function tempShow () {
  var a = [];
  for (var i = 0; i < data.row; i++) {
    for (var j = 0; j < data.col; j++) {
      a.push(data.box[i][j].type);
    }
    console.log(a);
    a = [];
  }
  console.log('_________________');
}
