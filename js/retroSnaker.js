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
  snake: []
}

addEvent(starButton, 'click', starGame);

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
      break;
    case 2:
      data.snake.push([data.snake[0][0], data.snake[0][1] - 1]);
      break;
    case 3:
      data.snake.push([data.snake[0][0] - 1, data.snake[0][1]]);
      break;
    case 4:
      data.snake.push([data.snake[0][0], data.snake[0][1] + 1]);
      break;
  }
  draw();
}

function draw () {
  data.box[data.snake[0][0]][data.snake[0][1]].addClass('head');
  data.box[data.snake[0][0]][data.snake[0][1]].addClass('head' + data.direction);
  for (var i = 1, len = data.snake.length; i < len; i++) {
    data.box[data.snake[i][0]][data.snake[i][1]].addClass('body');
  }
}