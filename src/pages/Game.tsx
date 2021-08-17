import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import GameLayout from "../components/GameComponents/GameLayout";
import { Layout, ShipAttributes } from "../models";
import {
  CELL_STATE,
  coordinatesToIndex,
  generateEmptyBoard,
  generateOpponentsShipsInLayout,
  generateRandomIndex,
  getNeighbors,
  indexToCoordinates,
  placeShipInLayout,
  updateSunkShips,
} from "../utils/layoutUtils";

const AVAILABLE_SHIPS: ShipAttributes[] = [
  {
    name: "battleship",
    length: 4,
    placed: null,
  },
  {
    name: "cruiser",
    length: 3,
    placed: null,
  },
  {
    name: "submarine",
    length: 3,
    placed: null,
  },
  {
    name: "destroyer",
    length: 2,
    placed: null,
  },
];

const TOTAL_SHIPS_LENGTH = AVAILABLE_SHIPS.slice().reduce(
  (prevValue, currentValue) => {
    return { length: prevValue.length! + currentValue.length! };
  }
);

const Game = () => {
  const [currentState, setCurrentState] = useState("placement");
  // const [currentState, setCurrentState] = useState("game-over");
  const [winner, setWinner] = useState<string>("");

  const [currentSelectedShip, setCurrentSelectedShip] =
    useState<ShipAttributes | null>(null);
  const [shipsOnBoard, setShipsOnBoard] = useState<ShipAttributes[]>([]);
  const [availableShips, setAvailableShips] =
    useState<ShipAttributes[]>(AVAILABLE_SHIPS);
  const [computerShips, setComputerShips] = useState<ShipAttributes[]>([]);
  const [hitsByPlayer, setHitsByPlayer] = useState<ShipAttributes[]>([]);
  const [hitsByComputer, setHitsByComputer] = useState<ShipAttributes[]>([]);
  const history = useHistory();

  const selectShip = (index: number) => {
    const shipToPlace = availableShips[index];

    setCurrentSelectedShip({
      ...shipToPlace,
      orientation: "horizontal",
      position: null,
    });
  };

  const placeShipOnBoard = (currentSelectedShip: ShipAttributes) => {
    setShipsOnBoard([
      ...shipsOnBoard,
      {
        ...currentSelectedShip,
        placed: true,
      },
    ]);
    setAvailableShips((previousShips) =>
      previousShips.filter((ship) => ship.name !== currentSelectedShip.name)
    );
    setCurrentSelectedShip(null);
  };

  const rotateShip = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    if (currentSelectedShip != null && event.button === 2) {
      setCurrentSelectedShip({
        ...currentSelectedShip,
        orientation:
          currentSelectedShip.orientation === "vertical"
            ? "horizontal"
            : "vertical",
      });
    }
  };

  const startTurn = () => {
    generateComputerShips();
    setCurrentState("player-turn");
  };

  const changeTurn = () => {
    setCurrentState((oldGameState) =>
      oldGameState === "player-turn" ? "computer-turn" : "player-turn"
    );
  };

  const quitGame = () => {
    history.push("/");
    localStorage.clear();
  };

  // *** COMPUTER ***
  const generateComputerShips = () => {
    const generatedComputerShips = generateOpponentsShipsInLayout(
      AVAILABLE_SHIPS.slice()
    );
    setComputerShips(generatedComputerShips);
  };

  const computerFire = (index: number, layout: Layout) => {
    let computerHits: ShipAttributes[] = [];
    if (layout[index] === "ship") {
      computerHits = [
        ...hitsByComputer,
        {
          position: indexToCoordinates(index),
          type: CELL_STATE.hit,
        },
      ];
    }
    if (layout[index] === "empty") {
      computerHits = [
        ...hitsByComputer,
        {
          position: indexToCoordinates(index),
          type: CELL_STATE.miss,
        },
      ];
    }

    const sunkShips = updateSunkShips(computerHits, shipsOnBoard);

    setShipsOnBoard(sunkShips);
    setHitsByComputer(computerHits);
  };

  const checkIfGameOver = () => {
    let successfulPlayerHits = hitsByPlayer.filter(
      (hit) => hit.type === "hit"
    ).length;
    let successfulComputerHits = hitsByComputer.filter(
      (hit) => hit.type === "hit"
    ).length;

    if (successfulComputerHits === TOTAL_SHIPS_LENGTH.length) {
      setWinner("Computer");
      setCurrentState("game-over");
      return true;
    }
    if (successfulPlayerHits === TOTAL_SHIPS_LENGTH.length) {
      setWinner("Player 1");
      setCurrentState("game-over");
      return true;
    }

    return false;
  };

  const handleComputerTurn = () => {
    changeTurn();

    if (checkIfGameOver()) {
      console.log("Game");
      return;
    }

    // Recreate layout to get eligible squares
    let layout = shipsOnBoard.reduce(
      (prevLayout, currentShip) =>
        placeShipInLayout(prevLayout, currentShip, CELL_STATE.ship),
      generateEmptyBoard()
    );

    layout = hitsByComputer.reduce(
      (prevLayout, currentHit) =>
        placeShipInLayout(prevLayout, currentHit, currentHit.type!),
      layout
    );

    layout = shipsOnBoard.reduce(
      (prevLayout, currentShip) =>
        currentShip.sunk
          ? placeShipInLayout(prevLayout, currentShip, CELL_STATE.ship_sunk)
          : prevLayout,
      layout
    );

    let successfulComputerHits = hitsByComputer.filter(
      (hit) => hit.type === "hit"
    );

    let nonSunkComputerHits = successfulComputerHits.filter((hit) => {
      const hitIndex = coordinatesToIndex(hit.position!);
      return layout[hitIndex] === "hit";
    });
    let potentialTargets: any[] = nonSunkComputerHits
      .flatMap((hit) => getNeighbors(hit.position!))
      .filter((idx) => layout[idx] === "empty" || layout[idx] === "ship");

    // Until there's a successful hit

    if (potentialTargets.length === 0) {
      let layoutIndices = layout.map((_: string, idx: number) => idx);
      potentialTargets = layoutIndices.filter(
        (index: any) => layout[index] === "ship" || layout[index] === "empty"
      );
    }

    let randomIndex = generateRandomIndex(potentialTargets.length);

    let target = potentialTargets[randomIndex];

    setTimeout(() => {
      computerFire(target, layout);
      changeTurn();
    }, 300);
  };

  const startAgain = () => {
    setCurrentState("placement");
    setWinner("");
    setCurrentSelectedShip(null);
    setShipsOnBoard([]);
    setAvailableShips(AVAILABLE_SHIPS);
    setComputerShips([]);
    setHitsByPlayer([]);
    setHitsByComputer([]);
    history.replace("/game");
  };

  return (
    <GameLayout
      availableShips={availableShips}
      selectShip={selectShip}
      currentSelectedShip={currentSelectedShip}
      setCurrentSelectedShip={setCurrentSelectedShip}
      placeShipOnBoard={placeShipOnBoard}
      shipsOnBoard={shipsOnBoard}
      rotateShip={rotateShip}
      startTurn={startTurn}
      computerShips={computerShips}
      currentState={currentState}
      changeTurn={changeTurn}
      hitsByPlayer={hitsByPlayer}
      setHitsByPlayer={setHitsByPlayer}
      hitsByComputer={hitsByComputer}
      setHitsByComputer={setHitsByComputer}
      handleComputerTurn={handleComputerTurn}
      checkIfGameOver={checkIfGameOver}
      startAgain={startAgain}
      quitGame={quitGame}
      winner={winner}
      setComputerShips={setComputerShips}
    />
  );
};

export default Game;
