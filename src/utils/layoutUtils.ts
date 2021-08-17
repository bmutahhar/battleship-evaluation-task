import { Coordinates, ShipAttributes, Layout } from "../models";
export const BOARD_ROWS = 10;
export const BOARD_COLUMNS = 10;
export const BOARD = BOARD_COLUMNS * BOARD_ROWS;

export const CELL_STATE = {
  empty: "empty",
  ship: "ship",
  hit: "hit",
  miss: "miss",
  ship_sunk: "ship-sunk",
  forbidden: "forbidden",
};

export const stateToCSSClass = {
  [CELL_STATE.empty]: "empty",
  [CELL_STATE.ship]: "ship",
  [CELL_STATE.hit]: "hit",
  [CELL_STATE.miss]: "miss",
  [CELL_STATE.ship_sunk]: "ship-sunk",
  [CELL_STATE.forbidden]: "forbidden",
};

// Returns an array with .empty classes => Empty Board
export const generateEmptyBoard = (): Layout => {
  return new Array(BOARD_ROWS * BOARD_COLUMNS).fill(CELL_STATE.empty);
};

// Returns the index of a clicked cell
export const coordinatesToIndex = (coordinates: Coordinates): number => {
  const { x, y }: Coordinates = coordinates;

  return y * BOARD_ROWS + x;
};

// Return the coordinates of a clicked cell

export const indexToCoordinates = (index: number): Coordinates => {
  return {
    x: index % BOARD_ROWS,
    y: Math.floor(index / BOARD_ROWS),
  };
};
// Returns the indices that the placing entity would take up
export const getIndices = (ship: ShipAttributes): number[] => {
  let index: number = coordinatesToIndex(ship.position!);
  const indices: number[] = [];
  Array.from(Array(ship.length).keys()).forEach(() => {
    indices.push(index);
    index = ship.orientation === "vertical" ? index + BOARD_ROWS : index + 1;
  });

  console.log("Indices: ", indices);
  return indices;
};

export const withInBounds = (ship: ShipAttributes): boolean => {
  return (
    (ship.orientation === "vertical" &&
      ship.position!.y + ship.length! <= BOARD_ROWS) ||
    (ship.orientation === "horizontal" &&
      ship.position!.x + ship.length! <= BOARD_COLUMNS)
  );
};

export const placeEntityInLayout = (
  oldLayout: Layout,
  entity: ShipAttributes,
  type: string
): Layout => {
  let newLayout: Layout = oldLayout.slice();
  const position = entity.position!;

  if (type === "ship") {
    console.log(entity);
    getIndices(entity).forEach((index) => {
      newLayout[index] = CELL_STATE.ship;
    });
  }

  if (type === "forbidden") {
    getIndices(entity).forEach((index) => {
      newLayout[index] = CELL_STATE.forbidden;
    });
  }

  if (type === "hit") {
    newLayout[coordinatesToIndex(position)] = CELL_STATE.hit;
  }

  if (type === "miss") {
    newLayout[coordinatesToIndex(position)] = CELL_STATE.miss;
  }

  if (type === "ship-sunk") {
    getIndices(entity).forEach((index) => {
      newLayout[index] = CELL_STATE.ship_sunk;
    });
  }
  console.log(newLayout);
  return newLayout;
};

// Check that the indices of the ship currently being placed all correspond to empty squares
export const isPlaceEmpty = (ship: ShipAttributes, layout: Layout) => {
  let shipIndices = getIndices(ship);

  return shipIndices.every((index) => layout[index] === CELL_STATE.empty);
};

// Calculate the number of cells that goes over bound while placing the ship to highlight
// the remaining cells within the board
export const calculateOutOfBoundCells = (ship: ShipAttributes): number => {
  return Math.max(
    ship.orientation === "vertical"
      ? ship.position!.y + ship.length! - BOARD_ROWS
      : ship.position!.x + ship.length! - BOARD_COLUMNS,
    0
  );
};

// Check if ship is with in the board's bound and the desired space is empty so ship can be placed
export const canBePlaced = (ship: ShipAttributes, layout: Layout): boolean =>
  isPlaceEmpty(ship, layout) && withInBounds(ship);

// Computer Opponent Methods

// Generate a random orientation and starting index on board for computer ships
export const generateRandomOrientation = () => {
  let randomNumber = Math.floor(Math.random() * 2);

  return randomNumber === 1 ? "vertical" : "horizontal";
};

export const generateRandomIndex = (value = BOARD) => {
  return Math.floor(Math.random() * BOARD);
};

// Assign a ship a random orientation and set of coordinates
export const randomizeShipProps = (ship: ShipAttributes) => {
  let randomStartIndex = generateRandomIndex();

  return {
    ...ship,
    position: indexToCoordinates(randomStartIndex),
    orientation: generateRandomOrientation(),
  };
};

// Generate random ships on opponent's board
export const generateOpponentsShipsInLayout = (
  opponentShips: ShipAttributes[]
) => {
  let opponentLayout = generateEmptyBoard();
  return opponentShips.map((ship: ShipAttributes) => {
    while (true) {
      let randomizedShip = randomizeShipProps(ship);
      if (canBePlaced(randomizedShip, opponentLayout)) {
        opponentLayout = placeEntityInLayout(
          opponentLayout,
          randomizedShip,
          CELL_STATE.ship
        );
        return { ...randomizedShip, place: true };
      }
    }
  });
};

// Gets the neighboring squares to a successful computer hit
export const getNeighbors = (coords: Coordinates) => {
  let firstRow = coords.y === 0;
  let lastRow = coords.y === 9;
  let firstColumn = coords.x === 0;
  let lastColumn = coords.x === 9;

  let neighbors = [];

  // coords.y === 0;
  if (firstRow) {
    neighbors.push(
      { x: coords.x + 1, y: coords.y },
      { x: coords.x - 1, y: coords.y },
      { x: coords.x, y: coords.y + 1 }
    );
  }

  // coords.y === 9;
  if (lastRow) {
    neighbors.push(
      { x: coords.x + 1, y: coords.y },
      { x: coords.x - 1, y: coords.y },
      { x: coords.x, y: coords.y - 1 }
    );
  }
  // coords.x === 0
  if (firstColumn) {
    neighbors.push(
      { x: coords.x + 1, y: coords.y }, // right
      { x: coords.x, y: coords.y + 1 }, // down
      { x: coords.x, y: coords.y - 1 } // up
    );
  }

  // coords.x === 9
  if (lastColumn) {
    neighbors.push(
      { x: coords.x - 1, y: coords.y }, // left
      { x: coords.x, y: coords.y + 1 }, // down
      { x: coords.x, y: coords.y - 1 } // up
    );
  }

  if (!lastColumn || !firstColumn || !lastRow || !firstRow) {
    neighbors.push(
      { x: coords.x - 1, y: coords.y }, // left
      { x: coords.x + 1, y: coords.y }, // right
      { x: coords.x, y: coords.y - 1 }, // up
      { x: coords.x, y: coords.y + 1 } // down
    );
  }

  let filteredResult = [
    ...new Set(
      neighbors
        .map((coords) => coordinatesToIndex(coords))
        .filter((number) => number >= 0 && number < BOARD)
    ),
  ];

  return filteredResult;
};

// Give ships a sunk flag to update their color
export const updateSunkShips = (
  currentHits: ShipAttributes[],
  opponentShips: ShipAttributes[]
): ShipAttributes[] => {
  let playerHitIndices = currentHits.map((hit: ShipAttributes) =>
    coordinatesToIndex(hit.position!)
  );

  let indexWasHit = (index: number): boolean =>
    playerHitIndices.includes(index);

  let shipsWithSunkFlag: ShipAttributes[] = opponentShips.map(
    (ship: ShipAttributes) => {
      let shipIndices = getIndices(ship);
      if (shipIndices.every((idx) => indexWasHit(idx))) {
        return { ...ship, sunk: true };
      } else {
        return { ...ship, sunk: false };
      }
    }
  );

  return shipsWithSunkFlag;
};
