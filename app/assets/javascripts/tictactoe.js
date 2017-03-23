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
    
    //if (persisted === false) {
      save()

      
      
    //   persisted = true
    // } else {
    //   update()
    //}
    
  })

  $(document).on("click", "li", function(event){
        //alert( "li clicked")
        console.log($(this).data("state"))
    

        //var id = $(this).data("id")
        var state = $(this).data("state").split(",")
        var id = $(this).data("id")
        loadBoard(state, id);
        //history.pushState(null,null,`/games/${id}`)
      })

  //select a previous game to continue
  // $(document).on("click", "li", function(event){
  //   alert( "li clicked")
  //   console.log(event)
  // })

  

}

var turn = 0
var currentGame = getBoard()
//var persisted = false
var currentGameId = undefined

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

// persistance functions

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


  // function update() {
  //     $.ajax({
  //     method: 'POST',
  //     url: `/games`,
  //     dataType: 'json',
  //     data: { game: { state: getBoard() }}
  //   }).success(function(data){
  //     //creates game by status but doesnt hit this success message
  //     //i get a internal server error post.
  //     alert("/patch request success");
  //     console.log(data)
  //     debugger
  //   })
  // }
    

    //var currentGameString = (getBoard())
    //var token = $( 'meta[name="csrf-token"]' ).attr( 'content' );
    // fetch(`/games`, {
    //   method: "POST", 
    //   headers: {'CSRFToken': token},
    //   body: JSON.stringify(currentGame)
    // })
    //   .then(function(response){
    //     console.log(response)
    //})
    // })
    //look into serializer method that serializes data and add token ****


// function update(){
//   var id = 
//   $.ajax({
//     method: "PATCH"
//     url: "/games/" + id
//     dataType: "json"
//     data:
//   }).success(function(data){
//     alert("Update request success")
//   })
// }



//note:
// if you save a game, clear the board.
// if you win a game, do you need to save?
// if you tie a game do you need to save?
// clicking the save button a second time, updates the game rather than having a new game
// make the show game work before update so you can pull the id


// how do you prevent show previous games from re adding the same games over and over? -- clear the element before adding the entire list again.
