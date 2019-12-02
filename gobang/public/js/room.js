document.write("<script type='text/javascript' src='/js/jquery-2.1.0.js'></script>");

document.write("<script type='text/javascript' src='/js/socket.io.js'></script>");
function showState(room,side,state){
    if (state === 'join'){
        document.getElementById('room'+room+'_'+side).innerHTML = 'join'; 
        document.getElementById('button'+room+side).disabled = true; 
    }
    else{
        document.getElementById('room'+room+'_'+side).innerHTML = ''; 
        document.getElementById('button'+room+side).disabled = false; 
    }
}

function load(joinList){
    var list = joinList.split(',')
    console.log(list)
    for (i=0;i<list.length;i++){
        if (list[i]=='1'){
            var roomID = Math.floor(i/2+1).toString()
            var side = (i%2==0)? 'black':'white'
            showState(roomID,side,'join');
        }
    }
    var socket = io.connect();
    socket.on('sys', function (room,side,state) {
        showState(room,side,state);
    });

}


