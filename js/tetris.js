var content = document.getElementsByClassName('content')[0];
var mainViewBox = content.getElementsByClassName('box')[0];
var showView = content.getElementsByClassName('showView')[0];
var nextBox = showView.getElementsByClassName('nextBox')[0];
var levelBox = document.getElementById('level');
var scoreBox = document.getElementById('score');
var pauseBox = showView.getElementsByClassName('pause')[0];

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

data = {
  row: 20,
  col: 10,
  level: 0,
  score: 0
}

function createFrame () {
  createFrameContext(mainViewBox, data.row, data.col);
  createFrameContext(nextBox, 2, 4);
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