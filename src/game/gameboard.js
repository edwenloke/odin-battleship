class GameBoard {
  constructor() {
    this.marked = [];
    this.occupied = [];
    this.ships = new Map();
  }

  // Place ship on board ------------------------------------------------------------------------------
  // Self placement-----------------------------------------------
  place(ship, coordinate) {
    // Check whether coordinate exists
    if (
      coordinate.some(([x, y]) => {
        return this.occupied.some(([occupiedX, occupiedY]) => {
          return x === occupiedX && y === occupiedY;
        });
      })
    ) {
      return false;
    }

    //   Out of bound
    if (
      coordinate.some(([x, y]) => {
        return x < 0 || x > 9 || y < 0 || y > 9;
      })
    ) {
      return false;
    }

    // Save ship and its coordinate
    this.occupied.push(...coordinate);
    this.ships.set(ship, coordinate);

    return true;
  }

  //   Get random coordinate---------------------------------------------------------------------
  rollCoordinate(length) {
    // Horizontal -----------------------------------
    const horizontal = () => {
      // Max starting point at x
      const maxX = 10 - length;
      // Get random num between 0 - maxX
      let x = Math.floor(Math.random() * (maxX + 1));
      // Get random num for y(0 - 9)
      const y = Math.floor(Math.random() * 10);

      // Horizontal coordinate
      const horizontal = [];
      while (horizontal.length < length) {
        horizontal.push([x, y]);
        x++;
      }
      return horizontal;
    };

    // Vertical ----------------------------------------
    const vertical = () => {
      const maxY = 10 - length;
      let y = Math.floor(Math.random() * (maxY + 1));
      const x = Math.floor(Math.random() * 10);

      // Vertical coordinate
      const vertical = [];
      while (vertical.length < length) {
        vertical.push([x, y]);
        y++;
      }
      return vertical;
    };

    const x = horizontal();
    const y = vertical();

    return Math.random() < 0.5 ? x : y;
  }

  // random placement-----------------------------------------------
  randomPlace(ship) {
    let coordinate = this.rollCoordinate(ship.length);

    // Check whether coordinate exists
    while (
      coordinate.some(([x, y]) => {
        return this.occupied.some(([occupiedX, occupiedY]) => {
          return x === occupiedX && y === occupiedY;
        });
      })
    ) {
      coordinate = this.rollCoordinate(ship.length);
    }

    // Save ship and its coordinate
    this.occupied.push(...coordinate);
    this.ships.set(ship, coordinate);
  }

  receiveAttack(coordinate) {
    // Check whether coordinate is marked
    if (
      this.marked.some(([x, y]) => {
        return x === coordinate[0] && y === coordinate[1];
      })
    ) {
      return "marked";
    }

    // Mark coordinate
    this.marked.push(coordinate);

    // Function findShip()
    const findShip = (coordinate) => {
      for (const [ship, coordinates] of this.ships) {
        const found = coordinates.some(([x, y]) => {
          return x === coordinate[0] && y === coordinate[1];
        });

        if (found) return ship;
      }
      return false;
    };

    // Check whether coordinate has ship
    const ship = findShip(coordinate);

    // Ship receive attack
    if (ship) {
      ship.hit();

      if (ship.isSunk()) return "sunk";

      return "hit";
    } else return "missed";
  }

  allShipsSunk() {
    for (const ship of this.ships.keys()) {
      if (!ship.isSunk()) return false;
    }

    return true;
  }
}

export default GameBoard;
