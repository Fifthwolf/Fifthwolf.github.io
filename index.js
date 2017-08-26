var star = document.getElementById('star');
var eGo = document.getElementsByClassName('go')[0];
var main = document.getElementById('main');
var own = main.getElementsByClassName('own')[0];
var ownLi = own.getElementsByTagName('li');
var right = main.getElementsByClassName('right')[0];
var rightDiv = right.getElementsByTagName('div');
var TEMP;

if(judgeWidth()){
  useElementToAppropriate(star);
  useMainAppropriate(main);
}

window.onresize = function() {
  if(judgeWidth()){
    useElementToAppropriate(star);
    useMainAppropriate(main);
    main.style.display = 'flex';
  }
  if(!judgeWidth()){
    main.style.display = 'block';
  }
}

addEvent(own, 'click', function(e){
  var target = e.target || e.srcElement;
  for (var i = 0, length = ownLi.length; i < length; i++) {
    while (target.tagName.toUpperCase() != 'LI'){
      target = target.parentNode;
    }
    if (target == ownLi[i]){
      scrollAnimate(right, rightDiv[i], 200);
      break;
    }
  }
});

addEvent(eGo, 'click', function(){
  var deg = 0;
  function disappear () {
    deg += 3;
    setTimeout(function(){
      star.style.transform = 'rotateY(' + deg + 'deg)';
      if (deg < 90) {
        disappear();
      } else {
        star.style.display = 'none';
        if(judgeWidth()){
          main.style.display = 'flex';
        }
        deg = 270;
        appear();
      }
    },10);
  }
  function appear () {
    deg += 3;
    setTimeout(function(){
      main.style.transform = 'rotateY(' + deg + 'deg)';
      if (deg < 360) {
        appear();
      } else {
        main.style.transform = 'rotateY(0deg)';
      }
    },10);
  }
  disappear();
});

function useElementToAppropriate (element) {
  var height = element.offsetHeight;
  var screenHeight = document.documentElement.clientHeight||document.body.clientHeight;
  var top = (screenHeight - height)/2;
  element.style.marginTop = top - 50 +'px';
}

function useMainAppropriate (element) {
  var height = document.documentElement.clientHeight||document.body.clientHeight;
  var width = document.documentElement.clientWidth||document.body.clientWidth;
  element.style.height = height - 40 + 'px';
  element.style.width = width - 40 + 'px';
  element.style.top = '20px';
  element.style.left = '20px';
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

function judgeWidth(){
  var screenWidth = document.documentElement.clientWidth||document.body.clientWidth;
  return (screenWidth >= 1000);
}

function scrollAnimate(ele, target, time){
  clearTimeout(TEMP);
  TEMP = null;
  var end = target.offsetTop - 50;
  var star = right.scrollTop;
  var step = (end - star) / (time / 10);
  function animate() {
    TEMP = setTimeout(function(){
      if(Math.abs(end - right.scrollTop) > Math.abs(step)){
        right.scrollTop = right.scrollTop + step;
        animate();
      } else {
        right.scrollTop = end;
        clearTimeout(TEMP);
      }
    },10);
  }
  animate();
}