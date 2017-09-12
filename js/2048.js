var content = document.getElementsByClassName('content')[0];
var score = content.getElementsByClassName('score')[0];
var scoreSpan = score.getElementsByTagName('span')[0];
var cell = content.getElementsByClassName('cell')[0];
var cellMask = content.getElementsByClassName('cellMask')[0];
var restartButton = cellMask.getElementsByClassName('restart')[0];
var changeButton = document.getElementById('change');

var data = {
  start: true,
  value: [],
  length: 4,
  step: 0,
  score: 0,
  moveEvent:false,
  box: null
}

window.onload = function () {
  data.value[0] = '&nbsp;';
  for (var i = 1; i < 16; i++) {
    data.value[i] = Math.pow(2, i);
  }
  createCell(data.length);
  starGame(data.length);
}

addEvent (changeButton, 'click', function () {
  var changeLength = Number(document.getElementById('length').value);
  if(changeLength >= 4 && changeLength <= 8 && _isInteger(changeLength)){
    data.length = changeLength;
    restart();
  }
  function _isInteger (obj) {
    return typeof obj === 'number' && obj % 1 === 0;
  }
});

function restart () {
  cellMask.style.display = 'none';
  data.score = 0;
  createCell(data.length);
  starGame(data.length);
}

addEvent (restartButton, 'click', restart);

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
  cellMask.style.width = length * 60 + 'px';
  cellMask.style.height = length * 60 + 'px';
  cellMask.style.marginLeft = -(length * 60) / 2 - 5 + 'px';
}

function starGame (length) {
  data.box = null;
  data.box = new Array(length);
  var row = cell.getElementsByTagName('div');
  for (var i = 0; i < length; i++) {
    data.box[i] = row[i].getElementsByTagName('span');
  }
  if (data.moveEvent === false) {
    addEvent (document, 'keydown', function (e) {
      var keynum = window.event ? e.keyCode : e.which;
      switch (keynum) {
        //左
        case 37: moveBox(data.box, 'left'); break;
        //上
        case 38: moveBox(data.box, 'top'); break;
        //右
        case 39: moveBox(data.box, 'right'); break;
        //下
        case 40: moveBox(data.box, 'bottom'); break;
      }
    });
    data.moveEvent = true;
  }

  //增加格子
  initializeBox(data.box, length);
}

function fail () {
  cellMask.getElementsByTagName('p')[0].style.marginTop = (data.length - 4) * 30 + 40 + 'px';
  cellMask.getElementsByTagName('p')[1].innerHTML = data.score;
  data.step = 0;
  cellMask.style.display = 'block';
}

//初始化格子
function initializeBox (box, length) {
  var createBox;
  var createBox = Math.min(surplus(box, length), 2);
  if (createBox === 0 && adjoinBox(box, length)) {
    fail();
    return 0;
  }
  for (; createBox > 0; ) {
    var x = parseInt(Math.random() * length);
    var y = parseInt(Math.random() * length);
    if (box[x][y].getAttribute('boxType') === '0') {
      box[x][y].innerHTML = data.value[1];
      box[x][y].setAttribute('boxType','1');
      box[x][y].setAttribute('class', 'type1');
      createBox--;
    }
  }

  function surplus(box, length) {
    var surplusBox = 0;
    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length; j++) {
        if (box[i][j].getAttribute('boxType') === '0') {
          surplusBox++;
        }
      }
    }
    return surplusBox;
  }
}

function moveBox (box, direction) {
  var length = data.length;
  data.step++;
  mergeBox(box, data.length, direction);

  var x, y;
  if (direction === 'left' || direction === 'top') {
    for (var i = 0; i < length; i++) {
      var empty = 0;
      for (var j = 0; j < length; j++) {
        if (direction === 'left') {
          x = i;
          y = j;
        } else if (direction === 'top') {
          x = j;
          y = i;
        }
        var boxType = box[x][y].getAttribute('boxType');
        if (boxType !== '0') {
          move(box, x, y, empty, boxType, direction);
          empty++;
        }
      }
    }
  }

  if (direction === 'right' || direction === 'bottom') {
    for (var i = length - 1; i >= 0; i--) {
      var empty = length - 1;
      for (var j = length - 1; j >= 0; j--) {
        if (direction === 'right') {
          x = i;
          y = j;
        } else if (direction === 'bottom') {
          x = j;
          y = i;
        }
        var boxType = box[x][y].getAttribute('boxType');
        if (boxType !== '0') {
          move(box, x, y, empty, boxType, direction);
          empty--;
        }
      }
    }
  }

  initializeBox(box, length);

  function move (box, x, y, empty, boxType, direction) {
    tempAttribute = boxType;
    tempInnerHTML = box[x][y].innerHTML;   
    box[x][y].setAttribute('boxType', '0');
    box[x][y].setAttribute('class', '');
    box[x][y].innerHTML = '&nbsp;';
    if (direction === 'left' || direction === 'right') {
      box[x][empty].setAttribute('boxType', tempAttribute);
      box[x][empty].setAttribute('class', 'type' + tempAttribute);
      box[x][empty].innerHTML = tempInnerHTML;
    } else if (direction === 'top' || direction === 'bottom') {
      box[empty][y].setAttribute('boxType', tempAttribute);
      box[empty][y].setAttribute('class', 'type' + tempAttribute);
      box[empty][y].innerHTML = tempInnerHTML;
    }
  }

  function mergeBox (box, length, direction) {
    var x, y; 
    
    if (direction === 'left' || direction === 'top') {
      for (var i = 0; i < length; i++) {
        var boxPre, boxTypeTemp;
        var mergeState = 0;
        for (var j = 0; j < length; j++) {
          if (direction === 'left') {
            x = i;
            y = j;
          } else if (direction === 'top') {
            x = j;
            y = i;
          }
          var boxType = box[x][y].getAttribute('boxType');
          if (boxType === '0') {
            continue;
          } else {
            if (mergeState === 0) {
              boxPre = box[x][y];
              boxPreType = boxPre.getAttribute('boxType');
              mergeState = 1;
              continue;
            }
            if (mergeState === 1) {
              if (boxPreType === boxType) {
                mergeSuccess(box, x, y, boxPre);
                mergeState = 0;
              } else {
                boxPre = box[x][y];
                boxPreType = boxPre.getAttribute('boxType');
              }  
            }
          }
        }
      }
    }

    if (direction === 'right' || direction === 'bottom') {
      for (var i = length - 1; i >= 0; i--) {
        var boxPre, boxTypeTemp;
        var mergeState = 0;
        for (var j = length - 1; j >= 0; j--) {
          if (direction === 'right') {
            x = i;
            y = j;
          } else if (direction === 'bottom') {
            x = j;
            y = i;
          }
          var boxType = box[x][y].getAttribute('boxType');
          if (boxType === '0') {
            continue;
          } else {
            if (mergeState === 0) {
              boxPre = box[x][y];
              boxPreType = boxPre.getAttribute('boxType');
              mergeState = 1;
              continue;
            }
            if (mergeState === 1) {
              if (boxPreType === boxType) {
                mergeSuccess(box, x, y, boxPre);
                mergeState = 0;
              } else {
                boxPre = box[x][y];
                boxPreType = boxPre.getAttribute('boxType');
              }  
            }
          }
        }
      }
    }

    function mergeSuccess (box, x, y, boxPre) {
      boxPre.setAttribute('boxType', parseInt(boxType) + 1);
      boxPre.setAttribute('class', 'type' + parseInt(boxType) + 1);
      boxPre.innerHTML = data.value[parseInt(boxType) + 1];
      box[x][y].setAttribute('boxType', '0');
      box[x][y].setAttribute('class', '');
      box[x][y].innerHTML = '&nbsp;';
      data.score += Math.pow(2, parseInt(boxType) + 1);
      scoreSpan.innerHTML = data.score;
    }
  }
}

function adjoinBox (box, length) {
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length - 1; j++) {
      if(box[i][j].getAttribute('boxType') === box[i][j + 1].getAttribute('boxType')) {
        return false;
      }
      if(box[j][i].getAttribute('boxType') === box[j + 1][i].getAttribute('boxType')) {
        return false;
      }
    }
  }
  return true;
}