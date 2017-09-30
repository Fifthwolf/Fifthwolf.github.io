var content = document.getElementsByClassName('content')[0];
var showView = content.getElementsByClassName('showView')[0];
var time = showView.getElementsByClassName('time')[0];
var smile = showView.getElementsByClassName('smile')[0];
var surplus = showView.getElementsByClassName('surplus')[0];
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
  surplus: 0,
  box: [],
  time: 0,
}

addEvent(smile, 'click', function(e) {
  createFrame();
  initialization();
});

addEvent(mainViewBox, 'click', function(e) {
  mouseclick(e.target);
});

mainViewBox.oncontextmenu = function(e){
  return false;
}

addEvent(mainViewBox, 'contextmenu', function(e) {
  setFlag(e.target);
});

addEvent(mainViewBox, 'mousedown', function(e) {
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    if (e.button === 1) {
      var currentRow = parseInt(e.target.parentNode.getAttribute('row'));
      var currentCol = parseInt(e.target.getAttribute('col'));
      if (data.box[currentRow][currentCol].state === true) {
        var rowStart = Math.max(0, currentRow - 1);
        var rowEnd = Math.min(data.row - 1, currentRow + 1);
        var colStart = Math.max(0, currentCol - 1);
        var colEnd = Math.min(data.col - 1, currentCol + 1);
        var flag = 0;
        for (var i = rowStart; i <= rowEnd; i++) {
          for (var j = colStart; j <= colEnd; j++) {
            if (e.target === data.box[i][j].ele) {
              continue;
            }
            if (data.box[i][j].flag === true) {
              flag++;
            }
          }
        }
        if (flag === data.box[currentRow][currentCol].mine) {
          openAround(e.target, rowStart, rowEnd, colStart, colEnd);
        }
      }
    }
  }
});

function mouseclick (ele) {
  if (ele.nodeName.toUpperCase() === 'SPAN') {
    var currentRow = parseInt(ele.parentNode.getAttribute('row'));
    var currentCol = parseInt(ele.getAttribute('col'));
    if (data.box[currentRow][currentCol].state === false) {
      ele.addClass('state');
      data.box[currentRow][currentCol].state = true;
      data.surplus--;
      if (data.surplus == data.mine) {
        console.log('win');
      }
      if (data.box[currentRow][currentCol].mine === true) {
        ele.addClass('mineTrue');
        over();
      } else {
        calculationAround(ele);
      }
    }
  }
}

function setFlag (ele) {
  if (ele.nodeName.toUpperCase() === 'SPAN') {
    var currentRow = parseInt(ele.parentNode.getAttribute('row'));
    var currentCol = parseInt(ele.getAttribute('col'));
    if (data.box[currentRow][currentCol].state === false) {
      if (data.box[currentRow][currentCol].flag === false) {
        data.box[currentRow][currentCol].flag = true;
        ele.addClass('flag');
      } else {
        data.box[currentRow][currentCol].flag = false;
        ele.removeClass('flag');
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
      if (ele == data.box[i][j].ele) {
        continue;
      }
      if (data.box[i][j].mine === true) {
        mineNum++;
      }
    }
  }
  if (mineNum > 0) {
    data.box[currentRow][currentCol].mine = mineNum;
    ele.addClass('mine' + mineNum);
    ele.innerHTML = mineNum;
  } else if (mineNum === 0) {
    openAround(ele, rowStart, rowEnd, colStart, colEnd);
  }
}

function openAround (ele, rowStart, rowEnd, colStart, colEnd) {
  for (var i = rowStart; i <= rowEnd; i++) {
    for (var j = colStart; j <= colEnd; j++) {
      if (ele == data.box[i][j].ele) {
        continue;
      }
      if (data.box[i][j].flag === true) {
        continue;
      }
      if (data.box[i][j].state === false) {
        mouseclick(data.box[i][j].ele);     
      }
    }
  }
}

//创建DIV、SPAN 框架元素
function createFrame () {
  mainViewBox.innerHTML = '';
  data.surplus = data.row * data.col;
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
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].state = false; //是否打开
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].flag = false; //插旗
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].ele = spanElements[i]; //对应HTML元素
  }
  
  //生成地雷
  for (var i = data.mine; i > 0; i--) {
    var index = parseInt(Math.random() * spanElements.length);
    var currentRow = parseInt(index / data.col);
    var currentCol = parseInt(index % data.col);
    if (data.box[currentRow][currentCol].mine === true) {
      i++;
      continue;
    }
    data.box[currentRow][currentCol].mine = true;
  }
}

function over () {
  //游戏结束
}