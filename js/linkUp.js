var content = document.getElementsByClassName('content')[0];
var mainViewBox = content.getElementsByClassName('box')[0];

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
  initialization();
}

data = {
  row: 8,
  col: 14,
  type: 8,
  box: [],
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
  } else {
    if (nowElement.getAttribute('boxType') != 0) {
      nowElement.addClass('choose');
      data.preChoose = nowElement;
    }
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
      return true;
    }

    //弓形连接
    for (var x = 0; x < data.row + 2; x++) {
      if (x == preOrdinate.x) {
        continue;
      }
      temp = 0;
      if (x < preOrdinate.x) {
        for (var inX = x; inX < preOrdinate.x; inX++) {
          if (data.box[inX][yMin] !== 0) {
            temp++;
            break;
          }
          if (data.box[inX][yMax] !== 0) {
            temp++;
            break;
          }
        }
      } else {
        for (var inX = x; inX > preOrdinate.x; inX--) {
          if (data.box[inX][yMin] !== 0) {
            temp++;
            break;
          }
          if (data.box[inX][yMax] !== 0) {
            temp++;
            break;
          }
        }
      }

      if (temp > 0) {
        continue;
      }
      for (var y = yMin + 1, len = yMax; y < len; y++) {
        if (data.box[x][y] !== 0) {
          temp++;
          break;
        }
      }
      if (temp > 0) {
        continue;
      }
      if (temp === 0) {
        return true;
      }
    }
  }

  //两个框位于同一列
  if (preOrdinate.y === nowOrdinate.y) {
    //相邻
    if (Math.abs(preOrdinate.x - nowOrdinate.x) === 1) {
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
      return true;
    }

    //弓形连接
    for (var y = 0; y < data.col + 2; y++) {
      if (y == preOrdinate.y) {
        continue;
      }
      temp = 0;
      if (y < preOrdinate.y) {
        for (var inY = y; inY < preOrdinate.y; inY++) {
          if (data.box[xMin][inY] !== 0) {
            temp++;
            break;
          }
          if (data.box[xMax][inY] !== 0) {
            temp++;
            break;
          }
        }
      } else {
        for (var inY = y; inY > preOrdinate.y; inY--) {
          if (data.box[xMin][inY] !== 0) {
            temp++;
            break;
          }
          if (data.box[xMax][inY] !== 0) {
            temp++;
            break;
          }
        }
      }

      if (temp > 0) {
        continue;
      }
      for (var x = xMin + 1, len = xMax; x < len; x++) {
        if (data.box[x][y] !== 0) {
          temp++;
          break;
        }
      }
      if (temp > 0) {
        continue;
      }
      if (temp === 0) {
        return true;
      }
    }
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
        for (var value = initialValue; value < ordinate.y; value++) {
          if (data.box[ordinate.x][value] !== 0) {
            temp++;
            break;
          }
        }
      } else if (y > ordinate.y) {
        for (var value = initialValue; value > ordinate.y; value--) {
          if (data.box[ordinate.x][value] !== 0) {
            temp++;
            break;
          }
        }
      }
    }

    if (temp > 0) {
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
      continue;
    }
    if (temp === 0) {
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
        for (var value = initialValue; value < ordinate.x; value++) {
          if (data.box[value][ordinate.y] !== 0) {
            temp++;
            break;
          }
        }
      } else if (initialValue > ordinate.x) {
        for (var value = initialValue; value > ordinate.x; value--) {
          if (data.box[value][ordinate.y] !== 0) {
            temp++;
            break;
          }
        }
      }
    }

    if (temp > 0) {
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
      continue;
    }
    if (temp === 0) {
      return true;
    }
  }

  return false;
}