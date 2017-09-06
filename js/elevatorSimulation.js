var content = document.getElementsByClassName('content')[0];
var control = content.getElementsByClassName('control')[0];
var inside = control.getElementsByClassName('inside')[0];
var outside = control.getElementsByClassName('outside')[0];
var dataShow = control.getElementsByClassName('dataShow')[0];
var dataSpan = dataShow.getElementsByTagName('span');
//var nextTarget = 0;
var run = null;

var data = {
  current: 0, //当前位置
  v: 2,
  h: 0,
  way: 0, //0静止，1下，2上
  upTarget: [], //上升时目标
  downTarget: [], //下降时目标
  DTED: [0, 10, 20, 30, 40, 50, 60, 70], //每层高度
}

window.onload = function () {
  for (var i = 0; i < 8; i++) {
    data.upTarget[i] = false;
    data.downTarget[i] = false;
  }
}

addEvent (inside, 'click', function (e) {
  var e = e || window.event;
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    var target = e.target.innerHTML - 1;
    if (data.current < target) {
      data.upTarget[target] = true;
    } else {
      data.downTarget[target] = true;
    }
    addData(target);
  }
});

addEvent (outside, 'click', function (e) {
  var e = e || window.event
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    //e.target.setAttribute('class', 'hover');
  }
});

function addData (target) {
  if (data.way === 0){
    if (data.current < target) {
      data.way = 2;
    } else {
      data.way = 1;
    }
  }
  move ();
}

function move () {
  if (data.way === 2) {
    function moveUp (target) {
      run = setTimeout(function () {
        data.h += data.v;
        dataSpan[3].innerHTML = data.h;
        if (data.h < data.DTED[target]) {
          currentChangedByHeight();
          dataSpan[0].innerHTML = parseInt(data.current) + 1;
          moveUp(target);
        }
        if (data.h === data.DTED[target]) {
          data.upTarget[target] = false;
          data.current = target;
          currentChangedByHeight();
          dataSpan[0].innerHTML = parseInt(data.current) + 1;
          if (nextTarget(2)) {
            setTimeout(function () {
              moveUp(nextTarget(2));
            }, 2000);
          } else if (nextTarget(1)) {
            setTimeout(function () {
              data.way = 1;
              move ();
            }, 2000);
          } else {
            data.way = 0;
          }
        }
      }, 200);
    }
    clearTimeout(run);
    run = null;
    moveUp(nextTarget(2));
  }

  if (data.way === 1) {
    function moveDown (target) {
      run = setTimeout(function () {
        data.h -= data.v;
        dataSpan[3].innerHTML = data.h;
        if (data.h > data.DTED[target]) {
          currentChangedByHeight();
          dataSpan[0].innerHTML = parseInt(data.current) + 1;
          moveDown(target);
        }
        if (data.h === data.DTED[target]) {
          data.downTarget[target] = false;
          data.current = target;
          currentChangedByHeight();
          dataSpan[0].innerHTML = parseInt(data.current) + 1;
          if (nextTarget(1)) {
            setTimeout(function () {
              moveDown(nextTarget(1));
            }, 2000);
          } else if (nextTarget(2)) {
            setTimeout(function () {
              data.way = 2;
              move ();
            }, 2000);
          } else {
            data.way = 0;
          }
        }
      }, 200);
    }
    clearTimeout(run);
    run = null;
    moveDown(nextTarget(1));
  }

  function nextTarget (way) {
    if (way === 2) {
      for (var i = data.current; i < 8; i++) {
        if (data.upTarget[i] === true) {
          return i;
        }
      }
      return false;
    } else if (way === 1) {
      for (var i = data.current; i >= 0; i--) {
        if (data.downTarget[i] === true) {
          return i;
        };
      }
      return false;
    }
  }

  function currentChangedByHeight () {
    for (var i = 7; i >= 0; i--) {
      if (data.h >= data.DTED[i]) {
        data.current = i;
        break;
      }
    }
  }
}

//样式事件
addEvent (inside, 'mouseover', function (e) {
  var e = e || window.event
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    e.target.setAttribute('class', 'hover');
  }
});

//样式事件
addEvent (inside, 'mouseout', function (e) {
  var e = e || window.event
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    e.target.removeAttribute('class', 'hover');
  }
});

//样式事件
addEvent (outside, 'mouseover', function (e) {
  var e = e || window.event
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    e.target.setAttribute('class', 'hover');
  }
});

//样式事件
addEvent (outside, 'mouseout', function (e) {
  var e = e || window.event
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    e.target.removeAttribute('class', 'hover');
  }
});
