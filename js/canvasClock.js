var content = document.getElementsByClassName('content')[0];
var canvas = document.getElementById('canvas');

window.onload = function() {
  delayedLoadingPublicPictures('../');
  createDial();
}

function createDial() {
  canvas.width = judgeWidth() ? 600 : content.clientWidth;
  canvas.height = canvas.width;
  radius = canvas.width / 2;
  var dialContext = canvas.getContext('2d');
  drawDial(dialContext, radius);
  var tempTime = nowTime();
  drawHand(dialContext, radius, tempTime);
  setInterval(function() {
    if (tempTime.seconds !== nowTime().seconds) {
      tempTime = nowTime();
      dialContext.clearRect(0, 0, radius, radius);
      drawDial(dialContext, radius);
      drawHand(dialContext, radius, tempTime);
    }
  }, 100);
}

function nowTime(context, radius) {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  return {
    hours,
    minutes,
    seconds
  };
}

function drawHand(context, radius, time) {
  var secondHand = time.seconds;
  var minuteHand = time.minutes + time.seconds / 60;
  var hourHand = time.hours + time.minutes / 60;
  drawDetailedHand(context, radius, '#bbb', 8, hourHand, radius + 35, 100, 6);
  drawDetailedHand(context, radius, '#ccc', 5, minuteHand, radius + 35, 50, 30);
  drawDetailedHand(context, radius, '#ddd', 2, secondHand, radius + 50, 30, 30);
  context.beginPath();
  context.fillStyle = '#123';
  context.arc(radius, radius, 4, 0, 2 * Math.PI);
  context.fill();
}

function drawDetailedHand(context, radius, color, lineWidth, point, correct1, correct2, scale) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.moveTo(position(point, correct1, scale).x, position(point, correct1, scale).y);
  context.lineTo(position(point, correct2, scale).x, position(point, correct2, scale).y);
  context.stroke();
}

function drawDial(context, radius) {
  context.beginPath();
  var dialColor = context.createRadialGradient(radius, radius, 0, radius, radius, radius - 30);
  dialColor.addColorStop(0, '#567');
  dialColor.addColorStop(1, '#345');
  context.fillStyle = dialColor;
  context.arc(radius, radius, radius, 0, 2 * Math.PI);
  context.fill();
  drawSmallPoint(context, radius);
  drawBigPoint(context, radius);
}

function drawSmallPoint(context, radius) {
  for (var i = 0; i < 60; i++) {
    if (i % 5 === 0) {
      continue;
    }
    context.beginPath();
    context.fillStyle = '#fff';
    context.arc(position(i, 20, 30).x, position(i, 20, 30).y, 2, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.arc(radius, radius, 12, 0, 2 * Math.PI);
    context.fill();
  }
}

function drawBigPoint(context, radius) {
  for (var i = 1; i < 13; i++) {
    context.beginPath();
    context.strokeStyle = '#fff';
    context.lineWidth = 3;
    context.moveTo(position(i, 10, 6).x, position(i, 10, 6).y);
    context.lineTo(position(i, 30, 6).x, position(i, 30, 6).y);
    context.stroke();
    drawNumber(context, i, position(i, 60, 6).x, position(i, 60, 6).y);
  }
}

function drawNumber(context, i, positionX, positionY) {
  context.beginPath();
  context.fillStyle = '#fff';
  context.font = 'bold 30px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(i, positionX, positionY);
}

function position(i, correct, scale) {
  var positionX = radius + (radius - correct) * Math.sin(Math.PI / scale * i);
  var positionY = radius - (radius - correct) * Math.cos(Math.PI / scale * i);
  return {
    x: positionX,
    y: positionY
  };
}