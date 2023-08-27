function createTicTacToe() {
  const minigameWindow = document.querySelector(".play-minigames");
  const chooseDifficulty = document.createElement("div");
  chooseDifficulty.classList.add("choose-difficulty");
  const difficulties = ["Easy", "Medium", "Hard"];
  for (let i = 0; i < 3; i++) {
    const difficulty = document.createElement("button");
    difficulty.setAttribute("value", difficulties[i].toLowerCase());
    difficulty.classList.add("difficulty-btn");
    difficulty.innerHTML = difficulties[i];

    chooseDifficulty.appendChild(difficulty);
  }

  const showGame = document.createElement("div");
  showGame.classList.add("show-tic-tac-toe");

  const table = document.createElement("table");

  const endgame = document.createElement("div");
  endgame.classList.add("endgame");

  const winner = document.createElement("p");
  winner.classList.add("winner");

  const resetBtn = document.createElement("button");
  resetBtn.classList.add("reset");
  resetBtn.innerHTML = "Reset";

  minigameWindow.appendChild(chooseDifficulty);
  minigameWindow.appendChild(showGame);
  showGame.appendChild(table);
  showGame.appendChild(endgame);
  showGame.appendChild(resetBtn);
  endgame.appendChild(winner);

  let setCellID = 0;
  for (let i = 0; i < 3; i++) {
    const tableRow = document.createElement("tr");
    table.appendChild(tableRow);
    for (let j = 0; j < 3; j++) {
      const tableCell = document.createElement("td");
      tableCell.className = "cell";
      tableCell.setAttribute("id", `${setCellID}`);
      tableRow.appendChild(tableCell);
      setCellID++;
    }
  }

  let origBoard;
  let selectedDifficulty = "easy";
  let gameWon;
  const humanPlayer = "O";
  const aiPlayer = "X";
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

  const difficultyButtons = document.querySelectorAll(".choose-difficulty .difficulty-btn");
  difficultyButtons[0].classList.add("active");
  difficultyButtons.forEach((e) => {
    e.addEventListener("click", () => {
      difficultyButtons.forEach((elem) => elem.classList.remove("active"));
      e.classList.add("active");
      startGame();
      selectedDifficulty = e.value;
    });
  });

  const cells = document.querySelectorAll(".cell");
  resetBtn.addEventListener("click", startGame);
  startGame();

  function startGame() {
    document.querySelector(".endgame").classList.add("hide");
    origBoard = Array.from(Array(9).keys());

    for (let i = 0; i < cells.length; i++) {
      cells[i].innerHTML = "";
      cells[i].style.removeProperty("background-color");
      cells[i].addEventListener("click", turnClick, false);
    }
  }

  function turnClick(square) {
    if (typeof origBoard[square.target.id] == "number") {
      turn(square.target.id, humanPlayer);
      if (!checkTie()) turn(bestSpot(), aiPlayer);
    }
  }

  function turn(squareId, player) {
    origBoard[squareId] = player;
    if (!gameWon) {
      document.getElementById(squareId).innerHTML = player;
    }
    gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
  }

  function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
      if (win.every((elem) => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }
    return gameWon;
  }

  function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
      document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose");
  }

  function declareWinner(who) {
    document.querySelector(".endgame").classList.remove("hide");
    document.querySelector(".endgame .winner").innerHTML = who;
  }

  function emptySquares(params) {
    return origBoard.filter((s) => typeof s == "number");
  }
  function bestSpot() {
    if (selectedDifficulty == "easy") {
      return emptySquares()[0];
    } else if (selectedDifficulty == "medium") {
      const randomMove = Math.floor(Math.random() * 2) + 1;
      if (randomMove == 1) {
        return emptySquares()[0];
      }
      return minimax(origBoard, aiPlayer).index;
    } else if (selectedDifficulty == "hard") {
      return minimax(origBoard, aiPlayer).index;
    }
  }

  function checkTie() {
    if (emptySquares().length == 0 && !gameWon) {
      for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = "green";

        cells[i].removeEventListener("click", turnClick, false);
      }
      declareWinner("Tie Game!");
      return true;
    }
    return false;
  }

  function minimax(newBoard, player) {
    let availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, player)) {
      return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == aiPlayer) {
        let result = minimax(newBoard, humanPlayer);
        move.score = result.score;
      } else {
        let result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;
      moves.push(move);
    }

    let bestMove;
    if (player == aiPlayer) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }
}

createTicTacToe();
