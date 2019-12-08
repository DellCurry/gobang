const express=require('express')
const path=require('path')
var socket= require('socket.io');
var router = express.Router()
var board = require('./board')
const ejs = require('ejs');
const app=express()
var server = app.listen(80, () => {
    console.log('Running on http://localhost:80');
  });
var socketIO = socket(server)

app.use(express.static('public'));
app.use(express.json())

app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, '/template'));
app.set('view engine', 'ejs');


const num = 19
const roomNum = 2
var boards = new Array()
var joinList = new Array(roomNum);
for (let i=0;i<roomNum;i++){
    joinList[i] = new Array(2)
    for (let j=0;j<2;++j)
        joinList[i][j]=0
}
function start() {
    for (let i=0;i<roomNum;i++){
        boards.push(board.generateBoard(num))
    }
    app.get('/',function(request,response){
        response.render('room',{joinList:joinList})
    });

    app.get('/room',function(request,response){
        response.render('room',{joinList:joinList})
    });

    router.get('/room/:url/', function (request, response) {
        var  url= request.params.url;
        var roomID = url[4]
        var side = url.substring(5)
        var roomPattern = /\d/
        if ((side!='black' && side!='white') || roomPattern.test(roomID)==false){
            response.status(404).send('Page Not Found')
        }
        else{
            var roomIndex = parseInt(roomID)-1
            var sideIndex = (side == 'black')? 0:1
            joinList[roomIndex][sideIndex]=1
            
            response.render('canvas',{roomID:roomID,side:side,roomplayer:joinList[roomIndex]})
        }
      });

    app.use('/',router)

    socketIO.on('connection', function (socket) {
        var url = socket.request.headers.referer;
        var splited = url.split('/');
        var roomInfo = splited[splited.length - 1]; 
        var roomID = roomInfo[4]
        var roomIndex = parseInt(roomID)-1
        var side = roomInfo.substring(5)
        var sideIndex = (side == 'black')? 0:1
        var roomPattern = /\d/
        if ((side=='black' || side=='white') && roomPattern.test(roomID)==true){
            socket.on('join',function(username){
                socket.join(roomID);
                joinList[roomIndex][sideIndex]=1
                boards[roomIndex] = board.clearBoard(boards[roomIndex],num)
                socketIO.emit('sys',roomID,side,'join');
                console.log(joinList)
                socket.broadcast.to(roomID).emit('roomplayer','join')
            })
            socket.on('leave',function(){
                joinList[roomIndex][sideIndex]=0
            })
            socket.on('disconnect',function(){
                socket.leave(roomID)
                socketIO.emit('sys',roomID,side,'leave');
                //delete from joinlist
                joinList[roomIndex][sideIndex]=0
                boards[roomIndex] = board.clearBoard(boards[roomIndex],num)
                socket.broadcast.to(roomID).emit('roomplayer','leave')
                socket.disconnect(0)
            })
            socket.on('move',function(X,Y){
                boards[roomIndex][X][Y] = (side == 'black')? 1:-1
                socket.broadcast.to(roomID).emit("oppomove",side,X,Y)
                if (board.judge(boards[roomIndex],X,Y,num))
                    socketIO.to(roomID).emit("gameover",side)
            })
        }
    })

}

exports.start = start