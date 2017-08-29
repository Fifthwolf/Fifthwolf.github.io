var content = document.getElementsByClassName('content')[0];

window.onresize = function () {
  //adjustmentWindow();
  useElementToAppropriate(content, right);
}

var button_generate = document.getElementById("generate");
var button_reset = document.getElementById("reset");
var input_basic = document.getElementById("basic");
var input_special = document.getElementById("special");
var input_max = document.getElementById("max");
var list = document.getElementsByClassName("list")[0];

button_generate.onclick = function(){
  var basic = parseInt(input_basic.value);
  var special = parseInt(input_special.value);
  var max = parseInt(input_max.value);
  if(max<100&&max>=(basic+special)&&basic<=10&&basic>0&&(special==0||special==1)){
    var lottery = generate(basic,special,max);
    addNumber(lottery,special);
  }else{
    list.innerHTML += '输入了不符合条件的数据，请重新输入';
  }
}

button_reset.onclick=function(){
  list.innerHTML = '';
}

function generate (basic, special, max) {
  var total = basic + special;
  var lottery = new Array(total);
  for(var i=0;i<total;i++){
    lottery[i]=Math.floor(Math.random()*max+1);
    if(i>0){
      for(var j=0;j<i;j++){
        if(lottery[i]==lottery[j]){
          i--;
          break;
        }
      }
    }
  }

  if(!special){
    lottery.sort(function(a,b){
      return a-b;
    });
  }else{
    var temp = lottery[lottery.length-1];
    lottery[lottery.length-1] = undefined;
    lottery.sort(function(a,b){
      return a-b;
    });
    lottery[lottery.length-1] = temp;
  }
  return lottery;
}

function addNumber (lottery, special) {
  var temp = '';
  if(!special){
    for (var i = 0; i < lottery.length ; i++) {
      temp += '<span>' + lottery[i] + '</span>';
    }
  }else{
    for (var i = 0; i < lottery.length - 1 ; i++) {
      temp += '<span>' + lottery[i] + '</span>';
    }
    temp += '<span class="special">' + lottery[lottery.length-1] + '</span>';
  }
  temp = '<div class="num">' + temp + '</div>';
  list.innerHTML += temp;
  var numDiv = list.getElementsByClassName('num');
  numDiv = numDiv[numDiv.length - 1];
  var numSpan = numDiv.getElementsByTagName('span');
  showNumber(numDiv, numSpan);
}

function showNumber (numDiv, numSpan) {
  console.log();
  var i = 0, len = numSpan.length;
  function show () {
    temp = setTimeout(function () {
      if (i < len) {
        numSpan[i].style.display = 'inline-block';
        i++;
        show ();
      } else {
        //
      }
    }, 50);
  }
  show();
}