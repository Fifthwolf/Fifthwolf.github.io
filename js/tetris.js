var content = document.getElementsByClassName('content')[0];
var mainBox = document.getElementById('mainBox');
var showView = content.getElementsByClassName('showView')[0];
var nextBox = showView.getElementsByClassName('nextBox')[0];
var levelBox = document.getElementById('level');
var scoreBox = document.getElementById('score');
var starButton = document.getElementById('start');
var TIME;

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

data = {
  row: 20,
  col: 10,
  start: false,
  currentBoxType: 0,
  nextBoxType: false,
  dropBox: false,
  level: 0,
  timeInterval: 1000,
  score: 0,
  box: [],
  boxType: [
  [[0,1,1,0],
  [1,1,0,0]], //S
  [[1,1,0,0],
  [0,1,1,0]], //Z
  [[0,0,1,0],
  [1,1,1,0]], //L
  [[1,0,0,0],
  [1,1,1,0]], //J
  [[1,1,1,1],
  [0,0,0,0]], //I
  [[0,1,1,0],
  [0,1,1,0]], //O
  [[0,1,0,0],
  [1,1,1,0]], //T
  ]
}

addEvent(starButton, 'click', starGame);

function createFrame () {
  createFrameContext(mainBox, data.row, data.col);
  createFrameContext(nextBox, 2, 4);
}

function starGame () {
  initialization();
  inGame();
  TIME = setInterval(inGame, data.timeInterval);
}

function inGame () {
  if (data.dropBox === false) {
    createDropBox();
  }
  changeSpanColor();
}

function createDropBox () {
  data.dropBox = true;
  if (data.nextBoxType != false) {
    data.currentBoxType = data.nextBoxType;
  } else {
    data.currentBoxType = parseInt(Math.random() * 7 * 100) % 7;
  }
  data.nextBoxType = parseInt(Math.random() * 7 * 100) % 7;
  for (var i = 0; i < 2; i++) {
    for (var j = 3; j < 7; j++) {
      data.box[i][j].type = data.boxType[data.currentBoxType][i][j - 3];
    }
  }
}

function changeSpanColor () {
  for (var i = 0, len = mainBox.getElementsByTagName('span'); i < len ; i++) {
    var currentBox = data.box[i / data.row][i];
    if (currentBox.type !== false) {
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
      // 格子类型 false:空 1:S 2:Z 3:L 4:J 5:I 6:O 7:T
    }
  }
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