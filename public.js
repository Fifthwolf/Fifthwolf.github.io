var main = document.getElementById('main');
var own = main.getElementsByClassName('own')[0];
var ownLi = own.getElementsByTagName('li');
var left = main.getElementsByClassName('left')[0];
var right = main.getElementsByClassName('right')[0];
var desc = right.getElementsByClassName('desc')[0];

adjustmentWindow();

window.onresize = function () {
  adjustmentWindow();
}

function adjustmentWindow () {
  if (judgeWidth()) {
    main.style.display = 'flex';
    publicUseMainAppropriate(main);
  }
  if (!judgeWidth()) {
    main.style.display = 'block';
    useElementHeightSuit(right, left, main);
  }
}

function useElementHeightSuit (element, previous, parent) {
  var screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
  var previousHeight = previous.offsetHeight;
  //120为right的paddingTop与paddingBottom值之和
  element.style.minHeight = screenHeight - previousHeight - 120 + 'px';
}

function useElementToAppropriate (element, parent) {
  var height = element.offsetHeight;
  var screenHeight;
  if (parent == document) {
    screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
  } else {
    screenHeight = parent.offsetHeight;
  }
  var top = (screenHeight - height) / 2;
  element.style.marginTop = Math.max(top - screenHeight / 20, 0) + 'px';
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
    element.attachEvent('on' + type, handler);  
  } else {  
    element['on' + type] = handler;  
  }  
}

function removeEvent (element, type, handler) { 
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false); 
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler); 
  } else {
    element['on' + type] = null;
  }
};  

function setCookie (name, value, time) {
  var Minutes = time;
  var exp = new Date();
  exp.setTime(exp.getTime() + Minutes * 60 * 1000);
  document.cookie = name + "=" + decodeURI(value) + ";expires=" + exp.toGMTString();
}

function getCookie (name) {
  var arr,reg=new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg);
  if(arr = document.cookie.match(reg)){
    return decodeURIComponent(arr[2]);
  } else {
    return null;
  }
}
