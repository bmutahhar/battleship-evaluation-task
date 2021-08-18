import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useHistory } from "react-router";
import GameLayout from "../components/GameComponents/GameLayout";
import { Layout, PlayerInfo, ShipAttributes } from "../models";
import {
  CELL_STATE,
  generateEmptyBoard,
  indexToCoordinates,
  placeShipInLayout,
  updateSunkShips,
} from "../utils/layoutUtils";

const AVAILABLE_SHIPS: ShipAttributes[] = [
  {
    name: "carrier",
    length: 5,
    placed: null,
  },
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
  const [gameOver, setGameOver] = useState(false);
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
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket>();
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    playerId: 0,
    state: "player1",
  });
  const [displayOpponentBoard, setDisplayOpponentBoard] = useState(false);
  const [canJoin, setCanJoin] = useState(true);

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
    connectOnClick();
  };

  const changeTurn = () => {
    setCurrentState((oldGameState) =>
      oldGameState === "player-turn" ? "opponent-turn" : "player-turn"
    );
  };

  const quitGame = () => {
    socket?.disconnect();
    history.push("/");
    localStorage.clear();
  };

  const joinOnce = () => {
    startTurn();
    setCanJoin(false);
  };

  const opponentFire = (index: number, layout: Layout) => {
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

  const handleComputerTurn = () => {
    if (gameOver) {
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

    socket!.on("fire", (cellIndex: number) => {
      opponentFire(cellIndex, layout);
    });
  };

  const startAgain = () => {
    setCurrentState("placement");
    setGameOver(false);
    setWinner("");
    setCurrentSelectedShip(null);
    setShipsOnBoard([]);
    setAvailableShips(AVAILABLE_SHIPS);
    setComputerShips([]);
    setHitsByPlayer([]);
    setHitsByComputer([]);
    setDisplayOpponentBoard(false);
    setCanJoin(true);
    setMessage("");
    setPlayerInfo({
      playerId: 0,
      state: "player1",
    });
    socket?.disconnect();
    history.replace("/game");
  };

  const connectOnClick = () => {
    const socketIo = io("http://localhost:8080");
    setSocket(socketIo);
  };

  // Use effect to checking game over conditions
  useEffect(() => {
    let successfulPlayerHits = hitsByPlayer.filter(
      (hit) => hit.type === "hit"
    ).length;
    let successfulComputerHits = hitsByComputer.filter(
      (hit) => hit.type === "hit"
    ).length;

    if (
      successfulComputerHits === TOTAL_SHIPS_LENGTH.length ||
      successfulPlayerHits === TOTAL_SHIPS_LENGTH.length
    ) {
      if (successfulComputerHits === TOTAL_SHIPS_LENGTH.length) {
        setWinner("Opponent");
        setGameOver(true);
        socket?.emit("game-over");
      }
      if (successfulPlayerHits === TOTAL_SHIPS_LENGTH.length) {
        setWinner("You");
        setGameOver(true);
        socket?.emit("game-over");
      }
    } else {
      setGameOver(false);
    }
  }, [hitsByComputer, hitsByPlayer, shipsOnBoard, socket]);

  useEffect(() => {
    if (socket) {
      socket.on(
        "player-number",
        (data: { playerId: number; pool: number[] }) => {
          if (data.playerId === -1) {
            setMessage("Room Full");
          } else {
            if (data.playerId === 0) {
              setPlayerInfo({ playerId: data.playerId, state: "player1" });
            }
            if (data.playerId === 1) {
              setPlayerInfo({ playerId: data.playerId, state: "player2" });
              socket.emit("gameReady", shipsOnBoard);
            }
            // Execute only when second player joined
            if (data.pool.length === 2) {
              setMessage(`Player ${data.pool[0] + 1} has connected`);
              setDisplayOpponentBoard(true);
            }
          }
        }
      );

      socket.on("player-connection", (data) => {
        setMessage(`Player ${data.playerId + 1} has ${data.action}`);
        setDisplayOpponentBoard(true);
      });

      socket.on("currentTurn", (currentTurn: number) => {
        if (currentTurn === playerInfo.playerId) {
          setCurrentState("player-turn");
          setMessage("Your turn");
        } else {
          setCurrentState("opponent-turn");
          setMessage("Opponent Turn");
        }
      });

      // Set ships for player 1
      socket.on("opponent-ships", (opponentShips: ShipAttributes[]) => {
        setComputerShips(opponentShips);
        socket.emit("opponent-ships-reply", shipsOnBoard);
      });

      // Set ships for player 2
      socket.on("opponent-ships-reply", (opponentShips: ShipAttributes[]) => {
        setComputerShips(opponentShips);
        socket.emit("start-game");
      });

      socket.on("game-over", () => {
        setGameOver(true);
      });
    }
  }, [socket, playerInfo, shipsOnBoard]);

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
      startAgain={startAgain}
      quitGame={quitGame}
      winner={winner}
      setComputerShips={setComputerShips}
      gameOver={gameOver}
      message={message}
      displayOpponentBoard={displayOpponentBoard}
      socket={socket!}
      canJoin={canJoin}
      joinOnce={joinOnce}
    />
  );
};

export default Game;
