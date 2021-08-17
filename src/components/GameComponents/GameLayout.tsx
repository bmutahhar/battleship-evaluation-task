import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { GameLayoutProps } from "../../models";
import {
  Container,
  Header,
  MsgContainer,
  GameContainer,
  GridRow,
} from "./index";
import PlayerBoard from "./PlayerBoard";
import OpponentBoard from "./OpponentBoard";
import Harbor from "./Harbor";
import GameOver from "./GameOver";
import "./css/styles.css";

const GameLayout: React.FC<GameLayoutProps> = (props) => {
  const classes = useStyles();
  if (props.gameOver) {
    return (
      <GameOver
        winner={props.winner}
        startAgain={props.startAgain}
        quitGame={props.quitGame}
      />
    );
  } else {
    return (
      <Container>
        <Header>
          <div>
            <Button color="primary" onClick={props.startAgain}>
              Exit Game
            </Button>
            <Button color="primary" onClick={props.quitGame}>
              Log Out
            </Button>
          </div>
          <MsgContainer>
            <Typography
              align="center"
              variant="h4"
              color="primary"
              className={classes.msg}
            >
              Battle Ship
            </Typography>
          </MsgContainer>
        </Header>
        <GameContainer>
          <GridRow>
            <Harbor
              availableShips={props.availableShips}
              selectShip={props.selectShip}
              currentSelectedShip={props.currentSelectedShip}
            />
            <PlayerBoard
              currentSelectedShip={props.currentSelectedShip}
              setCurrentSelectedShip={props.setCurrentSelectedShip}
              shipsOnBoard={props.shipsOnBoard}
              placeShipOnBoard={props.placeShipOnBoard}
              hitsByComputer={props.hitsByComputer}
              rotateShip={props.rotateShip}
            />
            <OpponentBoard
              computerShips={props.computerShips}
              setComputerShips={props.setComputerShips}
              hitsByPlayer={props.hitsByPlayer}
              setHitsByPlayer={props.setHitsByPlayer}
              currentState={props.currentState}
              // checkIfGameOver={props.checkIfGameOver}
              gameOver={props.gameOver}
              handleComputerTurn={props.handleComputerTurn}
            />
          </GridRow>
          <GridRow>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              disabled={props.availableShips.length > 0}
              onClick={props.startTurn}
            >
              Start Game
            </Button>
          </GridRow>
        </GameContainer>
      </Container>
    );
  }
};

export default GameLayout;

const useStyles = makeStyles((theme: Theme) => ({
  msg: {
    margin: 0,
    fontFamily: "frijole",
  },
}));
