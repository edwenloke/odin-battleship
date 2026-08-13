import Player from "./player.js";
import GameBoard from "./gameboard.js";

test("player has a gameboard", () => {
  const player = new Player();

  expect(player.gameBoard).toBeInstanceOf(GameBoard);
});
