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
  lastTop: 315,
  rotateAngle: 0,
  speedX: 10,
  speedY: 0,
  gravity: 0,
  birdLeft: 120,
  birdTop: 315,
  obstacle: [],
  obstacleAdopt: 56,
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
    addEvent(document, 'keydown', gamePlayingSpace);
    drawMask(false);
    createGetReady();
    TIME.dataUpdate = setInterval(function () {
      data.speedY = data.speedY + data.gravity;
      data.birdTop = data.birdTop + data.speedY;
      createBird();
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
      deviation = (deviation + 1.5) % 24;
      drawBottomStripe(deviation);
    }, data.refreshRate);
  }
}

function gamePlayingSpace (e) {
  var e = e || window.e;
  if (e && e.keyCode == 32) {
    gamePlaying();
  }
}

function gamePlaying () {
  if (data.start === false) {
    data.gravity = 0.4;
    createObstacle();
  }
  data.start = true;
  var contextCanvasButton = canvasButton.getContext('2d');
  createScore(data.score);
  data.speedY = -8;
}

function createObstacle () {
  var adopt = 140;
  var obstacleWidth = 72;
  var transverseSpacing = 225;
  var scoreFlag = true;

  TIME.showObstacle = setInterval(function () {
    data.obstacleAdopt = data.obstacleAdopt + 1;
    for (var i = 0, len = data.obstacle.length; i < len; i++) {
      data.obstacle[i][0] -= 2;
    }
    if (data.obstacleAdopt > 112) {
      data.obstacleAdopt = 0;
      var obstacleTop = parseInt(Math.random() * 260) + 100,
      obstacleBottom = obstacleTop + adopt;
      data.obstacle.push([400, obstacleTop, obstacleBottom]);
    }
    for (var i = 0; i < data.obstacle.length; i++) {
      if (data.obstacle[0][0] < -72) {
        data.obstacle.shift();
      }
      if (data.obstacle[0][0] < 0) {
          scoreFlag = true;
        }
      if (scoreFlag === true && data.obstacle[i][0] < 84 && data.obstacle[i][0] > 0) {
        scoreFlag = false;
        data.score++;
        createScore(data.score);
      }
    }
    _drawObstacle();
    if (!collisionJudge()) {
      gameover();
    }
  }, data.refreshRate);

  function _drawObstacle () {
    var cxt = canvasObstacle.getContext('2d');
    var obstacleData = [ //52, 320
      [112, 646],
      [168, 646]
    ]
    cxt.clearRect(0, 0, canvasObstacle.width, canvasObstacle.height);
    for (var i = 0, len = data.obstacle.length; i < len; i++) {
      cxt.drawImage(data.image, 112, 646, 52, 320, data.obstacle[i][0], data.obstacle[i][1] - 445, 72, 445); //上层柱子
      cxt.drawImage(data.image, 168, 646, 52, 320, data.obstacle[i][0], data.obstacle[i][2], 72, 445); //下层柱子
    }
    cxt.clearRect(0, canvasObstacle.height - 31, canvasObstacle.width, 31);
  }
}

function createButton () {
  var cxt = canvasButton.getContext('2d');
  cxt.drawImage(data.image, 702, 182, 178, 48, 76, 118, 247, 67);
  cxt.drawImage(data.image, 708, 236, 104, 58, 128, 400, 144, 81);
}

function createGetReady () {
  var cxt = canvasButton.getContext('2d');
  createScore(0);
  cxt.drawImage(data.image, 590, 118, 184, 50, 75, 190, 256, 69);
  cxt.drawImage(data.image, 584, 182, 114, 98, 120, 295, 158, 136);
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
  cxt.drawImage(data.image, birdPosition[data.birdColor][data.birdAttitude][0], birdPosition[data.birdColor][data.birdAttitude][1], 34, 24, data.birdLeft - 24, data.birdTop - 17, 48, 34);
  rotateBird(cxt, -data.rotateAngle, false);
  rotateBird(cxt, Math.atan(data.speedY / 10), true);
}

function rotateBird (cxt, angle, reduction) {
  var top = data.lastTop;
  if (reduction) {
    data.rotateAngle = angle;
    data.lastTop = data.birdTop;
    top = data.birdTop;
  }
  cxt.translate(data.birdLeft, top);
  cxt.rotate(angle);
  cxt.translate(-data.birdLeft, -top);
}

function createScore (score) {
  var cxt = canvasButton.getContext('2d');
  cxt.clearRect(0, 0, canvasButton.width, canvasButton.height);
  var scoreData = [
    [992, 120], //0
    [268, 910], //1
    [584, 320], //2
    [612, 320], //3
    [640, 320], //4
    [668, 320], //5
    [584, 368], //6
    [612, 368], //7
    [640, 368], //8
    [668, 368]  //9
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

/*
function collisionJudge() {
  var BirdLeft=120, High=568, BirdTop;
  var Radius=15,TubeWidth=72,TubeGap=140,GapWidth=224,Score=0;//半径15，管宽72，上下间宽140，左右间距224，分数为0
  var data.obstacle[0][0]=1000;
  var data.obstacle[0][1]=random()*(High-TubeGap),
  data.obstacle[1][1]=Math.random() * (High-TubeGap);
  var Top=BirdTop+Radius,Bottom=BirdTop-Radius;//加入顶和底两个辅助变量


  while (1) {
    while (data.obstacle[0][0] > BirdLeft + Radius)//安全且不通过第一个管道
    { ;
  data.obstacle[0][0]--;//暂时留空语句，以后加功能
  }

  while(data.obstacle[0][0]>BirdLeft-TubeWidth/2)//通过第一个管道的前半段
  { if(Check(Top)&&Check(Bottom)) //四连判定：顶和底是否均处于安全区  
    {
      data.obstacle[0][0]--;
      continue;
    }
  else    {cout<<score;//这里插入一个结束输出score的函数
  return False;}//有一次不满足，就直接退出了，其实可以直接返回score的
  }
  
  score++；//此时通过管道中心点，分数+1
  
  while(data.obstacle[0][0]>BirdLeft-Radius-TubeWidth)//通过第一个管道的后半段
  { if(Check(Top)&&Check(Bottom)) //四连判定：顶和底是否均处于安全区  
    {
      data.obstacle[0][0]--;
      continue;
    }
  else    {cout<<score;//这里插入一个结束输出score的函数
  return False;}//有一次不满足，就直接退出了，其实可以直接返回score的
  }
  while(data.obstacle[0][0]>0)//在第一个管道消失前，鸟在安全区内
    { ;
  data.obstacle[0][0]--;//暂时留空语句，以后加功能
  }
  //第一个管道消失的过程中鸟一直在安全区，所以当obstacle变成0时可以直接赋值为224加上72
  //反正直到它减小到120+15时才开始碰到下一个管道
  data.obstacle[0][0]=GapWidth+TubeWidth;
  data.obstacle[0][1]=data.obstacle[1][1];//把之前11里的的随机数赋给01
  data.obstacle[1][1]=random()*(High-TubeGap);//再写一个随机高度进去
  //然后while(1)无限循环去吧
  } 
}

Bool Check(int x)
{if((x>High-TubeGap-data.obstacle[0][0])&&(x<High-obstacle[0][0])//以左下为坐标系原点，x处于顶底之间的安全区
return True；
 else   
return False;
}
*/

function collisionJudge () {
  var birdWidth = 48, birdHeight = 34;
  if (data.birdTop > 554) {
    return false;
  }
  for (var i = 0; i < data.obstacle.length; i++) {
    if (data.obstacle[i][0] < 120 + birdWidth / 2 && data.obstacle[i][0] > 48 - birdWidth / 2) {
      if (data.birdTop < data.obstacle[i][1] + birdHeight / 2 || data.birdTop > data.obstacle[i][1] + 140 - birdHeight / 2) {
        return false;
      }
    }
  }
  return true;
}

function gameover () {
  data.speedY = 0;
  removeEvent(canvasButton, 'click', gamePlaying);
  removeEvent(document, 'keydown', gamePlayingSpace);
  clearInterval(TIME.showObstacle);
  clearInterval(TIME.dataUpdate);
  clearTimeout(TIME.bottomStripe);
  if (data.birdTop <= 554) {
    setTimeout(function () {
      TIME.dataUpdate = setInterval(function () {
        data.speedY = data.speedY + data.gravity;
        data.birdTop = data.birdTop + data.speedY;
        createBird();
        if (data.birdTop > 554) {
          clearInterval(TIME.dataUpdate);
        }
      }, data.refreshRate);
    }, data.refreshRate * 10);
  }
}