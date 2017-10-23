var content = document.getElementsByClassName('content')[0];
var mainViewBox = content.getElementsByClassName('box')[0];
var showView = content.getElementsByClassName('showView')[0];
var nextBox = showView.getElementsByClassName('nextBox')[0];
var levelBox = document.getElementById('level');
var scoreBox = document.getElementById('score');
var starButton = document.getElementById('start');

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

data = {
  row: 20,
  col: 10,
  level: 0,
  timeInterval: 1000,
  score: 0
}

addEvent(starButton, 'click', starGame);

function createFrame () {
  createFrameContext(mainViewBox, data.row, data.col);
  createFrameContext(nextBox, 2, 4);
}

function starGame () {
  initialization();
}

function initialization () {
  data.level = 1;
  data.timeInterval = 1000;
  data.score = 0;
}

function createFrameContext (ele, rowValue, colValue) {
  ele.innerHTML = '';
  for (var i = 0; i < rowValue; i++) {
    var row = new Array(rowValue);
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
