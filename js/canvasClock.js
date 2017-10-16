var content = document.getElementsByClassName('content')[0];
var canvas = document.getElementById('canvas');

window.onload = function () {
  delayedLoadingPublicPictures ('../');
  createDial();
}

function createDial () {
  canvas.width = 600;
  canvas.height = canvas.width;
  radius = canvas.width / 2;
  var dialContext = canvas.getContext('2d');
  drawDial(dialContext, radius);
  drawSmallPoint(dialContext, radius);
  drawBigPoint(dialContext, radius);
}

function drawDial (context, radius) {
  context.beginPath();
  var dialColor = context.createRadialGradient(radius, radius, 0, radius, radius, radius - 30);
  dialColor.addColorStop(0, '#567');
  dialColor.addColorStop(1, '#345');
  context.fillStyle = dialColor;
  context.arc(radius, radius, radius - 50, 0, 2 * Math.PI);
  context.fill();
}