var content = document.getElementsByClassName('content')[0];
var scoreBox = content.getElementsByClassName('score')[0];
var pauseButton = content.getElementsByClassName('pause')[0];
var timeBox = content.getElementsByClassName('time')[0];
var mainViewBox = content.getElementsByClassName('box')[0];
var cellMask = content.getElementsByClassName('cellMask')[0];
var starButton = cellMask.getElementsByClassName('starButton')[0];
var final = cellMask.getElementsByClassName('final')[0];
var TIME;
var GAMERUN;

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createFrame();
}

var data = {
  row: 20,
  col: 30,
  start: false,
  pause: false,
  box: [],
  pretreatmentDirection: 1, //1上2右3下4左
  direction: 1, //1上2右3下4左
  snake: [],
  eattingPoint: [],
  time: 0,
  score: 0
}

addEvent(starButton, 'click', starGame);
addEvent(document, 'keydown', changeDirection);
addEvent(pauseButton, 'click', pauseGame);

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
  dataReset();
  data.pretreatmentDirection = parseInt(Math.random() * 100 % 4 + 1);
  data.direction = data.pretreatmentDirection;
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
  GAMERUN = setInterval(running, 200);
  TIME = setInterval(timeAdd, 100);

  function dataReset () {
    cellMask.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    data.start = true;
    data.snake = [[10, 15]];
    data.time = 0;
    data.score = 0;
    timeBox.innerHTML = PrefixInteger(data.time, 3);
    scoreBox.innerHTML = PrefixInteger(data.score, 3);
  }
}

function pauseGame () {
  if (data.pause === false) {
    data.pause = true;
    pauseButton.innerHTML = 'CONTINUE';
    clearInterval(TIME);
    clearInterval(GAMERUN);
  } else if (data.pause === true) {
    data.pause = false;
    pauseButton.innerHTML = 'PAUSE';
    GAMERUN = setInterval(running, 200);
    TIME = setInterval(timeAdd, 100);
  }
}

function timeAdd () {
  data.time += 1;
  timeBox.innerHTML = PrefixInteger(parseInt(data.time / 10), 3);
}

function changeDirection (e) {
  var keynum = window.event ? e.keyCode : e.which;
  switch (keynum) {
    //左
    case 37:
      if (data.direction === 1 || data.direction === 3) {
        data.pretreatmentDirection = 4;
      }
      break;
    //上
    case 38:
      if (data.direction === 2 || data.direction === 4) {
        data.pretreatmentDirection = 1;
      }
      break;
    //右
    case 39:
      if (data.direction === 1 || data.direction === 3) {
        data.pretreatmentDirection = 2;
      }
      break;
    //下
    case 40:
      if (data.direction === 2 || data.direction === 4) {
        data.pretreatmentDirection = 3;
      }
      break;
  }
}

function running () {
  if (data.pretreatmentDirection != data.direction) {
    data.direction = data.pretreatmentDirection;
  }
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
    data.score += 1;
    scoreBox.innerHTML = PrefixInteger(data.score, 3);
  } else {
    data.snake.pop();
  }
  if (judgeFail()) {
    gameFail();
    return;
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

function judgeFail () {
  //碰壁
  if (data.snake[0][0] < 0 || data.snake[0][0] > data.row - 1 || data.snake[0][1] < 0 || data.snake[0][1] > data.col - 1) {
    return true;
  }
  //碰自身
  for (var i = 1, len = data.snake.length; i < len; i++) {
    if (data.snake[0][0] === data.snake[i][0] && data.snake[0][1] === data.snake[i][1]) {
      return true;
    }
  }
}

function gameFail () {
  clearInterval(GAMERUN);
  clearInterval(TIME);
  cellMask.style.display = 'block';
  starButton.innerHTML = '重新开始';
  var finalSpan = final.getElementsByTagName('span')[0];
  final.style.display = 'inline-block';
  finalSpan.innerHTML = parseInt(data.time / 10);
  pauseButton.style.display = 'none';
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

function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}
