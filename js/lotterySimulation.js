var content = document.getElementsByClassName('content')[0];
var quit = document.getElementsByClassName('quit')[0];

window.onresize = function () {
  useElementToAppropriate(content, right);
}

window.onload = function () {
  if (!judgeWidth()) {
    useListHeightSuit (content, right);
  }
}

var button_generate = document.getElementById("generate");
var button_reset = document.getElementById("reset");
var input_basic = document.getElementById("basic");
var input_special = document.getElementById("special");
var input_max = document.getElementById("max");
var list = document.getElementsByClassName("list")[0];

button_generate.onclick = function(){
  var basic = Number(input_basic.value);
  var special = Number(input_special.value);
  var max = Number(input_max.value);
  if (judgedNumber(basic, special, max)) {
    var lottery = generate(basic, special, max);
    addNumber(lottery, special);
  } else {
    list.innerHTML += '输入了不符合条件的数据，请重新输入<br/>';
  }
}

button_reset.onclick = function () {
  list.innerHTML = '';
}

function judgedNumber (basic, special, max) {
  if (!_isInteger(basic) || !_isInteger(special) || !_isInteger(max)) {
    return false;
  } else if (max > 100) {
    return false;
  } else if (basic <= 0 || basic > 10) {
    return false;
  } else if (!(special == 0 || special == 1)) {
    return false;
  } else if (max < basic + special) {
    return false;
  } else {
    return true;
  }

  function _isInteger (obj) {
    return typeof obj === 'number' && obj % 1 === 0;
  }
}

function useListHeightSuit (element, parent) {
  var parentHeight = parent.offsetHeight;
  element.style.maxHeight = parentHeight - 250 + 'px';
}

function generate (basic, special, max) {
  var total = basic + special;
  var lottery = new Array(total);
  for(var i=0; i < total; i++){
    lottery[i] = Math.floor(Math.random()*max+1);
    if (i > 0) {
      for(var j=0; j < i; j++) {
        if(lottery[i] == lottery[j]) {
          i--;
          break;
        }
      }
    }
  }

  if (!special) {
    lottery.sort(function (a,b) {
      return a - b;
    });
  } else {
    var temp = lottery[lottery.length-1];
    lottery[lottery.length-1] = undefined;
    lottery.sort(function (a,b) {
      return a-b;
    });
    lottery[lottery.length-1] = temp;
  }
  return lottery;
}

//生成函数，生成球的HTML代码
function addNumber (lottery, special) {
  var div = document.createElement('div');
  div.setAttribute("class","num");
  list.appendChild(div);
  var temp = [];
  if (!special) {
    for (var i = 0; i < lottery.length ; i++) {
      create();
    }
  } else {
    for (var i = 0; i < lottery.length - 1 ; i++) {
      create();
    }
    create();
    temp[i].setAttribute("class","special")
  }

  function create () {
    var spanText = document.createTextNode(lottery[i]);
    temp[i] = document.createElement('span');
    temp[i].appendChild(spanText);
    div.appendChild(temp[i]);
  }

  var numDivs = document.getElementsByClassName('num');
  var numSpans = numDivs[numDivs.length - 1].getElementsByTagName('span');
  showNumber(numSpans);
}

//依次将球显示出来
function showNumber(numSpans) {
  var i = 0, len = numSpans.length;
  function shows () {
    setTimeout(function () {
      if (i < len) {
        numSpans[i].style.display = 'inline-block';
        i++;
        shows ();
      }
    }, 100);
  }
  shows();
}