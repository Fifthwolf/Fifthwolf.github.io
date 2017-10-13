var star = document.getElementById('star');
var eGo = document.getElementsByClassName('go')[0];
var rightDiv = right.getElementsByTagName('div');
var demo = document.getElementById('demo');
var demoUl = demo.getElementsByTagName('ul')[0];
var demoLis = demoUl.getElementsByTagName('li');
var TEMP;

useElementToAppropriate(star, document);

if(getCookie('main')){
  star.style.display = 'none';
  main.style.display = judgeWidth() ? 'flex' : 'block';
  main.style.transform = 'rotateY(0deg)';
}

window.onload = function () {
  delayedLoadingPublicPictures ('');
  star.getElementsByClassName('image')[0].style.backgroundImage = 'url("image/TX.png")'; 
  var img = document.getElementsByTagName('img');
  for (var i = 0, len = img.length; i < len; i++) {
    img[i].setAttribute('src', img[i].getAttribute('data-src'));
  }
  useDEMOUlMargin(demoUl, demoLis, 10);
}

window.onresize = function () {
  adjustmentWindow();
  useDEMOUlMargin(demoUl, demoLis, 10);
  useElementToAppropriate(star, document);
}

addEvent(own, 'click', function (e) {
  var target = e.target || e.srcElement;
  if (judgeWidth()) {
    e = myfn(e);
  }
  for (var i = 0, length = ownLi.length; i < length; i++) {
    try{
      while (target.tagName.toUpperCase() != 'LI'){
        target = target.parentNode;
      }
    } catch(e) {
    }
    if (target == ownLi[i]){
      scrollAnimate(right, rightDiv[i], 150);
      break;
    }
  }
});

addEvent(eGo, 'click', function () {
  setCookie('main', 'flex', 10);
  var deg = 0;
  useDEMOUlMargin(demoUl, demoLis, 10);
  if (judgeWidth()) {
    main.style.display = 'flex';
  }
  function disappear () {
    deg += 5;
    setTimeout(function(){
      star.style.transform = 'rotateY(' + deg + 'deg)';
      if (deg < 90) {
        disappear();
      } else {
        star.style.display = 'none';
        deg = 270;
        appear();
      }
    },20);
  }
  function appear () {
    deg += 5;
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

function scrollAnimate (ele, target, time) {
  clearTimeout(TEMP);
  TEMP = null;
  var end = target.offsetTop - 50;
  var star = right.scrollTop;
  var step = (end - star) / (time / 10);
  var tempEnd;
  function animate() {
    TEMP = setTimeout(function(){
      if(Math.abs(end - right.scrollTop) > Math.abs(step)){
        right.scrollTop = right.scrollTop + step;
        if(tempEnd == right.scrollTop){
          clearTimeout(TEMP);
          return;
        }
        tempEnd = right.scrollTop;
        animate();
      } else {
        right.scrollTop = end;
        clearTimeout(TEMP);
      }
    },10);
  }
  animate();
}

function useDEMOUlMargin (parentElement, childElements, childElementMinMargin) {
  var UlWidth = demoUl.offsetWidth;
  var LiWidth = childElements[0].offsetWidth;
  var length = Math.floor(UlWidth / (LiWidth + 20));
  var marginRight = Math.floor((UlWidth - length  * (LiWidth + 4)) / (length * 2));
  for (var i = 0; i < childElements.length; i++) {
    childElements[i].style.margin = '10px ' + marginRight + 'px 30px';
  }
}

function myfn (e) {
  return window.event? window.event.returnValue = false : e.preventDefault();
}