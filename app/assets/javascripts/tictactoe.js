$(attachListeners)

function attachListeners() {
  //on click add event listener to td element
  $("tbody").click(function(event) {
    //console.log(this)
    //console.log(event)
    doTurn(event);
  });
}

var turn = 0

function doTurn(event) {
  updateState(event);
  if (checkWinner()) {
    resetBoard();
    resetTurn();
  } else {
    turn++
  }
}

 function updateState(event) {
   //debugger
   //event["currentTarget"].val = player()
   $(event.target).html(player());
 }

 var winningCombos = [
 [[0,0],[0,1],[0,2]], 
 [[1,0],[1,1],[1,2]], 
 [[2,0],[2,1],[2,2]], 
 [[0,0],[1,0],[2,0]], 
 [[0,1],[1,1],[2,1]], 
 [[0,2],[1,2],[2,2]], 
 [[0,0],[1,1],[2,2]], 
 [[2,0],[1,1],[0,2]]]

function checkWinner() {
  var gameOver = false
  // Should evaluate the board to see if anyone has won
  winningCombos.forEach(function(combo) {
    var cell1 = cellValue(combo[0][0], combo[0][1]);
    var cell2 = cellValue(combo[1][0], combo[1][1]);
    var cell3 = cellValue(combo[2][0], combo[2][1]);

    if (cell1 == player() && cell2 == player() && cell3 == player()) {
      // should then pass this string to message()
      // should make one of two strings: "Player X Won!" or "Player O Won!"
      message("Player " + player() + " Won!");
      gameOver = true;
    }
    // Calls on 'message' and passes it the string 'Tie game' when there is a tie
    if (tie()) {
      message("Tie game");
      gameOver = true;
    }
  })
  return gameOver
}

function player(){ 
  if ((turn % 2) == 0) {
    return "X"
  } else {
    return "O"
  }
 }

function tie(){
  //if turn is last and no empty spaces on board
  if (lastTurn() && boardFull()) {
    return true
  }
}

function lastTurn(){
  if (turn == 8) {
    return true
  } else {
    return false
  }
}

function getBoard(){
  board = []
  $("tbody td").each(function(){
    board.push(this.innerHTML)  
  })
  return board
}

function boardFull(board){
  board = getBoard()
  return board.every(item => item != "")
}

function resetBoard(){
  $("tbody td").text("")
  //debugger
}

function resetTurn(){
  turn = 0
}


function message(string){
  $("#message").html(string)
}

function cellValue(data1, data2) {
  return $('[data-x="' + data1 + '"][data-y="' + data2 + '"]').html();
}

//function checkCells(){
  //check current cells against winning combos
    //loop through each combo out of 8 winning combos
    // winningCombos.forEach(function(combo){ // [[0,0],[0,1],[0,2]]
    //   var cell1 = combo[0] // [0,0]
    //   var cell2 = combo[1] // [0,1]
    //   var cell3 = combo[2] // [0,2]
    //   //loop through and see if values all match X's
    //    var match = []
    //   for (i=0; i < combo.length; i++) {
    //     var data1 = combo[i][0] //0
    //     var data2 = combo[i][1] //0  
    //     match.push(cellValue(data1,data2))
    //     //debugger
    //   }

    //   if (match[0] === player() & match[1] === player() && match[2] === player()) {
    //     message("Player " + player() + " Won!")
        
    //   } else {
    //     return false
    //   }

    // })   
//}