var content = right.getElementsByClassName("content")[0],
year = document.getElementById("year"),
month = document.getElementById("month"),
tableBody = document.getElementById("calendar-table").getElementsByTagName("tbody")[0],
tdDays = tableBody.getElementsByTagName("td"),
temp = '';

for (var i = 2000; i < 2050; i++) {
  temp += '<option value="' + i + '">' + i + '</option>'
}
year.innerHTML=temp;
temp='';

for (var i = 1; i <= 12; i++) {
  temp += '<option value="' + i + '">' + i + '</option>'
}
month.innerHTML=temp;

year.onchange=function(){
  dayList();
}

month.onchange=function(){
  dayList();
}

window.onload=function(){
  var now = new Date();
  dayList(now);
  var currentYear = getSelectOption(year, now.getFullYear());
  var currentMonth = getSelectOption(month, now.getMonth()+1);
  var currentDay = getSelectDays(tdDays);
  currentYear.setAttribute('selected','true');
  currentMonth.setAttribute('selected','true');
  useElementToAppropriate(content, right);
}

window.onresize = function () {
  adjustmentWindow();
  useElementToAppropriate(content, right);
}

addEvent(tableBody, 'mouseover', function (e) {
  e.target.setAttribute('class','choose');
});

addEvent(tableBody, 'mouseout', function (e) {
  e.target.removeAttribute('class');
  getSelectDays(tdDays);
});

function dayList(date){
  var yearValue,monthValue;
  if(!date){
    var index = year.selectedIndex;
    yearValue = year.options[index].value;
    index = month.selectedIndex;
    monthValue = month.options[index].value;
    date = new Date(yearValue + '//' + monthValue + '//01');
  }else{
    yearValue = date.getFullYear();
    monthValue = date.getMonth() + 1 ;
    date.setDate('1');
  }
  
  var temp='';
  tableBody.innerHTML='';
  
  var listData = {
    Leap:dayAttr(yearValue,monthValue).Leap,
    days:dayAttr(yearValue,monthValue).days,
    starWeek:date.getDay()
  }
  tempStarWeek = listData.starWeek;

  //建立表格
  var tempWeek;
  for (var i = 1 ; i <= listData.days ; i++) {
    while(tempStarWeek){
      temp += '<td></td>';
      tempStarWeek--;
    }
    temp += '<td>' + i + '</td>';
    tempWeek--;
    if (( i + listData.starWeek )%7 == 0 && i != listData.days) {
      temp += '</tr><tr>';
      tempWeek = 7;
    }
  }
  //表格补位
  while(tempWeek%7){
    temp += '<td></td>';
    tempWeek--;
  }
  temp += '</tr>';
  console.log(temp);
  tableBody.innerHTML += temp;
  //content自适应高度
  useContentHeight();
}

//判断平润年与每个月的天数
function dayAttr(year,month){
  var Leap,
  days;
  if(year%4!=0){
    Leap = 0;
  }else{
    if(year%100==0&&year%400!=0){
      Leap = 0;
    }else{
      Leap = 1;
    }
  }

  switch(parseInt(month)){
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:days = 31;break;
    case 2:if(Leap == 1){
      days = 29;break;
    }else{
      days = 28;break;
    }
    default:days = 30;break;
  }
  return {'Leap':Leap,'days':days};
}

//寻找对应值的元素
function getSelectOption (parent,value) {
  var options = parent.getElementsByTagName("option");
  for (var i = 0; i < options.length; i++) {
    if(options[i].value == value ){
      return options[i];
    }
  }
}

function getSelectDays (parent,value) {
  var value = new Date().getDate();
  for (var i = 0; i < parent.length; i++) {
    if(parent[i].innerHTML == value ){
      parent[i].setAttribute('class','choose');
      return 0;
    }
  }
}

function useContentHeight () {
  var trs = content.getElementsByTagName('tr');
  console.log(trs.length);
  content.style.height = trs.length * 50 + 65 + 'px';
}