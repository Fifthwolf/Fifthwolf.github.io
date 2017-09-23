﻿var content = document.getElementsByClassName('content')[0];
var scoreSpan = content.getElementsByClassName('score')[0].getElementsByTagName('span')[0];
var surplusSpan = content.getElementsByClassName('surplus')[0].getElementsByTagName('span')[0];
var pause = content.getElementsByClassName('pause')[0];
var mainViewBox = content.getElementsByClassName('box')[0];
var cellMask = content.getElementsByClassName('cellMask')[0];
var starButton = cellMask.getElementsByClassName('starButton')[0];
var TIME;

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

data = {
  row: 8,
  col: 14,
  type: 8,
  box: [],
  surplus: 0,
  time: 0,
  tempRoute: [],
  preChoose: null
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
      col[j].setAttribute('boxType', '0');
      col[j].setAttribute('col', j + 1);
      row[i].appendChild(col[j]);
    }
    mainViewBox.appendChild(row[i]);
  }
}

addEvent(starButton, 'click', start);

addEvent(pause, 'click', function(e) {
  clearInterval(TIME);
  TIME = null;
  pause.style.display = 'none';
  starButton.innerHTML = '继续游戏';
  cellMask.style.display = 'block';
  cellMask.style.backgroundColor = '#567';
});

addEvent(mainViewBox, 'click', function(e) {
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    if (e.target.getAttribute('boxType') != 0) {
      if (data.preChoose) {
        data.preChoose.removeClass('choose');
        elimination(data.preChoose, e.target);
        return;
      } else {
        e.target.addClass('choose');
        data.preChoose = e.target;
        return;
      }
    }
  }
  try {
    data.preChoose.removeClass('choose');
    data.preChoose = null;
  } catch (e) {
    return;
  }
});

function start () {
  TIME = null;
  data.time = 0;
  data.surplus = 112;
  surplusSpan.innerHTML = data.surplus + '个';
  cellMask.style.display = 'none';
  pause.style.display = 'block';
  initialization();
  timer();
  removeEvent(starButton, 'click', start);
  addEvent(starButton, 'click', restart);
}

function restart () {
  cellMask.style.display = 'none';
  pause.style.display = 'block';
  timer();
}

function initialization () {
  data.box = null;
  data.box = new Array(data.row + 2);
  for (var i = 0, len = data.row + 2; i < len; i++) {
    data.box[i] = new Array(data.col + 2);
    for (var j = 0; j < data.col + 2; j++) {
      data.box[i][j] = 0;
    }
  }
  var spanElements = mainViewBox.getElementsByTagName('span');
  var spanArray = new Array();
  for (var i = 0, len = spanElements.length; i < len; i++) {
    spanArray[i] = spanElements[i];
  }

  //随机生成配对块
  while (spanArray.length > 0) {
    var type = parseInt(Math.random() * data.type + 1);
    for (var i = 0; i < 2; i++) {
      var index = parseInt(Math.random() * spanArray.length);
      spanArray[index].removeAttribute('class');
      spanArray[index].setAttribute('boxType',type);
      spanArray[index].addClass('type' + type);
      spanArray[index].innerHTML = type;
      spanArray.splice(index,1);
    }   
  }

  //将配对块模型化为data.box
  for (var i = 0, len = spanElements.length; i < len; i++) {
    data.box[parseInt(i / data.col + 1)][parseInt(i % data.col + 1)] = parseInt(spanElements[i].getAttribute('boxType'));
  }
}

//选择两个框，进行判断
function elimination (preElement, nowElement) {
  var preOrdinate = {x: preElement.parentNode.getAttribute('row'), y: preElement.getAttribute('col')};
  var nowOrdinate = {x: nowElement.parentNode.getAttribute('row'), y: nowElement.getAttribute('col')};
  
  if (judgement(preOrdinate, nowOrdinate)) {
    preElement.setAttribute('boxType', '0');
    preElement.removeAttribute('class');
    preElement.innerHTML = '';
    nowElement.setAttribute('boxType', '0');
    nowElement.removeAttribute('class');
    nowElement.innerHTML = '';
    data.box[preOrdinate.x][preOrdinate.y] = 0;
    data.box[nowOrdinate.x][nowOrdinate.y] = 0;
    data.preChoose = null;
    data.surplus -= 2;
    surplusSpan.innerHTML = data.surplus + '个';
  } else {
    if (nowElement.getAttribute('boxType') != 0) {
      nowElement.addClass('choose');
      data.preChoose = nowElement;
    }
  }

  if (data.surplus == 0) {
    over();
  }
}

function judgement (preOrdinate, nowOrdinate) {
  //判断是否点击同一个框
  if (preOrdinate.x == nowOrdinate.x && preOrdinate.y == nowOrdinate.y) {
    return false;
  }
  //判断两个框是否同一类型
  if (data.box[preOrdinate.x][preOrdinate.y] !== data.box[nowOrdinate.x][nowOrdinate.y]) {
    return false;
  }

  //两个框位于同一行
  if (preOrdinate.x === nowOrdinate.x) {
    //相邻
    if (Math.abs(preOrdinate.y - nowOrdinate.y) === 1) {
      lineRoute();
      return true;
    }

    var yMax = Math.max(preOrdinate.y, nowOrdinate.y);
    var yMin = Math.min(preOrdinate.y, nowOrdinate.y);

    //不相邻，直线连接 
    var temp = 0;
    for (var y = yMin + 1, len = yMax; y < len; y++) {
      if (data.box[preOrdinate.x][y] !== 0) {
        temp++;
        break;
      }
    }
    if (temp === 0) {
      lineRoute();
      return true;
    }
  }

  //两个框位于同一列
  if (preOrdinate.y === nowOrdinate.y) {
    //相邻
    if (Math.abs(preOrdinate.x - nowOrdinate.x) === 1) {
      lineRoute();
      return true;
    }

    var xMax = Math.max(preOrdinate.x, nowOrdinate.x);
    var xMin = Math.min(preOrdinate.x, nowOrdinate.x);

    //不相邻，直线连接 
    var temp = 0;
    for (var x = xMin + 1, len = xMax; x < len; x++) {
      if (data.box[x][preOrdinate.y] !== 0) {
        temp++;
        break;
      }
    }
    if (temp === 0) {
      lineRoute();
      return true;
    }
  }

  function lineRoute () {
    //data.tempRoute.push([preOrdinate.x,preOrdinate.y]);
    //data.tempRoute.push([nowOrdinate.x,nowOrdinate.y]);
    //console.log(data.tempRoute);
  }

  //两个框不同行且不同列
  var xMax = Math.max(preOrdinate.x, nowOrdinate.x);
  var xMin = Math.min(preOrdinate.x, nowOrdinate.x);
  var yMax = Math.max(preOrdinate.y, nowOrdinate.y);
  var yMin = Math.min(preOrdinate.y, nowOrdinate.y);

  //左右搜索
  for (var y = 0; y < data.col + 2; y++) {
    temp = 0;
    retrievalY(y, preOrdinate);
    retrievalY(y, nowOrdinate);

    function retrievalY (initialValue, ordinate) {
      if (initialValue < ordinate.y) {
        var tempRoute = 0;
        for (var value = initialValue; value < ordinate.y; value++) {
          if (data.box[ordinate.x][value] !== 0) {
            //data.tempRoute = [];
            temp++;
            break;
          }
          if (tempRoute == 0) {
            data.tempRoute.push([ordinate.x,value]);
            tempRoute = 1;
          }
        }
      } else if (y > ordinate.y) {
        var tempRoute = 0;
        for (var value = initialValue; value > ordinate.y; value--) {
          if (data.box[ordinate.x][value] !== 0) {
            //data.tempRoute = [];
            temp++;
            break;
          }
          if (tempRoute == 0) {
            data.tempRoute.push([ordinate.x,value]);
            tempRoute = 1;
          }
        }
      }
    }

    if (temp > 0) {
      data.tempRoute = [];
      continue;
    }
    for (var x = xMin, len = xMax; x <= len; x++) {
      if (x == preOrdinate.x && y == preOrdinate.y || x == nowOrdinate.x && y == nowOrdinate.y) {
        continue;
      }
      if (data.box[x][y] !== 0) {
        temp++;
        break;
      }
    }
    if (temp > 0) {
      data.tempRoute = [];
      continue;
    }
    if (temp === 0) {
      polylineRoute();
      return true;
    }
  }

  //上下搜索
  for (var x = 0; x < data.row + 2; x++) {
    temp = 0;
    retrievalX(x, preOrdinate);
    retrievalX(x, nowOrdinate);

    function retrievalX (initialValue, ordinate) {
      if (initialValue < ordinate.x) {
        var tempRoute = 0;
        for (var value = initialValue; value < ordinate.x; value++) {
          if (data.box[value][ordinate.y] !== 0) {
            //data.tempRoute = [];
            temp++;
            break;
          }
          if (tempRoute == 0) {
            data.tempRoute.push([value,ordinate.y]);
            tempRoute = 1;
          }
        }
      } else if (initialValue > ordinate.x) {
        var tempRoute = 0;
        for (var value = initialValue; value > ordinate.x; value--) {  
          if (data.box[value][ordinate.y] !== 0) {
            //data.tempRoute = [];
            temp++;
            break;
          }
          if (tempRoute == 0) {
            data.tempRoute.push([value,ordinate.y]);
            tempRoute = 1;
          }  
        }
      }
    }

    if (temp > 0) {
      data.tempRoute = [];
      continue;
    }
    for (var y = yMin, len = yMax; y <= len; y++) {
      if (x == preOrdinate.x && y == preOrdinate.y || x == nowOrdinate.x && y == nowOrdinate.y) {
        continue;
      }
      if (data.box[x][y] !== 0) {
        temp++;
        break;
      }
    }
    if (temp > 0) {
      data.tempRoute = [];
      continue;
    }
    if (temp === 0) {
      polylineRoute();
      return true;
    }
  }

  function polylineRoute () {
    data.tempRoute.unshift([preOrdinate.x,preOrdinate.y]);
    data.tempRoute.push([nowOrdinate.x,nowOrdinate.y]);
    /*
    for (var i = 0, len = data.tempRoute.length; i < len - 1; i++) {
      for (var j = i + 1 ; j < len; j++) {
        if (data.tempRoute[i][0] == data.tempRoute[j][0]
         && data.tempRoute[i][1] == data.tempRoute[j][1]) {
          data.tempRoute.splice(j,1);
          data.tempRoute.splice(i,1);
        }
      }
    }
    */
    for(var i = 0, len = data.tempRoute.length; i < len; i++) {
      console.log(data.tempRoute[i][0],data.tempRoute[i][1]);
    }
    data.tempRoute = [];
  }

  return false;
}

function timer () {
  TIME = setInterval(function () {
    data.time += 0.1;
    scoreSpan.innerHTML = data.time.toFixed(1) + '秒';
  }, 100);
}

function over () {
  clearInterval(TIME);
  TIME = null;
  cellMask.style.display = 'block';
  cellMask.style.backgroundColor = 'rgba(17, 34, 63, 0.6)';
  pause.style.display = 'none';
  starButton.innerHTML = '再来一局';
  removeEvent(starButton, 'click', restart);
  addEvent(starButton, 'click', start);
}