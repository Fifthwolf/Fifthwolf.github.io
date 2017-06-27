document.onselectstart = new Function('event.returnValue=false;');
var mainDiv=document.getElementById("main");
var boxDiv=document.getElementById("box");
var img2=document.getElementById("img2");
var buttonDiv=mainDiv.getElementsByTagName("div");
window.onload=function(){
	changeContentHeight();
	var show=document.getElementById("show");
	var showPic=document.createElement("img");
	showPic.src=img2.src;
	showPic.id="showPi";
	show.appendChild(showPic);
	for(var i=0;i<buttonDiv.length;i++){
		buttonDiv[i].index=i;
		buttonDiv[i].onmousedown=function(e){
			e.stopPropagation();
			var mainRight=getPosition(mainDiv).left+mainDiv.offsetWidth;
			var mainBottom=getPosition(mainDiv).top+mainDiv.offsetHeight;
			move(this.index,mainRight,mainBottom);
		}
	}
	mainDiv.onmousedown=function(e){
		var disX = e.clientX - getPosition(mainDiv).left;
		var disY = e.clientY - getPosition(mainDiv).top;
		move(8,disX,disY);
	}
	preview({"top":0,"right":200,"bottom":200,"left":0});
}

function move(index,limitX,limitY){
	document.onmousemove=function(e){
		switch(index){
			case 0: leftMove(e,limitX);upMove(e,limitY);break;
			case 1: upMove(e,limitY);break;
			case 2: rightMove(e);upMove(e,limitY);break;
			case 3: rightMove(e);break;
			case 4: downMove(e);rightMove(e);break;
			case 5: downMove(e);break;
			case 6: leftMove(e,limitX);downMove(e);break;
			case 7: leftMove(e,limitX);break;
			case 8: allMove(e,limitX,limitY);break;
		}
		setChoice();
	}
	document.onmouseup=function(){
		document.onmousemove=null;
		document.onmouseup=null;
	}
}

//左边拖动
function leftMove(e,limitX){
	var x = e.clientX;
	x = moveLimet(x,getPosition(img2).left,limitX - 40);
	var width = mainDiv.offsetWidth-2;
	var mainX = getPosition(mainDiv).left;
	var addWidth = mainX - x;
	mainDiv.style.width = (width + addWidth) + "px";
	mainDiv.style.left = mainDiv.offsetLeft - mainX + x + "px";
}

//右边拖动
function rightMove(e){
	var x = e.clientX;
	x = moveLimet(x,getPosition(mainDiv).left + 40,getPosition(img2).left + img2.offsetWidth);
	var width=mainDiv.offsetWidth-2;
	var mainX=getPosition(mainDiv).left;
	var addWidth = x - width - mainX;
	mainDiv.style.width = (width + addWidth) + "px";
}

//上边拖动
function upMove(e,limitY){
	var y = e.clientY;
	y=moveLimet(y,getPosition(img2).top,limitY - 40);
	var height = mainDiv.offsetHeight-2;
	var mainY = getPosition(mainDiv).top;
	var addHeight = mainY - y;
	mainDiv.style.height = (height + addHeight) + "px";
	mainDiv.style.top = mainDiv.offsetTop - mainY + y + "px";
}

//下边拖动
function downMove(e){
	var y = e.clientY;
	y = moveLimet(y,getPosition(mainDiv).top+40,getPosition(img2).top + img2.offsetHeight);
	var height=mainDiv.offsetHeight-2;
	var mainY=getPosition(mainDiv).top;
	var addHeight = y - height - mainY;
	mainDiv.style.height = (height + addHeight) + "px";
}

//移动
function allMove(e,disX,disY){
	var addX = e.clientX - disX - getPosition(boxDiv).left;
	var addY = e.clientY - disY - getPosition(boxDiv).top;
	mainDiv.style.left = moveLimet(addX,0,img2.offsetWidth-mainDiv.offsetWidth) + "px";
	mainDiv.style.top = moveLimet(addY,0,img2.offsetHeight-mainDiv.offsetHeight) + "px";
}

//移动限制范围
function moveLimet(n,min,max){
	if(n<min){
		n=min;
	}else if(n>max){
		n=max;
	}
	return n;
}

//获取元素的绝对位置
function getPosition(node){
	var left=node.offsetLeft;
	var top=node.offsetTop;
	current = node.offsetParent;
	while(current){
		left += current.offsetLeft;
		top += current.offsetTop;
		current = current.offsetParent;
	}
	return {"left":left,"top":top};
}

//设置选择区域可见
function setChoice(){
	var top = mainDiv.offsetTop;
	var right = mainDiv.offsetLeft + mainDiv.offsetWidth;
	var bottom = mainDiv.offsetTop + mainDiv.offsetHeight;
	var left = mainDiv.offsetLeft;
	img2.style.clip = "rect("+top+"px,"+right+"px,"+bottom+"px,"+left+"px)";
	preview({"top":top,"right":right,"bottom":bottom,"left":left});
	show.style.right= 50+mainDiv.offsetWidth+'px';
}

//预览图
function preview(view){
	var previewImg = document.getElementById("showPi");
	previewImg.style.top = -view.top + "px";
	previewImg.style.left = -view.left + "px";
	previewImg.style.clip = "rect("+view.top+"px,"+view.right+"px,"+view.bottom+"px,"+view.left+"px)";
}