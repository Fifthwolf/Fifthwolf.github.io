var content = document.getElementsByClassName('content')[0];
var canvas = document.getElementById('canvas');

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  var image = new Image();
  image.src = '../image/flyBirdDemo.png';
  image.onload = function () {
    createFrame(image, true);
  }
}

var data = {
  backGround: 0, //0白天，1黑夜
  birdColor: 0, //0黄色，1蓝色，2红色
  speedX: 10,
  gravity: 10,
  birdHeight: 100
};

function createFrame (image, initialization) {
  canvas.width = 400;
  canvas.height = 600;
  var cxt = canvas.getContext('2d');
  _drawBackGround(cxt);

  function _drawBackGround (cxt) {
    cxt.beginPath();
    var backGround = parseInt(Math.random() * 1000) % 2;
    var drawbackGround;
    if (backGround) {
      drawbackGround = function () {
        cxt.drawImage(image, 292, 0, 288, 512, 0, -55, 400, 711);
      } 
    } else {
      drawbackGround = function () {
        cxt.drawImage(image, 0, 0, 288, 512, 0, -55, 400, 711);
      }
    }

    initialization ? _gradientBackGround(1) : drawbackGround();

    function _gradientBackGround (backGroundBlackAlpha) {
      drawbackGround();
      cxt.beginPath();
      cxt.fillStyle = 'rgba(0, 0, 0, ' + backGroundBlackAlpha + ')';
      cxt.fillRect(0, 0, canvas.width, canvas.height);
      backGroundBlackAlpha -= 0.1;
      if (backGroundBlackAlpha >= 0) {
        setTimeout(function () {
          _gradientBackGround(backGroundBlackAlpha);
        }, 50);
      }
    }
  }
}