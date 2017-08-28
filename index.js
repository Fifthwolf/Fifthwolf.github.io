var star = document.getElementById('star');
var eGo = document.getElementsByClassName('go')[0];
var right = main.getElementsByClassName('right')[0];
var rightDiv = right.getElementsByTagName('div');
var demo = document.getElementById('demo');
var demoUl = demo.getElementsByTagName('ul')[0];
var demoLis = demoUl.getElementsByTagName('li');
var TEMP;

useDEMOUlMargin(demoUl, demoLis, 10);

addEvent(own, 'click', function(e){
  var target = e.target || e.srcElement;
  for (var i = 0, length = ownLi.length; i < length; i++) {
    try{
      while (target.tagName.toUpperCase() != 'LI'){
        target = target.parentNode;
      }
    }catch(e){
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
        useDEMOUlMargin(demoUl, demoLis, 10);
      }
    },10);
  }
  disappear();
});

function indexOnresize () {
  useDEMOUlMargin(demoUl, demoLis, 10);
}

function useElementToAppropriate (element) {
  var height = element.offsetHeight;
  var screenHeight = document.documentElement.clientHeight||document.body.clientHeight;
  var top = (screenHeight - height)/2;
  element.style.marginTop = top - 50 +'px';
}

function indexUseMainAppropriate () {
  useDEMOUlMargin(demoUl, demoLis, 10);
}

function useMainAppropriate (element) {
  publicUseMainAppropriate(element);
  useDEMOUlMargin(demoUl, demoLis, 10);
}

function scrollAnimate(ele, target, time) {
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

function useDEMOUlMargin(parentElement, childElements, childElementMinMargin) {
  var UlWidth = demoUl.offsetWidth;
  var LiWidth = childElements[0].offsetWidth;
  var length = parseInt(UlWidth / LiWidth);
  var marginRight = Math.floor((UlWidth -  length  * (LiWidth + length + 2)) / (length * 2));
  for (var i = 0; i < childElements.length; i++) {
    childElements[i].style.margin = `10px ${marginRight}px 30px`;
  }
}