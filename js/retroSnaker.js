var content = document.getElementsByClassName('content')[0];
var mainViewBox = content.getElementsByClassName('box')[0];

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

var data = {
  row: 20,
  col: 30,
  start: false,
  box: [],
  direction: 1 //1上2右3下4左
  snake: []
}

function createFrame () {
  mainViewBox.innerHTML = '';
  for (var i = 0; i < data.row; i++) {
    var row = new Array(data.row);
    row[i] = document.createElement('div');
    row[i].setAttribute('row',i);
    for (var j = 0; j < data.col; j++) {
      var col = new Array(data.col);
      col[j] = document.createElement('span');
      col[j].setAttribute('col', j);
      row[i].appendChild(col[j]);
    }
    mainViewBox.appendChild(row[i]);
  }
}