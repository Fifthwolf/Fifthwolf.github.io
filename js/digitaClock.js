var canvas = document.getElementById('canvas');
var element = {
  ctx: null,
  time: null
};

var digit =
  [
    [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0]
    ], //0
    [
      [0, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1]
    ], //1
    [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ], //2
    [
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0]
    ], //3
    [
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 0, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1]
    ], //4
    [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0]
    ], //5
    [
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0]
    ], //6
    [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0]
    ], //7
    [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0]
    ], //8
    [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 0, 0]
    ], //9
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ] //:
  ];

window.onload = function() {
  delayedLoadingPublicPictures('../');
  init();
  drawCanvas();
}

function init() {
  setCanvas();
  element.time = new Time();
}

function drawCanvas() {
  requestAnimationFrame(drawCanvas);
  element.time.draw();
}

function setCanvas() {
  element.ctx = canvas.getContext('2d');
  _setCanvasProperty();

  function _setCanvasProperty() {
    canvas.width = 640;
    canvas.height = 104;
  }
}

function Time() {
  this.time;

  this.timeUpdate = function() {
    this.time = '';
    var time = new Date();
    this.time += this._prefixInteger(time.getHours(), 2);
    this.time += 'x';
    this.time += this._prefixInteger(time.getMinutes(), 2);
    this.time += 'x';
    this.time += this._prefixInteger(time.getSeconds(), 2);
    this.time = this.time.split('');
    this.time[2] = 10;
    this.time[5] = 10;
  }

  this.draw = function() {
    this.timeUpdate();
    element.ctx.clearRect(0, 0, 640, 104);
    var digitNum, posX, posY;
    var ctx = element.ctx;
    for (var i = 0, len = this.time.length; i < len; i++) {
      digitNum = digit[this.time[i]];
      for (var j = 0; j < digitNum.length * digitNum[0].length; j++) {
        posX = i * 80 + parseInt(j / 10) * 10 + 4;
        posY = j % 10 * 10 + 4;
        if (digitNum[parseInt(j % 10)][parseInt(j / 10)] == 1) {
          ctx.save();
          ctx.beginPath();
          var gr = ctx.createRadialGradient(posX - 3, posY - 3, 2, posX - 2, posY - 2, 6);
          gr.addColorStop(0, '#fff');
          gr.addColorStop(1, '#123');
          ctx.fillStyle = gr;
          ctx.arc(posX, posY, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }

  this._prefixInteger = function(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }
}