import React, { MouseEvent } from "react";
import Typography from "@material-ui/core/Typography";
import {
  GridContainer,
  GridHeader,
  Grid,
  HeaderCell,
  RowHeader,
  Cell,
} from "./index";
import { Layout, OpponentBoardProps } from "../../models";
import {
  CELL_STATE,
  COLUMNS,
  generateEmptyBoard,
  indexToCoordinates,
  placeShipInLayout,
  stateToCSSClass,
  updateSunkShips,
} from "../../utils/layoutUtils";

const OpponentBoard: React.FC<OpponentBoardProps> = ({
  computerShips,
  setComputerShips,
  hitsByPlayer,
  setHitsByPlayer,
  currentState,
  // checkIfGameOver,
  gameOver,
  handleComputerTurn,
  socket,
}) => {
  const headerArray = Array.from(Array(COLUMNS).keys());

  // Ships on an empty layout
  let opponentLayout: Layout = computerShips.reduce(
    (prevLayout, currentShip) =>
      placeShipInLayout(prevLayout, currentShip, CELL_STATE.ship),
    generateEmptyBoard()
  );

  //Generate hits done by 1st player
  opponentLayout = hitsByPlayer.reduce(
    (prevLayout, currentHit) =>
      placeShipInLayout(prevLayout, currentHit, currentHit.type!),
    opponentLayout
  );

  // Updated sunken ships on 2nd player's board
  opponentLayout = computerShips.reduce(
    (prevLayout, currentShip) =>
      currentShip.sunk
        ? placeShipInLayout(prevLayout, currentShip, CELL_STATE.ship_sunk)
        : prevLayout,
    opponentLayout
  );

  const fireAway = (index: number) => {
    if (opponentLayout[index] === "ship") {
      const newHits = [
        ...hitsByPlayer,
        {
          position: indexToCoordinates(index),
          type: CELL_STATE.hit,
        },
      ];
      setHitsByPlayer(newHits);
      return newHits;
    } else if (opponentLayout[index] === "empty") {
      const newHits = [
        ...hitsByPlayer,
        {
          position: indexToCoordinates(index),
          type: CELL_STATE.miss,
        },
      ];
      setHitsByPlayer(newHits);
      return newHits;
    }
  };

  const playerTurn = currentState === "player-turn";
  const playerCanFire = playerTurn && !gameOver;

  const alreadyHit = (index: number) =>
    opponentLayout[index] === "hit" ||
    opponentLayout[index] === "miss" ||
    opponentLayout[index] === "ship-sunk";

  const onClickHandler = (index: number) => {
    if (playerCanFire && !alreadyHit(index)) {
      socket.emit("fire", index);
      socket.on("fire-reply", (cellClass: string) => {
        console.log("cell class:", cellClass);
        opponentLayout[index] = cellClass;
        const newHits = fireAway(index);
        const shipsWithSunkFlag = updateSunkShips(newHits!, computerShips);
        setComputerShips(shipsWithSunkFlag);
      });
      handleComputerTurn();
      socket.emit("next-turn");
    }
  };

  const opponentCells = opponentLayout.map((cell: string, index: number) => {
    return (
      <Cell
        onContextMenu={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        // className={
        //   stateToCSSClass[cell] === "hit" ||
        //   stateToCSSClass[cell] === "miss" ||
        //   stateToCSSClass[cell] === "ship-sunk" ||
        //     ? `${stateToCSSClass[cell]}`
        //     : ``
        // }
        className={stateToCSSClass[cell]}
        key={`opponent-cell-${index}`}
        id={`opponent-cell-${index}`}
        onClick={() => onClickHandler(index)}
      />
    );
  });

  return (
    <div>
      <div>
        <Typography variant="body1" align="center">
          Opponent's Screen
        </Typography>
      </div>
      <GridContainer>
        <GridHeader className="row">
          {headerArray.map((item: number) => (
            <HeaderCell key={item}>{String.fromCharCode(65 + item)}</HeaderCell>
          ))}
        </GridHeader>
        <RowHeader className="column">
          {headerArray.map((item: number) => (
            <HeaderCell key={item}>{item + 1}</HeaderCell>
          ))}
        </RowHeader>
        <Grid className="game-grid opponent-board">{opponentCells}</Grid>
      </GridContainer>
    </div>
  );
};

export default OpponentBoard;
