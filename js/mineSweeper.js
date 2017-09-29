var content = document.getElementsByClassName('content')[0];
var mainViewBox = content.getElementsByClassName('box')[0];

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

data = {
  row: 9,
  col: 9,
  surplus: 10,
  box: [],
  time: 0,
}

//创建DIV、SPAN 框架元素
function createFrame () {
  for (var i = 0; i < data.row; i++) {
    var row = new Array(data.row);
    row[i] = document.createElement('div');
    row[i].setAttribute('row',i + 1);
    for (var j = 0; j < data.col; j++) {
      var col = new Array(data.col);
      col[j] = document.createElement('span');
      col[j].setAttribute('mine', 0); //周边地雷个数，true为自身地雷
      col[j].setAttribute('state', false); //是否已开
      col[j].setAttribute('flag', false); //插旗
      col[j].setAttribute('col', j + 1);
      //col[j].setAttribute('class', 'state mine' + j);
      row[i].appendChild(col[j]);
    }
    mainViewBox.appendChild(row[i]);
  }
}