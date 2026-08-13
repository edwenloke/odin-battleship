import GameBoard from "./gameboard.js";
import Ship from "./ship.js";

describe("GameBoard", () => {
  test("can place a ship at specific coordinates", () => {
    const board = new GameBoard();
    const ship = new Ship(3);

    const coordinates = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    board.place(ship, coordinates);

    expect(board.ships.get(ship)).toEqual(coordinates);
  });

  test("does not place a ship if coordinates are occupied", () => {
    const board = new GameBoard();

    const ship1 = new Ship(3);
    const ship2 = new Ship(2);

    board.place(ship1, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    const result = board.place(ship2, [
      [0, 2],
      [0, 3],
    ]);

    expect(result).toBe(false);
    expect(board.ships.has(ship2)).toBe(false);
  });

  test("can randomly place a ship", () => {
    const board = new GameBoard();
    const ship = new Ship(3);

    board.randomPlace(ship);

    expect(board.ships.has(ship)).toBe(true);
    expect(board.ships.get(ship)).toHaveLength(3);
  });

  test("receiveAttack hits a ship", () => {
    const board = new GameBoard();
    const ship = new Ship(3);

    board.place(ship, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    const result = board.receiveAttack([0, 1]);

    expect(result).toBe("hit");
    expect(ship.hits).toBe(1);
  });

  test("receiveAttack records a missed attack", () => {
    const board = new GameBoard();
    const ship = new Ship(3);

    board.place(ship, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    const result = board.receiveAttack([5, 5]);

    expect(result).toBe("missed");
    expect(board.marked).toContainEqual([5, 5]);
  });

  test("does not receive the same attack twice", () => {
    const board = new GameBoard();
    const ship = new Ship(3);

    board.place(ship, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    board.receiveAttack([0, 1]);
    const result = board.receiveAttack([0, 1]);

    expect(result).toBeUndefined();
    expect(ship.hits).toBe(1);
  });

  test("reports false when not all ships are sunk", () => {
    const board = new GameBoard();
    const ship = new Ship(3);

    board.place(ship, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    board.receiveAttack([0, 0]);

    expect(board.allShipsSunk()).toBe(false);
  });

  test("reports true when all ships are sunk", () => {
    const board = new GameBoard();
    const ship = new Ship(2);

    board.place(ship, [
      [0, 0],
      [0, 1],
    ]);

    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);

    expect(board.allShipsSunk()).toBe(true);
  });
});
