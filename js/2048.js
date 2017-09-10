var content = document.getElementsByClassName('content')[0];
var cell = content.getElementsByClassName('cell')[0];
var changeButton = document.getElementById('generate');

window.onload = function () {
  createCell(4);
}

function createCell (length) {
  cell.innerHTML = '';
  var row = new Array(length);
  for (var i = 0; i < length; i++) {
    row[i] = document.createElement('div');
    for (var j = 0; j < length; j++) {
      var col = new Array(length);
      col[j] = document.createElement('span');
      row[i].appendChild(col[j]);
    }
    cell.appendChild(row[i]);
  }
  cell.style.width = length * 60 + 'px';
}

addEvent (changeButton, 'click', function () {
  var length = Number(document.getElementById('length').value);
  if(length >= 4 && length <= 8 && _isInteger(length)){
    createCell(length);
  }
  function _isInteger (obj) {
    return typeof obj === 'number' && obj % 1 === 0;
  }
});

