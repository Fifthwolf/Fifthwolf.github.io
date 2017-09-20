var content = document.getElementsByClassName('content')[0];
var mainViewBox = content.getElementsByClassName('box')[0];

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
  starGame();
}

data = {
  row:8,
  col:14,
  type:10,
  box:[]
}

//创建DIV、SPAN 框架元素
function createFrame () {
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
}

function starGame () {
  var spanElements = mainViewBox.getElementsByTagName('span');
  var spanArray = new Array();
  for (var i = 0, len = spanElements.length; i < len; i++) {
    spanArray[i] = spanElements[i];
  }
  while (spanArray.length > 0) {
    var type = parseInt(Math.random() * data.type + 1);
    for (var i = 0; i < 2; i++) {
      var index = parseInt(Math.random() * spanArray.length);
      spanArray[index].setAttribute('boxType',type);
      spanArray[index].addClass('type' + type);
      spanArray[index].innerHTML = type;
      spanArray.splice(index,1);
    }   
  }
}