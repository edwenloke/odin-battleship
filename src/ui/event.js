import {
  changeDirection,
  renderShipList,
  renderPlayerBoard,
  renderComputerBoard,
  showGameOver,
} from "./dom.js";

import {
  init,
  placePlayerShip,
  randomlyPlacePlayerShips,
  attack,
  canStartGame,
  computerPlay,
  gameOver,
} from "../game/game.js";

// Drag and drop event
const shipList = document.querySelector(".ship-list");
const playBtn = document.querySelector(".play-btn");

let draggedShip;
let direction;
shipList.addEventListener("dragstart", (event) => {
  draggedShip = event.target.ship;
  direction = event.target.direction;
});

const playerBoard = document.querySelector(".player-board");

playerBoard.addEventListener("dragover", (event) => {
  event.preventDefault();
});

playerBoard.addEventListener("drop", (event) => {
  event.preventDefault();

  const cell = event.target;

  let x = Number(cell.dataset.x);
  let y = Number(cell.dataset.y);

  let coordinate = [[x, y]];

  if (direction === "horizontal") {
    for (let i = 1; i < draggedShip.length; i++) {
      x++;
      coordinate.push([x, y]);
    }
  }

  if (direction === "vertical") {
    for (let i = 1; i < draggedShip.length; i++) {
      y++;
      coordinate.push([x, y]);
    }
  }

  //   Out of bound
  if (
    coordinate.some(([x, y]) => {
      return x < 0 || x > 9 || y < 0 || y > 9;
    })
  ) {
    return;
  }

  //   Save ship on game board
  const isValid = placePlayerShip(draggedShip, coordinate);

  if (isValid) {
    renderShipList();
    renderPlayerBoard();
  }

  //   Display play btn
  if (canStartGame()) {
    playBtn.hidden = false;
  }
});

// Rotate btn event
const rotateBtn = document.querySelector(".rotate-btn");

rotateBtn.addEventListener("click", () => {
  changeDirection();
  renderShipList();
});

// Randomize btn event
const randomizeBtn = document.querySelector(".random-btn");
randomizeBtn.addEventListener("click", () => {
  init();
  randomlyPlacePlayerShips();
  renderShipList();
  renderPlayerBoard();

  //   Display play btn
  if (canStartGame()) {
    playBtn.hidden = false;
  }
});

// Reset btn event
const resetBtn = document.querySelector(".reset-btn");

resetBtn.addEventListener("click", () => {
  init();
  renderShipList();
  renderPlayerBoard();

  playBtn.hidden = true;
  shipList.hidden = false;
  computerBoard.hidden = true;
  rotateBtn.hidden = false;
  randomizeBtn.hidden = false;
});

// Play btn event
const computerBoard = document.querySelector(".computer-board");

playBtn.addEventListener("click", () => {
  renderPlayerBoard();
  renderComputerBoard();

  shipList.hidden = true;
  playBtn.hidden = true;
  computerBoard.hidden = false;
  rotateBtn.hidden = true;
  randomizeBtn.hidden = true;
});

// Gameplay
// A spot on board is clicked
computerBoard.addEventListener("click", (event) => {
  const cell = event.target;
  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);

  // Player's turn
  const coordinate = [x, y];
  const status = attack(coordinate);

  if (status === "marked") return;
  renderComputerBoard();

  // Game over
  let message = gameOver();

  if (message) {
    showGameOver(message);
  }

  // Computer's turn
  computerPlay();
  renderPlayerBoard();

  // Game over
  message = gameOver();

  if (message) {
    showGameOver(message);
  }
});

// New game btn event
const newBtn = document.querySelector(".new-btn");
const modal = document.querySelector(".modal");

newBtn.addEventListener("click", () => {
  init();
  renderShipList();
  renderPlayerBoard();

  playBtn.hidden = true;
  rotateBtn.hidden = false;
  randomizeBtn.hidden = false;
  computerBoard.hidden = true;
  modal.hidden = true;
  shipList.hidden = false;
});
