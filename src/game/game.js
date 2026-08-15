import Ship from "./ship.js";
import Player from "./player.js";

let player;
let computer;
let currentPlayer;

let playerShips = [];
let computerShips = [];
const totalShips = 7;

// Initialize game
function init() {
  player = new Player();
  computer = new Player();

  currentPlayer = player;

  playerShips = [
    new Ship(1),
    new Ship(2),
    new Ship(2),
    new Ship(3),
    new Ship(3),
    new Ship(4),
    new Ship(5),
  ];

  computerShips = [
    new Ship(1),
    new Ship(2),
    new Ship(2),
    new Ship(3),
    new Ship(3),
    new Ship(4),
    new Ship(5),
  ];

  // Setup computer's board
  randomlyPlaceShips(computerShips, computer);
}
// Data for dom.js
function getPlayerShips() {
  return playerShips;
}
function getPlayerGameBoard() {
  return player;
}
function getComputerGameBoard() {
  return computer;
}

// Prep game functions--------------------------------------------------------------------------------
// Place ship on board---------------------------------------------------------
// Self Place
function placePlayerShip(ship, coordinate) {
  const isValid = player.gameBoard.place(ship, coordinate);

  if (isValid) {
    const index = playerShips.findIndex((target) => target === ship);

    if (index !== -1) {
      playerShips.splice(index, 1);
    }
  }

  return isValid;
}

// Randomly Place
function randomlyPlaceShips(playerShips, player) {
  playerShips.forEach((ship) => player.gameBoard.randomPlace(ship));
  playerShips.length = 0;
}

// Check whether game can start
function canStartGame() {
  return player.gameBoard.ships.size === totalShips;
}

// Play game functions-----------------------------------------------------------------------------
function switchPlayer() {
  currentPlayer = currentPlayer === player ? computer : player;
}

// Player attack
function attack(coordinate) {
  if (currentPlayer === player) {
    const status = computer.gameBoard.receiveAttack(coordinate);

    if (status === "marked") return "marked";

    switchPlayer();

    return status;
  } else {
    const status = player.gameBoard.receiveAttack(coordinate);

    if (status === "marked") return;

    switchPlayer();

    return status;
  }
}

function gameOver() {
  if (computer.gameBoard.allShipsSunk()) {
    return "You win!";
  }

  if (player.gameBoard.allShipsSunk()) {
    return "Computer Wins!";
  }
}

// Computer plays-------------------------------------------------------------------
let prevAttack;
let prevCoordinate;
let direction;
let originCoordinate;
let hunt = false;

function computerPlay() {
  if (currentPlayer !== computer) return;

  if (prevAttack === "sunk") {
    resetComputerTarget();

    const coordinate = randomCoordinate();
    prevAttack = attack(coordinate);
    originCoordinate = coordinate;

    return;
  }

  // If found ship attack adjacent
  if (prevAttack === "hit" && !direction) {
    const targetCoordinates = getAdjacentCoordinate(originCoordinate);

    hunt = true;

    prevAttack = attack(targetCoordinates[0]);
    prevCoordinate = targetCoordinates[0];

    return;
  }

  if (hunt && prevAttack === "hit") {
    if (Math.abs(prevCoordinate[0] - originCoordinate[0]) === 1) {
      direction = "horizontal";
    } else if (Math.abs(prevCoordinate[1] - originCoordinate[1]) === 1) {
      direction = "vertical";
    }

    const targetCoordinates = getAdjacentCoordinate(prevCoordinate);
    prevAttack = attack(targetCoordinates[0]);
    prevCoordinate = targetCoordinates[0];

    return;
  }

  if (hunt && prevAttack === "missed") {
    const targetCoordinates = getAdjacentCoordinate(originCoordinate);

    if (targetCoordinates.length === 0) {
      resetComputerTarget();

      const coordinate = randomCoordinate();
      prevAttack = attack(coordinate);
      originCoordinate = coordinate;

      return;
    }

    prevAttack = attack(targetCoordinates[0]);
    prevCoordinate = targetCoordinates[0];

    return;
  }

  const coordinate = randomCoordinate();
  prevAttack = attack(coordinate);
  originCoordinate = coordinate;
}

// Generate random coordinate
const randomCoordinate = () => {
  const rollCoordinate = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    return [x, y];
  };

  let coordinate = rollCoordinate();

  // If coordinate marked reroll coordinate
  while (
    player.gameBoard.marked.some(([x, y]) => {
      return x === coordinate[0] && y === coordinate[1];
    })
  ) {
    coordinate = rollCoordinate();
  }

  return coordinate;
};

// Reset computer target
function resetComputerTarget() {
  prevAttack = null;
  originCoordinate = null;
  prevCoordinate = null;
  direction = null;
  hunt = false;
}

// Get adjacent coordinate
const getAdjacentCoordinate = (coordinate) => {
  const targetCoordinates = [];
  const onlyHorizontal = [];
  const onlyVertical = [];

  let left = [coordinate[0] - 1, coordinate[1]];
  let right = [coordinate[0] + 1, coordinate[1]];
  let up = [coordinate[0], coordinate[1] + 1];
  let down = [coordinate[0], coordinate[1] - 1];

  // Check whether coordinate is valid
  if (coordinate[0] === 0) {
    targetCoordinates.push(right);
    onlyHorizontal.push(right);
  } else if (coordinate[0] === 9) {
    targetCoordinates.push(left);
    onlyHorizontal.push(left);
  } else {
    targetCoordinates.push(left);
    targetCoordinates.push(right);
    onlyHorizontal.push(left);
    onlyHorizontal.push(right);
  }

  if (coordinate[1] === 0) {
    targetCoordinates.push(up);
    onlyVertical.push(up);
  } else if (coordinate[1] === 9) {
    targetCoordinates.push(down);
    onlyVertical.push(down);
  } else {
    targetCoordinates.push(up);
    targetCoordinates.push(down);
    onlyVertical.push(up);
    onlyVertical.push(down);
  }

  // Check whether coordinate is marked
  const filterMarkedCoordinate = (coordinate) => {
    const available = coordinate.filter((target) => {
      return !player.gameBoard.marked.some(([x, y]) => {
        return x === target[0] && y === target[1];
      });
    });

    return available;
  };

  if (direction === "horizontal") {
    const coordinate = filterMarkedCoordinate(onlyHorizontal);
    return coordinate;
  } else if (direction === "vertical") {
    const coordinate = filterMarkedCoordinate(onlyVertical);
    return coordinate;
  } else {
    const coordinate = filterMarkedCoordinate(targetCoordinates);
    return coordinate;
  }
};

export {
  getPlayerShips,
  getPlayerGameBoard,
  getComputerGameBoard,
  init,
  placePlayerShip,
  randomlyPlaceShips,
  canStartGame,
  attack,
  gameOver,
  computerPlay,
};
