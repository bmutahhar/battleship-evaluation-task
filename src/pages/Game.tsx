import React, { useState } from "react";
import GameLayout from "../components/GameComponents/GameLayout";
import { ShipAttributes } from "../models";

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

const Game = () => {
  const [currentState, setCurrentState] = useState("placement");
  const [winner, setWinner] = useState(null);

  const [currentlyPlacing, setCurrentlyPlacing] =
    useState<ShipAttributes | null>(null);
  const [placedShips, setPlacedShips] = useState([]);
  const [availableShips, setAvailableShips] = useState(AVAILABLE_SHIPS);

  const selectShip = (index: number) => {
    const shipToPlace = availableShips[index];

    setCurrentlyPlacing({
      ...shipToPlace,
      orientation: "horizontal",
      position: null,
    });
  };

  return <GameLayout availableShips={availableShips} />;
};

export default Game;
