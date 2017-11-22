var content = document.getElementsByClassName('content')[0];
var canvasBackground = document.getElementById('canvasBackground');
var canvasObstacle = document.getElementById('canvasObstacle');
var canvasBird = document.getElementById('canvasBird');
var canvasButton = document.getElementById('canvasButton');
var canvasMask = document.getElementById('canvasMask');
var zoom = 1.389;
var TIME = {};

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  var image = new Image();
  image.src = '../image/flyBirdDemo.png';
  image.onload = function () {
    data.image = image;
    resetCanvas();
    createFrame();
    createButton();
    drawMask(false);
    addEvent(canvasButton, 'mousemove', cursorMoveEvent);
    addEvent(canvasButton, 'click', cursorClickEvent);
  }
}

var data = {
  image: null,
  start: false,
  fail: false,
  zoom: 1.389,
  refreshRate: 20, //刷新频率
  background: 0, //0白天，1黑夜
  birdColor: 0, //0黄色，1蓝色，2红色
  birdAttitude: 0, //姿态，0～2
  speedX: 10,
  speedY: 0,
  gravity: 0,
  birdLeft: 105,
  birdTop: 300,
  score: 0
};

function cursorClickEvent (e) {
  var e = e || window.e;
  if (cursorInStart(e)) {
    removeEvent(canvasButton, 'mousemove', cursorMoveEvent);
    canvasButton.style.cursor = 'default';
    startGame();
  }
}

function cursorMoveEvent (e) {
  var e = e || window.e;
  if (cursorInStart(e)) {
    canvasButton.style.cursor = 'pointer';
  } else {
    canvasButton.style.cursor = 'default';
  }
}

function cursorInStart (e) {
  if (_getMousePos(e).x > 128 && _getMousePos(e).x < 272
    && _getMousePos(e).y > 400 && _getMousePos(e).y < 481) {
    return true;
  } else {
    return false;
  }

  function _getMousePos (e) {
    var x = e.clientX - canvasBackground.getBoundingClientRect().left;
    var y = e.clientY - canvasBackground.getBoundingClientRect().top;
    return {'x': x, 'y': y};
  }
}

function startGame () {
  removeEvent(canvasButton, 'click', cursorClickEvent);
  var contextCanvasButton = canvasButton.getContext('2d');
  data.birdColor = parseInt(Math.random() * 300) % 3;
  TIME.birdAttitude = setInterval(function () {
    data.birdAttitude = (data.birdAttitude + 1) % 3;
  }, data.refreshRate * 10);
  drawMask(true);
  setTimeout(function () {
    addEvent(canvasButton, 'click', gamePlaying);
    contextCanvasButton.clearRect(0, 0, canvasButton.width, canvasButton.height);
    drawMask(false);
    createGetReady();
    TIME.dataUpdate = setInterval(function () {
      createBird();
      data.speedY = data.speedY + data.gravity;
      data.birdTop = data.birdTop + data.speedY;
    }, data.refreshRate);
  }, 400);
}

function createFrame () {
  var cxt = canvasBackground.getContext('2d');
  data.background = parseInt(Math.random() * 1000) % 2;

  drawBackground(cxt);
  drawBottomStripe(0);

  function drawBackground (cxt) {
    var _drawBackground;
    cxt.beginPath();
    if (data.background) {
      _drawBackground = function () {
        cxt.drawImage(data.image, 292, 0, 288, 512, 0, -55, 400, 711);
      } 
    } else {
      _drawBackground = function () {
        cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
      }
    }
    _drawBackground();
  }

  function drawBottomStripe (deviation) {
    cxt.drawImage(data.image, 584 + deviation, 0, 336, 22, 0, 569, 465, 31);
    TIME.bottomStripe = setTimeout(function () {
      deviation = (deviation + 2) % 24;
      drawBottomStripe(deviation);
    }, data.refreshRate);
  }
}

function gamePlaying () {
  if (data.start === false) {
    data.gravity = 0.6;
  }
  data.start = true;
  var contextCanvasButton = canvasButton.getContext('2d');
  contextCanvasButton.clearRect(0, 0, canvasButton.width, canvasButton.height);
  data.speedY = -10;
}

function createObstacle () {}

function createButton () {
  var cxt = canvasButton.getContext('2d');
  cxt.drawImage(data.image, 702, 182, 178, 48, 76, 118, 247, 67);
  cxt.drawImage(data.image, 708, 236, 104, 58, 128, 400, 144, 81);
}

function createGetReady () {
  var cxt = canvasButton.getContext('2d');
  cxt.drawImage(data.image, 590, 118, 184, 50, 75, 190, 256, 69);
  cxt.drawImage(data.image, 584, 182, 114, 98, 120, 295, 158, 136);
  createScore(0);
}

function createBird () {
  var cxt = canvasBird.getContext('2d');
  var birdPosition = [ //34, 24
    [
      [6, 982],
      [62, 982],
      [118, 982]
    ],
    [
      [174, 982],
      [230, 658],
      [230, 710]
    ],
    [
      [230, 762],
      [230, 814],
      [230, 866]
    ]
  ];
  cxt.clearRect(0, 0, canvasBird.width, canvasBird.height);
  cxt.drawImage(data.image, birdPosition[data.birdColor][data.birdAttitude][0], birdPosition[data.birdColor][data.birdAttitude][1], 34, 24, data.birdLeft, data.birdTop, 47, 33);
}

function createScore (score) {
  var cxt = canvasButton.getContext('2d');
  var scoreData = [
    [992, 120], //0
    [268, 910], //1
    [584, 320], //2
    [612, 320], //3
    [640, 320], //4
    [668, 320], //5
    [584, 360], //6
    [612, 360], //7
    [640, 360], //8
    [668, 360]  //9
  ];
  var single, ten, hundreds;
  if (score < 10) {
    cxt.drawImage(data.image, scoreData[score][0], scoreData[score][1], 24, 36, 182, 98, 33, 50);
  } else if (score < 100) {
    single = score % 10;
    ten = parseInt(score / 10);
    cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 24, 36, 199, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 24, 36, 165, 98, 33, 50);
  } else {
    single = score % 10;
    ten = parseInt((score / 10) % 10);
    hundreds = parseInt(score / 100);
    cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 24, 36, 216, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 24, 36, 182, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[hundreds][0], scoreData[hundreds][1], 24, 36, 148, 98, 33, 50);
  }
}

function drawMask (behavior) {
  var cxt = canvasMask.getContext('2d');
  if (behavior === true) {
    _gradientMask(0, behavior);
  } else {
    _gradientMask(1, behavior);
  }

  function _gradientMask (alpha, behavior) {
    cxt.beginPath();
    cxt.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')';
    cxt.clearRect(0, 0, canvasMask.width, canvasMask.height);
    cxt.fillRect(0, 0, canvasMask.width, canvasMask.height);
    if (behavior === true && alpha < 1 || behavior === false && alpha > 0) {
      alpha = behavior ? alpha + data.refreshRate / 400 : alpha - data.refreshRate / 400;
      setTimeout(function () {
        _gradientMask(alpha, behavior);
      }, data.refreshRate);
    }
  }
}

function resetCanvas () {
  canvasBackground.width = 400;
  canvasBackground.height = 600;
  canvasObstacle.width = 400;
  canvasObstacle.height = 600;
  canvasBird.width = 400;
  canvasBird.height = 600;
  canvasButton.width = 400;
  canvasButton.height = 600;
  canvasMask.width = 400;
  canvasMask.height = 600;
}