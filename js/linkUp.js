var content = document.getElementsByClassName('content')[0];
var mainViewBox = content.getElementsByClassName('box')[0];

window.onload = function () {
  delayedLoadingPublicPictures ('../');
}

data = {
  row:8,
  col:14,
  box:[]
}

//创建DIV、SPAN显示元素
for (var i = 0; i < data.row; i++) {
  var row = new Array(data.row);
  row[i] = document.createElement('div');
  for (var j = 0; j < data.col; j++) {
    var col = new Array(data.col);
    col[j] = document.createElement('span');
    col[j].setAttribute('boxType', '0');
    row[i].appendChild(col[j]);
  }
  mainViewBox.appendChild(row[i]);
}