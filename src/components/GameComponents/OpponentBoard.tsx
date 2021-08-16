import React from "react";
import Typography from "@material-ui/core/Typography";
import {
  GridContainer,
  GridHeader,
  Grid,
  HeaderCell,
  RowHeader,
  Cell,
} from "./index";

const OpponentBoard = () => {
  const gridSize = 10;
  const headerArray = Array.from(Array(gridSize).keys());
  const cellArray = Array.from(Array(gridSize * gridSize).keys());
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
        <Grid className="game-grid">
          {cellArray.map((item: number) => {
            return <Cell key={item} />;
          })}
        </Grid>
      </GridContainer>
    </div>
  );
};

export default OpponentBoard;
