import React from "react";
import styled from "styled-components";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { CellContentProps } from "../models";

const Game = () => {
  const classes = useStyles();
  const theme = useTheme();
  const gridSize = 10;
  const headerArray = Array.from(Array(gridSize).keys());
  const cellArray = Array.from(Array(gridSize * gridSize).keys());
  return (
    <Container>
      <Header>
        <div>
          <Button color="primary">Exit Game</Button>
          <Button color="primary">Log Out</Button>
        </div>
        <MsgContainer>
          <Typography align="center" variant="h6" className={classes.msg}>
            Place the ships
          </Typography>
        </MsgContainer>
      </Header>
      <GameContainer>
        <div className={classes.gridContainer}>
          <div>
            <Typography variant="body1" align="center">
              Your Screen
            </Typography>
          </div>
          <div>
            <GridContainer>
              <GridHeader className="row">
                {headerArray.map((item: number) => (
                  <HeaderCell key={item}>
                    {String.fromCharCode(65 + item)}
                  </HeaderCell>
                ))}
              </GridHeader>
              <RowHeader className="column">
                {headerArray.map((item: number) => (
                  <HeaderCell key={item}>{item + 1}</HeaderCell>
                ))}
              </RowHeader>
              <Grid
                borderColor={theme.palette.primary.light}
                className="game-grid"
              >
                {cellArray.map((item: number) => {
                  return (
                    <Cell
                      key={item}
                      borderColor={theme.palette.primary.light}
                    />
                  );
                })}
              </Grid>
            </GridContainer>
          </div>
        </div>
        <div className={classes.gridContainer}>
          <div>
            <Typography variant="body1" align="center">
              Opponent's Screen
            </Typography>
          </div>
          <div>
            <GridContainer>
              <GridHeader className="row">
                {headerArray.map((item: number) => (
                  <HeaderCell key={item}>
                    {String.fromCharCode(65 + item)}
                  </HeaderCell>
                ))}
              </GridHeader>
              <RowHeader className="column">
                {headerArray.map((item: number) => (
                  <HeaderCell key={item}>{item + 1}</HeaderCell>
                ))}
              </RowHeader>
              <Grid
                borderColor={theme.palette.primary.light}
                className="game-grid"
              >
                {cellArray.map((item: number) => {
                  return (
                    <Cell
                      key={item}
                      borderColor={theme.palette.primary.light}
                    />
                  );
                })}
              </Grid>
            </GridContainer>
          </div>
        </div>
      </GameContainer>
    </Container>
  );
};

export default Game;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f7f7f7;
`;

const Header = styled.header`
  width: 100%;
  height: 10vh;
  max-height: 10%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const MsgContainer = styled.div`
  flex-grow: 1;
`;

const GameContainer = styled.div`
  height: 90vh;
  width: 100%;
  /* border: 2px solid red; */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
`;

const GridContainer = styled.div`
  width: 70vh;
  height: 70vh;
  /* border: 2px solid green; */
  display: grid;
  grid-template-columns: 0.1fr 1.9fr;
  grid-template-rows: 0.1fr 1.9fr;
  gap: 0px 0px;
  grid-template-areas:
    ". row"
    "column game-grid";

  .row {
    grid-area: row;
  }
  .column {
    grid-area: column;
  }
  .game-grid {
    grid-area: game-grid;
  }
`;

const GridHeader = styled.div`
  /* border: 2px solid pink; */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RowHeader = styled.div`
  /* border: 2px solid cyan; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div<CellContentProps>`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  border: ${(props) => `1px solid ${props.borderColor}`};
`;

const HeaderCell = styled.div<CellContentProps>`
  width: 10%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Cell = styled.div<CellContentProps>`
  width: 10%;
  height: 10%;
  /* border: ${(props) => `0.5px solid ${props.borderColor}`}; */
  border: 1px solid rgba(86, 104, 209, 0.5);
`;

const useStyles = makeStyles((theme: Theme) => ({
  msg: {
    fontWeight: 500,

    [theme.breakpoints.up(768)]: {
      marginLeft: "-10rem",
    },
  },
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    width: "50&",
  },
}));
