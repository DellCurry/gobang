function judge(board,X,Y,num){
    var side = board[X][Y];
    var win = 1
    /////////////////////////////
    //vettical
    for (i=X-1,j=Y;i>=0;i--){
        if (board[i][j]==side)
            win++;
        else
            break;
    }
    for (i=X+1,j=Y;i<num;i++){
        if (board[i][j]==side)
            win++;
        else
            break;
    }
    if (win>=5)
        return true;
    else
        win = 1
    //////////////////////////////
    //horizontal
    for (i=X,j=Y-1;j>=0;j--){
        if (board[i][j]==side)
            win++;
        else
            break;
    }
    for (i=X,j=Y+1;j<num;j++){
        if (board[i][j]==side)
            win++;
        else
            break;
    }
    if (win>=5)
        return true;
    else
        win = 1
    //////////////////////////////
    //left-top
    for (i=X-1,j=Y-1;i>=0,j>=0;i--,j--){
        if (board[i][j]==side)
            win++;
        else
            break;
    }
    for (i=X+1,j=Y+1;i<num&&j<num;i++,j++){
        if (board[i][j]==side)
            win++;
        else
            break;
    }
    if (win>=5)
        return true;
    else
        win = 1
    ////////////////////////////////
    //left-right
    for (i=X-1,j=Y+1;i>=0,j<num;i--,j++){
        if (board[i][j]==side)
            win++;
        else
            break;
    }
    for (i=X+1,j=Y-1;i<num&&j>=0;i++,j--){
        if (board[i][j]==side)
            win++;
        else
            break;
    }
    if (win>=5)
        return true;
    else
        return false;
}


function generateBoard(num){
    var board = new Array(num)
    for(let i = 0;i<num;i++){
        board[i] = new Array(num);
        for(let j = 0;j<num;j++){
          board[i][j] = 0;
        }
    }
    return board
}
function clearBoard(board,num){
    for(let i = 0;i<num;i++){
        for(let j = 0;j<num;j++){
            board[i][j] = 0;
        }
    }
    return board
}
exports.judge = judge
exports.generateBoard = generateBoard
exports.clearBoard = clearBoard