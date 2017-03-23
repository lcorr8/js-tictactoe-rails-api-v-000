
$(attachListeners)

function attachListeners() {
  //on click add event listener to td element
  $("tbody").click(function(event) {
    doTurn(event);
  });

  // show previous games
  $("#previous").click(function(event) {
    previousGames() 
  })

  //save current game
  $("#save").on("click", function(event){
    save()
  })

  $(document).on("click", "li", function(event){    
    var state = $(this).data("state").split(",")
    var id = $(this).data("id")
    loadBoard(state, id);
    turn = getTurn()
    //history.pushState(null,null,`/games/${id}`)
  })
}

var turn = 0
var currentGame = getBoard()
var currentGameId = undefined
var winningCombos = [
 [[0,0],[0,1],[0,2]], 
 [[1,0],[1,1],[1,2]], 
 [[2,0],[2,1],[2,2]], 
 [[0,0],[1,0],[2,0]], 
 [[0,1],[1,1],[2,1]], 
 [[0,2],[1,2],[2,2]], 
 [[0,0],[1,1],[2,2]], 
 [[2,0],[1,1],[0,2]]]

function doTurn(event) {
  updateState(event);
  if (checkWinner()) {
    save();
    resetBoard();
    resetTurn();
  } else {
    turn++
  }
}

function updateState(event) {
  //event["currentTarget"].val = player()
  $(event.target).html(player());
}

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
      
      console.log("after tie(), before save()")
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
    console.log("inside tie()")
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

function loadBoard(gameState, id){
  currentGameId = id
  var i = 0
    $("tbody td").each(function(){
      $(this).text(gameState[i])
      i++
    })
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

function getTurn(){
  board = getBoard()
  turnCounter = 0
  for (i=0; i<board.length; i++){
    if (board[i] === "X" || board[i] === "O") {
      turnCounter += 1
    }
  }
  return turnCounter
}

function save() {
  console.log("inside save()")
  var url, method;

  if (currentGameId) {
    console.log("inside patch")
    method = 'PATCH'
    url = `/games/${currentGameId}`

  } else {
    console.log("inside post")
    method = 'POST'
    url = `/games`
  }

  $.ajax({
      method: method,
      url: url,
      dataType: 'json',
      data: { game: { state: getBoard() }}
    }).success(function(response){
      //creates game by status but doesnt hit this success message
      //i get a internal server error post.
      alert("post/patch request success");
      console.log(response)
    }).error(function(error){
      console.log(error)
    })
  }

  function previousGames(){
    $.ajax({
      method: "GET",
      url: "/games"
    }).success(function(data){
        var savedGames = data["games"]
        $("#games").html("")
        if (savedGames.length > 0 ) {
          $("#games").append("<ul></ul>")
          for (var key in savedGames) { 
            $("#games ul").append(`<li data-state= ${savedGames[key]["state"]} data-id = ${savedGames[key]["id"]}> ${savedGames[key]["id"]}</li>`)
          }
        } 
      })
  }