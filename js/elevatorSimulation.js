var content = document.getElementsByClassName('content')[0];
var control = content.getElementsByClassName('control')[0];
var inside = control.getElementsByClassName('inside')[0];
var outside = control.getElementsByClassName('outside')[0];
var dataShow = control.getElementsByClassName('dataShow')[0];
var dataSpan = dataShow.getElementsByTagName('span');
var outsideFloor = outside.getElementsByClassName('floor')[0];
var outsideUpAndDown = outside.getElementsByClassName('upAndDown')[0];

var elevator = document.getElementById('elevator');
var rect = elevator.getElementsByTagName('rect')[0];
var Height;

var RUN = null;

var data = {
  current: 0, //当前位置
  v: 1,
  h: 0,
  way: 0, //0静止，1下，2上
  upTarget: [], //上升时目标
  downTarget: [], //下降时目标
  upAndDownTarget: [], //二维数组，存储外侧按钮
  upAndDownTEMP: 1, //目前外侧按钮的楼层
  DTED: [0, 10, 20, 30, 40, 50, 60, 70], //每层高度
}

window.onload = function () {
  for (var i = 0; i < 8; i++) {
    data.upTarget[i] = false;
    data.downTarget[i] = false;
    data.upAndDownTarget[i] = [false,false]; //[下降，上升]
  }
  Height = data.DTED[length - 1] - data.DTED[0];
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

addEvent (outsideFloor, 'click', function (e) {
  var e = e || window.event;
  var target = e.target;
  var span = outsideFloor.getElementsByTagName('span');
  if (target.nodeName.toUpperCase() === 'SPAN') {
    for (var i = 0; i < 8; i++) {
      span[i].removeClass('choose');
    }
    target.addClass('choose');
    data.upAndDownTEMP = parseInt(target.innerHTML) - 1;
  }
});

addEvent (outsideUpAndDown, 'click', function (e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'I') {
    target = target.parentNode;
  }
  if (target.nodeName.toUpperCase() === 'SPAN') {
    if (target.hasClass('down')) {
      data.upAndDownTarget[data.upAndDownTEMP][0] = true;
      data.downTarget[data.upAndDownTEMP] = true;
    }
    if (target.hasClass('up')) {
      data.upAndDownTarget[data.upAndDownTEMP][1] = true;
      data.upTarget[data.upAndDownTEMP] = true;
    }
    if (data.way === 0) {
      addData(data.upAndDownTEMP);
    }
    move();
  }
});

function addData (target) {
  if (data.way === 0) {
    if (data.current < target) {
      data.way = 2;
    } else {
      data.way = 1;
    }
  }
  move();
}

function move () {
  if (data.way === 2) {
    clearTimeout(RUN);
    RUN = null;
    if (nextTarget(2)) {
      moveUp(nextTarget(2));
    } else {
      moveUp(nextTargetMax(2));
    }
  }

  if (data.way === 1) {
    clearTimeout(RUN);
    RUN = null;
    if (nextTarget(1)) {
      moveDown(nextTarget(1));
    } else {
      moveDown(nextTargetMax(1));
    }
  }

  if (data.way === 0) {
    RUN = null;
    if (data.current != 0) {
      RUN = setTimeout(function () {
        clearTimeout(RUN);
        RUN = null;
        moveDown(0);
      }, 5000);
    }

  }

  function moveUp (target) {
    console.log('UP');
    RUN = setTimeout(function () {
      data.h += data.v;
      dataSpan[3].innerHTML = data.h;
      if (data.h < data.DTED[target]) {
        currentChangedByHeight();
        dataSpan[0].innerHTML = parseInt(data.current) + 1;
        moveUp(target);
      }
      if (data.h === data.DTED[target]) {
        data.upTarget[target] = false;
        data.upAndDownTarget[target][1] = false;
        data.current = target;
        if (!nextTargetMax(2)) {
          data.downTarget[target] = false;
        }
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
          move ();
        }
      }
    }, 100);
  }

  function moveDown (target) {
    console.log('DOWN');
    RUN = setTimeout(function () {
      data.h -= data.v;
      dataSpan[3].innerHTML = data.h;
      if (data.h > data.DTED[target]) {
        currentChangedByHeight();
        dataSpan[0].innerHTML = parseInt(data.current) + 1;
        moveDown(target);
      }
      if (data.h === data.DTED[target]) {
        data.downTarget[target] = false;
        data.upAndDownTarget[target][0] = false;
        data.current = target;
        if (!nextTargetMax(1)) {
          data.upTarget[target] = false;
        }
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
          move ();
        }
      }
    }, 100);
  }

  function currentChangedByHeight () {
    for (var i = 7; i >= 0; i--) {
      if (data.h >= data.DTED[i]) {
        data.current = i;
        break;
      }
    }
    console.log(rect.setAttribute('y','80'));
  }
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

function nextTargetMax (way) {
  if (way === 2) {
    for (var i = 7; i > data.current; i--) {
      if (data.downTarget[i] === true) {
        return i;
      }
    }
    return false;
  } else if (way === 1) {
    for (var i = 0; i < data.current; i++) {
      if (data.upTarget[i] === true) {
        return i;
      };
    }
    return false;
  }
}

//样式事件
addEvent (inside, 'mouseover', function (e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'SPAN') {
    target.addClass('hover');
  }
  if (target.nodeName.toUpperCase() === 'I') {
    target.parentNode.addClass('hover');
  }
});

//样式事件
addEvent (inside, 'mouseout', function (e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'SPAN') {
    target.removeClass('hover');
  }
  if (target.nodeName.toUpperCase() === 'I') {
    target.parentNode.removeClass('hover');
  }
});

//样式事件
addEvent (outside, 'mouseover', function (e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'SPAN') {
    target.addClass('hover');
  }
  if (target.nodeName.toUpperCase() === 'I') {
    target.parentNode.addClass('hover');
  }
});

//样式事件
addEvent (outside, 'mouseout', function (e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'SPAN') {
    target.removeClass('hover');
  }
  if (target.nodeName.toUpperCase() === 'I') {
    target.parentNode.removeClass('hover');
  }
});

Object.prototype.hasClass = function (cls) {
  return this.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

Object.prototype.addClass = function (cls) {
  if (!this.hasClass(cls)) this.className += " " + cls;
};

Object.prototype.removeClass = function (cls) {  
  if (this.hasClass(cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    this.className = this.className.replace(reg, ' ');
    this.className = this.className.replace(/\s+/, ' ');
  }
};