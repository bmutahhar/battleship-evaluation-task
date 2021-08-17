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
import { Layout, PlayerBoardProps, ShipAttributes } from "../../models";
import {
  COLUMNS,
  calculateOutOfBoundCells,
  canBePlaced,
  CELL_STATE,
  generateEmptyBoard,
  indexToCoordinates,
  placeShipInLayout,
  stateToCSSClass,
} from "../../utils/layoutUtils";

const PlayerBoard: React.FC<PlayerBoardProps> = ({
  currentSelectedShip,
  setCurrentSelectedShip,
  shipsOnBoard,
  placeShipOnBoard,
  hitsByComputer,
  rotateShip,
}) => {
  const headerArray = Array.from(Array(COLUMNS).keys());

  // Player ships on empty layout
  let layout = shipsOnBoard.reduce(
    (prevLayout: Layout, currentShip: ShipAttributes) =>
      placeShipInLayout(prevLayout, currentShip, CELL_STATE.ship),
    generateEmptyBoard()
  );

  // Hits by computer
  layout = hitsByComputer.reduce(
    (prevLayout: Layout, currentHit: ShipAttributes) =>
      placeShipInLayout(prevLayout, currentHit, currentHit.type!),
    layout
  );

  //Place sunken ships
  layout = shipsOnBoard.reduce(
    (prevLayout: Layout, currentShip: ShipAttributes) =>
      currentShip.sunk
        ? placeShipInLayout(prevLayout, currentShip, CELL_STATE.ship_sunk)
        : prevLayout,
    layout
  );

  const isPlacingOnBoard =
    currentSelectedShip && currentSelectedShip.position != null;
  const canPlaceCurrentShip =
    isPlacingOnBoard && canBePlaced(currentSelectedShip!, layout);
  if (isPlacingOnBoard) {
    if (canPlaceCurrentShip) {
      layout = placeShipInLayout(layout, currentSelectedShip!, CELL_STATE.ship);
    } else {
      const forbiddenShip = {
        ...currentSelectedShip,
        length:
          currentSelectedShip!.length! -
          calculateOutOfBoundCells(currentSelectedShip!),
      };
      layout = placeShipInLayout(layout, forbiddenShip, CELL_STATE.forbidden);
    }
  }

  const cells = layout.map((cell: string, index: number) => {
    return (
      <Cell
        onContextMenu={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        onMouseDown={rotateShip}
        onClick={() => {
          if (canPlaceCurrentShip) {
            placeShipOnBoard(currentSelectedShip!);
          }
        }}
        className={stateToCSSClass[cell]}
        key={`cell-${index}`}
        id={`cell-${index}`}
        onMouseOver={() => {
          if (currentSelectedShip) {
            setCurrentSelectedShip({
              ...currentSelectedShip,
              position: indexToCoordinates(index),
            });
          }
        }}
      />
    );
  });

  return (
    <div>
      <div>
        <Typography variant="body1" align="center">
          Your Screen
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
        <Grid className="game-grid">{cells}</Grid>
      </GridContainer>
    </div>
  );
};

export default PlayerBoard;
