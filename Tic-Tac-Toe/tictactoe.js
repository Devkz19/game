const board = document.getElementById("board");
const message = document.getElementById("message");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let isGameOver = false;

// Create the game board
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  cell.addEventListener("click", handleCellClick);
  board.appendChild(cell);
}

// Handle cell click
function handleCellClick(event) {
  if (isGameOver) return;

  const index = event.target.dataset.index;

  if (gameBoard[index] === "") {
    makeMove(index, currentPlayer);

    if (!checkGameOver()) {
      currentPlayer = "O";
      showMessage("Computer's turn!");
      setTimeout(() => {
        computerMove();
        if (!checkGameOver()) {
          currentPlayer = "X";
          showMessage("Your turn!");
        }
      }, 500);
    }
  }
}

// Make a move
function makeMove(index, player) {
  gameBoard[index] = player;
  board.children[index].textContent = player;
}

// Check for a winner
function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] !== "" && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      highlightWinningCells(pattern);
      return true;
    }
  }

  return false;
}

// Check if the board is full (a draw)
function isBoardFull() {
  return !gameBoard.includes("");
}

// Show a message on the screen
function showMessage(msg) {
  message.textContent = msg;
}

// Highlight the winning cells
function highlightWinningCells(cells) {
  for (const index of cells) {
    board.children[index].style.backgroundColor = "#8BC34A"; // Change color to green
  }
}

// Check if the game is over
function checkGameOver() {
  if (checkWinner()) {
    showMessage(currentPlayer === "X" ? "You win!" : "Computer wins!");
    isGameOver = true;
    disableBoard();
    return true;
  } else if (isBoardFull()) {
    showMessage("It's a draw!");
    isGameOver = true;
    disableBoard();
    return true;
  }

  return false;
}

// Disable the board after the game ends
function disableBoard() {
  for (const cell of board.children) {
    cell.removeEventListener("click", handleCellClick);
    cell.style.cursor = "not-allowed";
  }
}

// Computer's move
function computerMove() {
  const availableMoves = gameBoard.reduce((acc, cell, index) => {
    if (cell === "") {
      acc.push(index);
    }
    return acc;
  }, []);

  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  const computerChoice = availableMoves[randomIndex];
  makeMove(computerChoice, "O");
}