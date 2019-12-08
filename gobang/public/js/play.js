document.write("<script type='text/javascript' src='/js/socket.io.js'></script>");
const num = 19
const edge = 20
const interval = 40
const wid = interval*(num-1)+2*edge

var opposide = (side == 'black')? 'white':'black'
var onMove
var beginGame
var board
var moveNum
var curOppMove

window.onload=function(){
	this.initState()
	var width = document.getElementById("canvas")
	var height = document.getElementById("canvas")
	width.width = wid.toString()
	height.height = wid.toString()
	var socket = io();
	this.load(side)
	this.begin()
	socket.on('connect', function () {
		socket.emit('join',roomID+side);
	});
	socket.on('roomplayer', function (oppoaction) {
		if (oppoaction=='join'){
			if (opposide=='black')
				roomplayer[0]='1'
			else
				roomplayer[1]='1'
			beginGame=1
			begin()
		}
		else if(oppoaction=='leave'){
			if (opposide=='black')
				roomplayer[0]='0'
			else
				roomplayer[1]='0'
			showTurn(0)
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
			oppoMove(X,Y)
			board[Y][X] = ++moveNum
		}
	})

	socket.on("gameover",function(winside){
		if (winside == side){
			if (window.confirm("You win! Another game?")==true){
				initState()
				load()
				showTurn(onMove)
			}
			else{
				socket.emit('leave')
				//TODO: jump to roomlist
				window.location.href="/"
			}
		}
		else{
			if (window.confirm("You lose! Another game?")==true){
				initState()
				load()
				showTurn(onMove)
			}
			else{
				socket.emit('leave')
				//TODO: jump to roomlist
				window.location.href="/"
			}
		}
	})
	
}

function initState(){
	onMove = (side == 'black')? 1 :-1
	beginGame = (roomplayer[0]=='1'&&roomplayer[1]=='1')?1:-1
	board = generateBoard(num)
	moveNum = 0
	curOppMove =[-1,-1]
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
	var lastX = edge+curOppMove[0]*interval
	var lastY = edge+curOppMove[1]*interval
	if (curOppMove[0]>=0 && curOppMove[1]>=0){
		ctx.beginPath();
		ctx.fillStyle=opposide
		ctx.arc(lastX,lastY,interval*0.4,0,Math.PI*2,false);
		ctx.fill()
	}
	showTurn(onMove)
	//this.socket.emit("move",roomID,side,X,Y)
}

function oppoMove(X,Y){
	const canv =document.getElementById("canvas");
	var ctx=canv.getContext("2d");
	ctx.beginPath();
	var realX = edge+X*interval
	var realY = edge+Y*interval
	var radius = interval*0.4
	var triangleArm = radius*0.7
	ctx.globalAlpha =1;
	ctx.arc(realX,realY,radius,0,Math.PI*2,false);
	ctx.fillStyle=opposide;
	ctx.fill();
	ctx.beginPath();
	ctx.fillStyle="red";
	ctx.moveTo(realX,realY-triangleArm)
	ctx.lineTo(realX+triangleArm/2*1.73,realY+triangleArm/2)
	ctx.lineTo(realX-triangleArm/2*1.73,realY+triangleArm/2)
	ctx.lineTo(realX,realY-triangleArm)
	ctx.fill()
	curOppMove=[X,Y]
	onMove = -onMove;
	showTurn(onMove)
}
function load(){
	const canv =document.getElementById("canvas");
	var ctx=canv.getContext("2d");
	img = new Image();  
	img.src = "../img/background.jpg";  
		
	img.onload = function() {
	ctx.globalAlpha =1;
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
	if (this.beginGame == 1)
		alert("Game begins")
	else
		alert("Welcome, please wait for your oppo")
	showTurn(onMove)
}

function showTurn(turn){
	if (turn==1 &&beginGame==1)
		document.getElementById("turn").innerHTML="Your Turn";
	if (turn==-1 &&beginGame==1)
		document.getElementById("turn").innerHTML="Waiting...";
	if (turn==0)
		document.getElementById("turn").innerHTML="";
}
/*window.onbeforeunload=function(e){ 
    　　var e = window.event||e;  
　　e.returnValue=("ddd");
};*/
	
