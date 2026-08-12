import GameBoard from "./gameboard.js";
import Ship from "./ship.js";

describe("GameBoard", () => {
  test("can place a ship on the board", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);

    gameBoard.place(ship);

    expect(gameBoard.ships.has(ship)).toBe(true);
  });

  test("placed ship has the correct number of coordinates", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);

    gameBoard.place(ship);

    expect(gameBoard.ships.get(ship)).toHaveLength(3);
  });

  test("ships do not overlap", () => {
    const gameBoard = new GameBoard();
    const ship1 = new Ship(3);
    const ship2 = new Ship(4);

    gameBoard.place(ship1);
    gameBoard.place(ship2);

    const coordinates1 = gameBoard.ships.get(ship1);
    const coordinates2 = gameBoard.ships.get(ship2);

    const overlap = coordinates1.some(([x, y]) => {
      return coordinates2.some(([otherX, otherY]) => {
        return x === otherX && y === otherY;
      });
    });

    expect(overlap).toBe(false);
  });

  test("receiveAttack hits a ship", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);

    gameBoard.place(ship);

    const coordinates = gameBoard.ships.get(ship);
    const attackCoordinate = coordinates[0];

    gameBoard.receiveAttack(attackCoordinate);

    expect(ship.hits).toBe(1);
  });

  test("receiveAttack records a missed attack", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);

    gameBoard.place(ship);

    const missedCoordinate = [9, 9];

    gameBoard.receiveAttack(missedCoordinate);

    expect(gameBoard.marked).toContainEqual(missedCoordinate);
  });

  test("receiveAttack does not allow the same coordinate to be attacked twice", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);

    gameBoard.place(ship);

    const coordinate = gameBoard.ships.get(ship)[0];

    gameBoard.receiveAttack(coordinate);
    gameBoard.receiveAttack(coordinate);

    expect(ship.hits).toBe(1);
  });

  test("allShipsSunk returns false when ships remain", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);

    gameBoard.place(ship);

    expect(gameBoard.allShipsSunk()).toBe(false);
  });

  test("allShipsSunk returns true when all ships are sunk", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(2);

    gameBoard.place(ship);

    const coordinates = gameBoard.ships.get(ship);

    gameBoard.receiveAttack(coordinates[0]);
    gameBoard.receiveAttack(coordinates[1]);

    expect(gameBoard.allShipsSunk()).toBe(true);
  });
});