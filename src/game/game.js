import Ship from "./ship.js";
import GameBoard from "./gameboard.js";
import Player from "./player.js";

let player;
let computer;
let currentPlayer;

// Initialize game
function init() {
  player = new Player();
  computer = new Player();

  currentPlayer = player;
}

// Place ship on board----------------------------------------------------------------------
// Player----------------------------------------
// Self Placement
function dragDrop(player, coordinate) {
    player.GameBoard.place()
}
