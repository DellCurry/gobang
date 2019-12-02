document.write("<script type='text/javascript' src='/js/socket.io.js'></script>");
const num = 19
const edge = 20
const interval = 35
const wid = interval*(num-1)+2*edge
var onMove = (side == 'black')? 1 :-1
var beginGame = (roomplayer[0]=='1'&&roomplayer[1]=='1')?1:-1
var board = []
var moveNum = 0

window.onload=function(){
	var width = document.getElementById("canvas")
	var height = document.getElementById("canvas")
	width.width = wid.toString()
	height.height = wid.toString()
	var socket = io();
	this.load(side)
	socket.on('connect', function () {
		board=[]
		moveNum=0
		board=generateBoard(num)
		socket.emit('join',roomID+side);
	});
	socket.on('roomplayer', function (oppoaction) {
		if (oppoaction=='join'){
			begin()
			beginGame =1
		}
		else if(oppoaction=='leave'){
			alert("oppo leave")
			beginGame = -1
		}
	});
	$('#canvas').click(function(event){
		if (onMove==1){
			var obj = locate(event.offsetX,event.offsetY)
			if (board[obj.Y][obj.X]==0 && beginGame==1){
				drawMove(obj.realX,obj.realY)
				board[obj.Y][obj.X] = ++moveNum
				socket.emit('move',obj.X,obj.Y)
			}
		}
		
	})
	socket.on('oppomove',function(opposide,X,Y){
		if (opposide != side){
			oppoMove(opposide,X,Y)
			board[Y][X] = ++moveNum
		}
	})

	socket.on("gameover",function(winside){
		if (winside == side)
			alert("you win")
		else
			alert("you loss")

	})
	
}

function locate(offsetX,offsetY){
	var realX,realY,X,Y
	for (var j=0;j<num;j++){
		if (Math.abs(offsetX-edge-(j*interval))<interval/2)
		{
			realX= edge+j*interval;
			X=j;
		}
		if (Math.abs(offsetY-edge-(j*interval))<interval/2)
		{
			realY= edge+j*interval;
			Y=j;
		}
	}
	return {realX:realX,realY:realY,X:X,Y:Y}
}


function drawMove(realX,realY){
	const canv =document.getElementById("canvas");
	var ctx=canv.getContext("2d");
	ctx.beginPath();
	ctx.globalAlpha =1;
	ctx.arc(realX,realY,interval*0.4,0,Math.PI*2,false);
	ctx.fillStyle=side;
	ctx.fill();
	onMove = -onMove;
	//this.socket.emit("move",roomID,side,X,Y)
}

function oppoMove(side,X,Y){
	const canv =document.getElementById("canvas");
	var ctx=canv.getContext("2d");
	ctx.beginPath();
	var realX = edge+X*interval
	var realY = edge+Y*interval
	ctx.globalAlpha =1;
	ctx.arc(realX,realY,interval*0.4,0,Math.PI*2,false);
	ctx.fillStyle=side;
	ctx.fill();
	onMove = -onMove;
}
function load(){
	const canv =document.getElementById("canvas");
	var ctx=canv.getContext("2d");
	img = new Image();  
	img.src = "../img/background.jpg";  
		
	img.onload = function() {
	ctx.globalAlpha =0.8;
	ctx.drawImage(img, 0, 0,wid,wid);
	ctx.stroke();
	ctx.save();
	}
	ctx.beginPath();
	ctx.globalAlpha =1;
	ctx.lineWidth = 2;
	for (var i=0;i<num;i++){
		ctx.moveTo(edge+i*interval,edge);
		ctx.lineTo(edge+i*interval,edge+(num-1)*interval);
		ctx.moveTo(edge,edge+i*interval);
		ctx.lineTo(edge+(num-1)*interval,edge+i*interval);
	}
	ctx.stroke();
	if (this.beginGame ==1) this.begin()
}

function generateBoard(num){
	var board = new Array(num)
	for (let i=0;i<num;++i){
		board[i]=new Array(num)
		for (let j=0;j<num;++j){
			board[i][j]=0
		}
	}
	return board
}

function begin(){
	alert("game begins")
}

/*window.onbeforeunload=function(e){ 
    　　var e = window.event||e;  
　　e.returnValue=("ddd");
};*/
	
