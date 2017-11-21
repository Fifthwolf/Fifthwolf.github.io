var content = document.getElementsByClassName('content')[0];
var canvas = document.getElementById('canvas');
var TIME = {};

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  var image = new Image();
  image.src = '../image/flyBirdDemo.png';
  image.onload = function () {
    createFrame(image, true);
  }
}

var data = {
  refreshRate: 20, //刷新频率
  backGround: 0, //0白天，1黑夜
  birdColor: 0, //0黄色，1蓝色，2红色
  speedX: 10,
  speedY: 0,
  gravity: 10,
  birdHeight: 100
};

function createFrame (image, initialization) {
  canvas.width = 400;
  canvas.height = 600;
  var cxt = canvas.getContext('2d');
  if (initialization) {
    data.backGround = parseInt(Math.random() * 1000) % 2;
  }
  _drawBackGround(cxt);

  function _drawBackGround (cxt) {
    cxt.beginPath();
    var drawBackGround, bottomStripeDeviation = 0;
    if (data.backGround) {
      drawBackGround = function () {
        cxt.drawImage(image, 292, 0, 288, 512, 0, -55, 400, 711);
      } 
    } else {
      drawBackGround = function () {
        cxt.drawImage(image, 0, 0, 288, 512, 0, -55, 400, 711);
      }
    }

    if (initialization) {
      _gradientBackGround(1);
    } else {
      drawBackGround();
    }
    drawBottomStripe(bottomStripeDeviation, initialization);

    function drawBottomStripe (deviation, initialization) {
      cxt.drawImage(image, 584 + deviation, 0, 336, 22, 0, 569, 465, 31);
      if (!initialization) {
        bottomStripeDeviation = (bottomStripeDeviation + 2) % 24;
        TIME.bottomStripe = setTimeout(function () {
          drawBottomStripe(bottomStripeDeviation, initialization);
        }, data.refreshRate);
      }
    }

    function _gradientBackGround (backGroundBlackAlpha) {
      drawBackGround();
      drawBottomStripe(bottomStripeDeviation, initialization);
      cxt.beginPath();
      cxt.fillStyle = 'rgba(0, 0, 0, ' + backGroundBlackAlpha + ')';
      cxt.fillRect(0, 0, canvas.width, canvas.height);
      backGroundBlackAlpha = Math.max(0, backGroundBlackAlpha - 1 / data.refreshRate);
      bottomStripeDeviation = (bottomStripeDeviation + 2) % 24;
      if (backGroundBlackAlpha > 0) {
        setTimeout(function () {
          _gradientBackGround(backGroundBlackAlpha);
        }, data.refreshRate);
      } else {
        createFrame(image, false);
      }
    }
  }
}