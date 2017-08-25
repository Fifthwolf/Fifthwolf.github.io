var star = document.getElementById('star');
var eGo = document.getElementsByClassName('go')[0];
var main = document.getElementById('main');

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

addEvent(eGo , 'click' , function(){
  var deg = 0;
  var disappear = function(){
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
    },20);
  }
  var appear = function(){
    deg += 3;
    setTimeout(function(){
      main.style.transform = 'rotateY(' + deg + 'deg)';
      if (deg < 360) {
        appear();
      } else {
        main.style.transform = 'rotateY(0deg)';
      }
    },20);
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
