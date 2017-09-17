var content = document.getElementsByClassName('content')[0];
var mainView = content.getElementsByClassName('mainView')[0];

window.onload = function () {
  delayedLoadingPublicPictures ('../');
}

data = {
  row:8,
  col:14,
  box:[]
}

for (var i = 0; i < data.row; i++) {
  var row = new Array(data.row);
  row[i] = document.createElement('div');
  for (var j = 0; j < data.col; j++) {
    var col = new Array(data.col);
    col[j] = document.createElement('span');
    row[i].appendChild(col[j]);
  }
  mainView.appendChild(row[i]);
}