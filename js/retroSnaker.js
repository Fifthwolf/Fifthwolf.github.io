var content = document.getElementsByClassName('content')[0];
var pauseButton = content.getElementsByClassName('pause')[0];
var mainViewBox = content.getElementsByClassName('box')[0];
var cellMask = content.getElementsByClassName('cellMask')[0];
var starButton = cellMask.getElementsByClassName('starButton')[0];
var TIME;

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

var data = {
  row: 20,
  col: 30,
  start: false,
  box: [],
  direction: 1, //1上2右3下4左
  snake: [],
  eattingPoint: []
}

addEvent(starButton, 'click', starGame);
addEvent(document, 'keydown', changeDirection);


function createFrame () {
  mainViewBox.innerHTML = '';
  data.box = new Array(data.row);
  for (var i = 0; i < data.row; i++) {
    data.box[i] = new Array(data.col);
    var row = new Array(data.row);
    row[i] = document.createElement('div');
    row[i].setAttribute('row',i);
    for (var j = 0; j < data.col; j++) { 
      var col = new Array(data.col);
      col[j] = document.createElement('span');
      col[j].setAttribute('col', j);
      row[i].appendChild(col[j]);
      data.box[i][j] = col[j];
    }
    mainViewBox.appendChild(row[i]);
  }
}

function starGame () {
  cellMask.style.display = 'none';
  pauseButton.style.display = 'inline-block';
  data.start = true;
  data.snake = [[10, 15]];
  data.direction = parseInt(Math.random() * 100 % 4 + 1);
  switch (data.direction) {
    case 1:
    data.snake.push([data.snake[0][0] + 1, data.snake[0][1]]);
    data.snake.push([data.snake[0][0] + 2, data.snake[0][1]]);
    break;
    case 2:
    data.snake.push([data.snake[0][0], data.snake[0][1] - 1]);
    data.snake.push([data.snake[0][0], data.snake[0][1] - 2]);
    break;
    case 3:
    data.snake.push([data.snake[0][0] - 1, data.snake[0][1]]);
    data.snake.push([data.snake[0][0] - 2, data.snake[0][1]]);
    break;
    case 4:
    data.snake.push([data.snake[0][0], data.snake[0][1] + 1]);
    data.snake.push([data.snake[0][0], data.snake[0][1] + 2]);
    break;
  }
  createEatPoing();
  draw();
  TIME = setInterval(function () {
    running();
  }, 200);
}

function changeDirection (e) {
  var keynum = window.event ? e.keyCode : e.which;
  switch (keynum) {
    //左
    case 37: data.direction = 4; break;
    //上
    case 38: data.direction = 1; break;
    //右
    case 39: data.direction = 2; break;
    //下
    case 40: data.direction = 3; break;
  }
}

function running () {
  var head = [data.snake[0][0], data.snake[0][1]];
  switch (data.direction) {
    case 1:
      data.snake.unshift([data.snake[0][0] - 1, data.snake[0][1]]);
      break;
    case 2:
      data.snake.unshift([data.snake[0][0], data.snake[0][1] + 1]);
      break;
    case 3:
      data.snake.unshift([data.snake[0][0] + 1, data.snake[0][1]]);
      break;
    case 4:
      data.snake.unshift([data.snake[0][0], data.snake[0][1] - 1]);
      break;
  }
  if (head[0] === data.eattingPoint[0] && head[1] === data.eattingPoint[1]) {
    createEatPoing();
  } else {
    data.snake.pop();
  }
  draw();
}

function createEatPoing () {
  do {
    var flag = false;
    var row = parseInt(Math.random() * 600 % data.row);
    var col = parseInt(Math.random() * 600 % data.col);
    for (var i = 0; i < data.snake.length; i++) {
      if (data.snake[i][0] === row && data.snake[i][1] === col) {
        flag = true;
        break;
      }
    }
  } while ( flag )
  data.eattingPoint = [row, col];
}

function draw () {
  for (var i = 0; i < data.row; i++) {
    for (var j = 0; j < data.col; j++) {
      data.box[i][j].className = '';
    }
  }
  data.box[data.snake[0][0]][data.snake[0][1]].addClass('head');
  data.box[data.snake[0][0]][data.snake[0][1]].addClass('head' + data.direction);
  for (var i = 1, len = data.snake.length; i < len; i++) {
    data.box[data.snake[i][0]][data.snake[i][1]].addClass('body');
  }
  data.box[data.eattingPoint[0]][data.eattingPoint[1]].addClass('eatPoint');
}