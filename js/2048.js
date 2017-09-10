var content = document.getElementsByClassName('content')[0];
var cell = content.getElementsByClassName('cell')[0];
var changeButton = document.getElementById('change');

var length = 4;

window.onload = function () {
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

  //初始化格子
  initializeBox(box, length);

  addEvent (document, 'keydown', function (e) {
    var keynum = window.event ? e.keyCode : e.which;
    switch (keynum) {
    //左
    case 37: moveBoxLeft(box, length); break;
    //上
    case 38: console.log(38); break;
    //右
    case 39: console.log(39); break;
    //下
    case 40: console.log(40); break;
  }
});
}

function initializeBox (box, length) {
  if (fail(box, length)) {
    return;
  }
  for (var i = 2; i > 0; ) {
    var x = parseInt(Math.random() * 4);
    var y = parseInt(Math.random() * 4);
    if (box[x][y].getAttribute('boxType') === '0') {
      box[x][y].innerHTML = '2';
      box[x][y].setAttribute('boxType','1');
      i--;
    }
  }
}

function moveBoxLeft (box, length) {
  for (var i = 0; i < length; i++) {
    var empty = 0;
    for (var j = 0; j < length; j++) {
      var boxType = box[i][j].getAttribute('boxType');
      if (boxType !== '0') {
        tempAttribute = boxType;
        tempInnerHTML = box[i][j].innerHTML;   
        box[i][j].setAttribute('boxType', '0');
        box[i][j].innerHTML = '&nbsp;';
        box[i][empty].setAttribute('boxType', tempAttribute);
        box[i][empty].innerHTML = tempInnerHTML;
        empty++;
      }
    }
  }
  initializeBox(box, length);
}

function merge (box, length) {
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length; j++) {
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