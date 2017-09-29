var content = document.getElementsByClassName('content')[0];
var mainViewBox = content.getElementsByClassName('box')[0];

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
  initialization();
}

data = {
  row: 9,
  col: 9,
  mine: 10,
  surplus: 10,
  box: [],
  time: 0,
}

addEvent(mainViewBox, 'click', function(e) {
  mouseclick(e.target);
});

function mouseclick (ele) {
  if (ele.nodeName.toUpperCase() === 'SPAN') {
    if (ele.getAttribute('state') == 'false') {
      ele.addClass('state');
      if (ele.getAttribute('mine') === 'true') {
        ele.addClass('mineTrue');
        over();
      } else {
        calculationAround(ele);
      }
    }
  }
}

function calculationAround (ele) {
  var currentRow = parseInt(ele.parentNode.getAttribute('row'));
  var currentCol = parseInt(ele.getAttribute('col'));
  var rowStart = Math.max(0, currentRow - 1);
  var rowEnd = Math.min(data.row - 1, currentRow + 1);
  var colStart = Math.max(0, currentCol - 1);
  var colEnd = Math.min(data.col - 1, currentCol + 1);
  var mineNum = 0;
  for (var i = rowStart; i <= rowEnd; i++) {
    for (var j = colStart; j <= colEnd; j++) {
      if (i == ele.parentNode.getAttribute('row') && j == ele.getAttribute('col')) {
        continue;
      }
      if (data.box[i][j].mine === 'true') {
        mineNum++;
      }
    }
  }
  if (mineNum > 0) {
    data.box[currentRow][currentCol].mine = mineNum;
    ele.innerHTML = mineNum;
    ele.addClass('mine' + mineNum);
  } else if (mineNum === 0) {
    openAround(ele, rowStart, rowEnd, colStart, colEnd);
  }
}

function openAround (ele, rowStart, rowEnd, colStart, colEnd) {
  for (var i = rowStart; i <= rowEnd; i++) {
    for (var j = colStart; j <= colEnd; j++) {
      if (i == ele.parentNode.getAttribute('row') && j == ele.getAttribute('col')) {
        continue;
      }
      console.log(data.box[i][j].ele);
      if (data.box[i][j].state == 'false') {
        data.box[i][j].state = true;
        mouseclick(data.box[i][j].ele);     
      }
    }
  }
}

//创建DIV、SPAN 框架元素
function createFrame () {
  for (var i = 0; i < data.row; i++) {
    var row = new Array(data.row);
    row[i] = document.createElement('div');
    row[i].setAttribute('row',i);
    for (var j = 0; j < data.col; j++) {
      var col = new Array(data.col);
      col[j] = document.createElement('span');
      col[j].setAttribute('mine', 0); //周边地雷个数，true为自身地雷
      col[j].setAttribute('state', false); //是否已开
      col[j].setAttribute('flag', false); //插旗
      col[j].setAttribute('col', j);
      row[i].appendChild(col[j]);
    }
    mainViewBox.appendChild(row[i]);
  }
}

function initialization () {
  data.box = null;
  data.box = new Array(data.row);
  for (var i = 0, len = data.row; i < len; i++) {
    data.box[i] = new Array(data.col);
    for (var j = 0; j < data.col; j++) {
      data.box[i][j] = {};
      data.box[i][j].mine = 0;
      data.box[i][j].state = false;
      data.box[i][j].flag = false;
    }
  }
  var spanElements = mainViewBox.getElementsByTagName('span');
  var spanArray = new Array();
  for (var i = 0, len = spanElements.length; i < len; i++) {
    spanArray[i] = spanElements[i];
  }

  //生成地雷
  for (var i = data.mine; i > 0; i--) {
    var index = parseInt(Math.random() * spanArray.length);
    spanArray[index].removeAttribute('class');
    spanArray[index].setAttribute('mine',true);
    spanArray.splice(index,1); 
  }

  //将SPAN元素模型化为data.box
  for (var i = 0, len = spanElements.length; i < len; i++) {
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].mine = spanElements[i].getAttribute('mine');
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].state = spanElements[i].getAttribute('state');
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].flag = spanElements[i].getAttribute('flag');
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].ele = spanElements[i];
  }
}

function over () {
  //游戏结束
}