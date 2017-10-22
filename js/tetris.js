var content = document.getElementsByClassName('content')[0];
var mainViewBox = content.getElementsByClassName('box')[0];

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

data = {
  row: 20,
  col: 10
}

function createFrame () {
  mainViewBox.innerHTML = '';
  data.surplus = data.row * data.col;
  for (var i = 0; i < data.row; i++) {
    var row = new Array(data.row);
    row[i] = document.createElement('div');
    row[i].setAttribute('row', i);
    for (var j = 0; j < data.col; j++) {
      var col = new Array(data.col);
      col[j] = document.createElement('span');
      col[j].setAttribute('col', j);
      row[i].appendChild(col[j]);
    }
    mainViewBox.appendChild(row[i]);
  }
}