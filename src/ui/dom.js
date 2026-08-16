import {
  getPlayerShips,
  getPlayerGameBoard,
  getComputerGameBoard,
  gameOver,
} from "../game/game.js";

// Create display for a new Ship()
let direction = "horizontal";

function changeDirection() {
  direction = direction === "horizontal" ? "vertical" : "horizontal";
}

function createShip(ship) {
  const shipElement = document.createElement("div");

  shipElement.classList.add("ship");
  if (direction === "vertical") {
    shipElement.classList.add("ship-vertical");
  }

  shipElement.draggable = true;
  shipElement.ship = ship;
  shipElement.direction = direction;

  for (let i = 0; i < ship.length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("ship-cell");

    shipElement.appendChild(cell);
  }

  return shipElement;
}

// Render player ships
function renderShipList() {
  const shipList = document.querySelector(".ship-list");

  //   Empty list
  shipList.innerHTML = "";

  const ships = getPlayerShips();

  ships.forEach((ship) => {
    const element = createShip(ship);

    shipList.appendChild(element);
  });
}

// Create display for a new GameBoard()
function createBoard(container) {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");

      cell.classList.add("board-cell");

      cell.dataset.x = x;
      cell.dataset.y = y;

      container.appendChild(cell);
    }
  }
}

function renderPlayerBoard() {
  const playerBoard = document.querySelector(".player-board");

  playerBoard.innerHTML = "";

  createBoard(playerBoard);

  const boardCell = playerBoard.querySelectorAll(".board-cell");

  boardCell.forEach((cell) => {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    const board = getPlayerGameBoard();

    const isOccupied = board.occupied.some(([occupiedX, occupiedY]) => {
      return x === occupiedX && y === occupiedY;
    });

    // Show location of ship on board
    if (isOccupied) {
      cell.classList.add("occupied");
    }

    // Check marked ship
    const isMarked = board.marked.some(([markedX, markedY]) => {
      return x === markedX && y === markedY;
    });

    if (isOccupied && isMarked) {
      cell.classList.add("hit");
    }

    if (isMarked) {
      cell.classList.add("marked");
    }
  });
}

function renderComputerBoard() {
  const computerBoard = document.querySelector(".computer-board");

  computerBoard.innerHTML = "";

  createBoard(computerBoard);

  const boardCell = computerBoard.querySelectorAll(".board-cell");

  boardCell.forEach((cell) => {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    const board = getComputerGameBoard();

    const hasShip = board.occupied.some(([occupiedX, occupiedY]) => {
      return x === occupiedX && y === occupiedY;
    });

    // Check marked ship
    const isMarked = board.marked.some(([markedX, markedY]) => {
      return x === markedX && y === markedY;
    });

    if (hasShip && isMarked) {
      cell.classList.add("hit");
    }

    if (isMarked) {
      cell.classList.add("marked");
    }
  });
}

function showGameOver(message) {
  const modal = document.querySelector(".modal");
  const result = modal.querySelector(".result");

  result.textContent = message;
  modal.hidden = false;
}

export {
  renderShipList,
  changeDirection,
  renderPlayerBoard,
  renderComputerBoard,
  showGameOver,
};
