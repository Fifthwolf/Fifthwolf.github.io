var main = document.getElementById('main');
var own = main.getElementsByClassName('own')[0];
var ownLi = own.getElementsByTagName('li');
var demo = document.getElementById('demo');

adjustmentWindow();

window.onresize = function () {
  adjustmentWindow();
  indexOnresize();
}

function adjustmentWindow () {
  if(judgeWidth()){
    main.style.display = 'flex';
    publicUseMainAppropriate(main);
  }
  if(!judgeWidth()){
    main.style.display = 'block';
  }
}

function publicUseMainAppropriate (element) {
  var height = document.documentElement.clientHeight||document.body.clientHeight;
  var width = document.documentElement.clientWidth||document.body.clientWidth;
  element.style.height = height - 40 + 'px';
  element.style.width = width - 40 + 'px';
  element.style.top = '20px';
  element.style.left = '20px';
}

function judgeWidth() {
  var screenWidth = document.documentElement.clientWidth||document.body.clientWidth;
  return (screenWidth >= 1000);
}

function addEvent (element, type, handler) {
  if (element.addEventListener) {  
    element.addEventListener(type, handler, false);  
  } else if (element.attachEvent) {  
    element.attachEvent('on' + type, function() {  
      handler.call(element);  
    });  
  } else {  
    element['on' + type] = handler;  
  }  
}