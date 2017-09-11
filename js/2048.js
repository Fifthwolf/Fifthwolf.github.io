var content = document.getElementsByClassName('content')[0];
var cell = content.getElementsByClassName('cell')[0];
var changeButton = document.getElementById('change');

var length = 4;

var data = {
  value:[]
}

window.onload = function () {
  data.value[0] = '&nbsp;';
  for (var i = 1; i < 16; i++) {
    data.value[i] = Math.pow(2, i);
  }
  createCell(length);
  starGame(length);
}

addEvent (changeButton, 'click', function () {
  var changeLength = Number(document.getElementById('length').value);
  if(changeLength >= 4 && changeLength <= 8 && _isInteger(changeLength)){
    createCell(changeLength);
    length = changeLength;
  }
  function _isInteger (obj) {
    return typeof obj === 'number' && obj % 1 === 0;
  }
});

function createCell (length) {
  cell.innerHTML = '';
  var row = new Array(length);
  for (var i = 0; i < length; i++) {
    row[i] = document.createElement('div');
    for (var j = 0; j < length; j++) {
      var col = new Array(length);
      col[j] = document.createElement('span');
      col[j].setAttribute('boxType', '0');
      col[j].innerHTML = '&nbsp;';
      row[i].appendChild(col[j]);
    }
    cell.appendChild(row[i]);
  }
  cell.style.width = length * 60 + 'px';
}

function starGame (length) {
  var box = new Array(length);
  var row = cell.getElementsByTagName('div');
  for (var i = 0; i < length; i++) {
    box[i] = row[i].getElementsByTagName('span');
  }

  addEvent (document, 'keydown', function (e) {
    var keynum = window.event ? e.keyCode : e.which;
    switch (keynum) {
      //左
      case 37: moveBoxLeft(box, length); break;
      //上
      case 38: moveBoxTop(box, length); break;
      //右
      case 39: console.log(39); break;
      //下
      case 40: console.log(40); break;
    }
  });

  //增加格子
  initializeBox(box, length);
}

//初始化格子
function initializeBox (box, length) {
  if (fail(box, length)) {
    return;
  }
  for (var i = 2; i > 0; ) {
    var x = parseInt(Math.random() * 4);
    var y = parseInt(Math.random() * 4);
    if (box[x][y].getAttribute('boxType') === '0') {
      box[x][y].innerHTML = data.value[1];
      box[x][y].setAttribute('boxType','1');
      box[x][y].setAttribute('class', 'type1');
      i--;
    }
  }
}

//向左移动
function moveBoxLeft (box, length) {
  mergeBoxLeft(box, length);
  for (var i = 0; i < length; i++) {
    var empty = 0;
    for (var j = 0; j < length; j++) {
      var boxType = box[i][j].getAttribute('boxType');
      if (boxType !== '0') {
        tempAttribute = boxType;
        tempInnerHTML = box[i][j].innerHTML;   
        box[i][j].setAttribute('boxType', '0');
        box[i][j].setAttribute('class', '');
        box[i][j].innerHTML = '&nbsp;';
        box[i][empty].setAttribute('boxType', tempAttribute);
        box[i][empty].setAttribute('class', 'type' + tempAttribute);
        box[i][empty].innerHTML = tempInnerHTML;
        empty++;
      }
    }
  }
  initializeBox(box, length);
}

//向左合并
function mergeBoxLeft (box, length) {
  for (var i = 0; i < length; i++) {
    var boxPre, boxTypeTemp;
    var merge = 0;
    for (var j = 0; j < length; j++) {
      var boxType = box[i][j].getAttribute('boxType');
      if (boxType === '0') {
        continue;
      } else {
        if (merge === 0) {
          boxPre = box[i][j];
          boxPreType = boxPre.getAttribute('boxType');
          merge = 1;
          continue;
        }
        if (merge === 1) {
          if (boxPreType === boxType) {
            boxPre.setAttribute('boxType', parseInt(boxType) + 1);
            boxPre.setAttribute('class', 'type' + parseInt(boxType) + 1);
            boxPre.innerHTML = data.value[parseInt(boxType) + 1];
            box[i][j].setAttribute('boxType', '0');
            box[i][j].setAttribute('class', '');
            box[i][j].innerHTML = '&nbsp;';
            merge = 0;
          } else {
            boxPre = box[i][j];
            boxPreType = boxPre.getAttribute('boxType');
          }  
        }
      }
    }
  }
}

//向上移动
function moveBoxTop (box, length) {
  mergeBoxTop(box, length);
  for (var i = 0; i < length; i++) {
    var empty = 0;
    for (var j = 0; j < length; j++) {
      var boxType = box[j][i].getAttribute('boxType');
      if (boxType !== '0') {
        tempAttribute = boxType;
        tempInnerHTML = box[j][i].innerHTML;   
        box[j][i].setAttribute('boxType', '0');
        box[j][i].setAttribute('class', '');
        box[j][i].innerHTML = '&nbsp;';
        box[empty][i].setAttribute('boxType', tempAttribute);
        box[empty][i].setAttribute('class', 'type' + tempAttribute);
        box[empty][i].innerHTML = tempInnerHTML;
        empty++;
      }
    }
  }
  initializeBox(box, length);
}

//向上合并
function mergeBoxTop (box, length) {
  for (var i = 0; i < length; i++) {
    var boxPre, boxTypeTemp;
    var merge = 0;
    for (var j = 0; j < length; j++) {
      var boxType = box[j][i].getAttribute('boxType');
      if (boxType === '0') {
        continue;
      } else {
        if (merge === 0) {
          boxPre = box[j][i];
          boxPreType = boxPre.getAttribute('boxType');
          merge = 1;
          continue;
        }
        if (merge === 1) {
          if (boxPreType === boxType) {
            boxPre.setAttribute('boxType', parseInt(boxType) + 1);
            boxPre.setAttribute('class', 'type' + parseInt(boxType) + 1);
            boxPre.innerHTML = data.value[parseInt(boxType) + 1];
            box[j][i].setAttribute('boxType', '0');
            box[j][i].setAttribute('class', '');
            box[j][i].innerHTML = '&nbsp;';
            merge = 0;
          } else {
            boxPre = box[j][i];
            boxPreType = boxPre.getAttribute('boxType');
          }  
        }
      }
    }
  }
}

function fail (box, length) {
  var surplusBox = 0;
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length; j++) {
      if (box[i][j].getAttribute('boxType') === '0') {
        surplusBox++;
      }
    }
  }
  return surplusBox < 2 ? true : false;
}