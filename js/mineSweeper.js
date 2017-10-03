var content = document.getElementsByClassName('content')[0];
var showView = content.getElementsByClassName('showView')[0];
var timeDiv = showView.getElementsByClassName('time')[0];
var smile = showView.getElementsByClassName('smile')[0];
var surplus = showView.getElementsByClassName('surplus')[0];
var mainViewBox = content.getElementsByClassName('box')[0];
var TIME;

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

data = {
  row: 9,
  col: 9,
  mine: 10,
  surplus: 81,
  surplusFlag: 10,
  box: [],
  time: 0,
  start: false
}

addEvent(smile, 'click', smileClick);

function smileClick (e) {
  data.start = false;
  clearInterval(TIME);
  timeDiv.innerHTML = '000';
  data.surplusFlag = data.mine;
  surplus.innerHTML = PrefixInteger(data.surplusFlag, 3);
  addEvent(mainViewBox, 'click', mainViewBoxClick);
  createFrame();
}

mainViewBox.oncontextmenu = function (e) {
  return false;
}

addEvent(mainViewBox, 'click', mainViewBoxClick);
addEvent(mainViewBox, 'mousedown', mouseMiddleClick);
addEvent(mainViewBox, 'contextmenu', setFlag);

function mainViewBoxClick (e) {
  if (data.start === false) {
    data.start = true;
    createMine(e.target);
    TIME = setInterval(function () {
      timer();
    }, 1000);
  }
  mouseclick(e.target);
}

function mouseclick (ele) {
  if (ele.nodeName.toUpperCase() === 'SPAN') {
    var currentRow = parseInt(ele.parentNode.getAttribute('row'));
    var currentCol = parseInt(ele.getAttribute('col'));
    if (data.box[currentRow][currentCol].state === false && data.box[currentRow][currentCol].flag === false) {
      ele.addClass('state');
      data.box[currentRow][currentCol].state = true;
      data.surplus--;
      if (data.surplus == data.mine) {
        success();
      }
      if (data.box[currentRow][currentCol].mine === true) {
        ele.addClass('mineTrue');
        fail();
      } else {
        calculationAround(ele);
      }
    }
  }
}

function mouseMiddleClick (e) {
  var ele= e.target;
  if (ele.nodeName.toUpperCase() === 'SPAN') {
    if (e.button === 1) {
      var currentRow = parseInt(ele.parentNode.getAttribute('row'));
      var currentCol = parseInt(ele.getAttribute('col'));
      if (data.box[currentRow][currentCol].state === true) {
        var rowStart = Math.max(0, currentRow - 1);
        var rowEnd = Math.min(data.row - 1, currentRow + 1);
        var colStart = Math.max(0, currentCol - 1);
        var colEnd = Math.min(data.col - 1, currentCol + 1);
        var flag = 0;
        for (var i = rowStart; i <= rowEnd; i++) {
          for (var j = colStart; j <= colEnd; j++) {
            if (ele === data.box[i][j].ele) {
              continue;
            }
            if (data.box[i][j].flag === true) {
              flag++;
            }
          }
        }
        if (flag === data.box[currentRow][currentCol].mine) {
          openAround(ele, rowStart, rowEnd, colStart, colEnd);
        }
      }
    }
  }
}

function setFlag (e) {
  var ele = e.target;
  if (ele.nodeName.toUpperCase() === 'SPAN') {
    var currentRow = parseInt(ele.parentNode.getAttribute('row'));
    var currentCol = parseInt(ele.getAttribute('col'));
    if (data.box[currentRow][currentCol].state === false) {
      switch (data.box[currentRow][currentCol].flag) {
        case false:
          data.box[currentRow][currentCol].flag = true;
          data.surplusFlag--;
          addChildIcon(ele, 'flag');
          break;
        case true:
          data.box[currentRow][currentCol].flag = false;
          data.surplusFlag++;
          removeChildIcon (ele);
          break;
      }
      surplus.innerHTML = data.surplusFlag >= 0 ? PrefixInteger(data.surplusFlag, 3) : data.surplusFlag;
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
  } else {
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
  initialization();
}

function initialization () {
  data.box = null;
  data.box = new Array(data.row);
  for (var i = 0, len = data.row; i < len; i++) {
    data.box[i] = new Array(data.col);
    for (var j = 0; j < data.col; j++) {
      data.box[i][j] = {};
      data.box[i][j].mine = false;
      data.box[i][j].state = false;
      data.box[i][j].flag = false;
    }
  }
  var spanElements = mainViewBox.getElementsByTagName('span');
  var spanArray = new Array();
  for (var i = 0, len = spanElements.length; i < len; i++) {
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].state = false; //是否已点开
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].flag = false; //插旗
    data.box[parseInt(i / data.col)][parseInt(i % data.col)].ele = spanElements[i]; //对应HTML元素
  }
}

function createMine (ele) {
  var currentRow = parseInt(ele.parentNode.getAttribute('row'));
  var currentCol = parseInt(ele.getAttribute('col'));
  for (var i = data.mine; i > 0; i--) {
    var index = parseInt(Math.random() * data.row * data.col);
    var row = parseInt(index / data.col);
    var col = parseInt(index % data.col);
    if (data.box[row][col].mine === true) {
      i++;
      continue;
    }
    if (row === currentRow && col === currentCol) {
      i++;
      continue;
    }
    data.box[row][col].mine = true;
  }
  data.surplusFlag = data.mine;
}

function timer () {
  data.time++;
  timeDiv.innerHTML = PrefixInteger(data.time, 3);
}

function success () {
  clearInterval(TIME);
  console.log('win');
  for (var i = 0; i < data.row; i++) {
    for (var j = 0; j < data.col; j++) {
      if (data.box[i][j].mine === true &&
        data.box[i][j].ele.getElementsByTagName('*').length === 0) {
        data.box[i][j].flag = true;
        addChildIcon(data.box[i][j].ele, 'flag');
      }
    }
  }
  data.surplusFlag = 0;
  surplus.innerHTML = data.surplusFlag >= 0 ? PrefixInteger(data.surplusFlag, 3) : data.surplusFlag;
}

function fail () {
  clearInterval(TIME);
  for (var i = 0; i < data.row; i++) {
    for (var j = 0; j < data.col; j++) {
      if (data.box[i][j].mine === true && data.box[i][j].flag === false) {
        addChildIcon(data.box[i][j].ele, 'bomb');
      }
      if (data.box[i][j].flag === true && data.box[i][j].mine === false) {
        addChildIcon(data.box[i][j].ele, 'times');
      }
    }
  }
  removeEvent(mainViewBox, 'click', mainViewBoxClick);
}

function addChildIcon (parentNode, iconClass) {
  var element = document.createElement('i');
  element.setAttribute('class', 'fa fa-' + iconClass);
  parentNode.appendChild(element);
}

function removeChildIcon (parentNode) {
  var element = parentNode.getElementsByClassName('fa')[0];
  parentNode.removeChild(element);
}

function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}
