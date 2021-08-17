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

const GameLayout: React.FC<GameLayoutProps> = (props) => {
  const classes = useStyles();

  return (
    <Container>
      <Header>
        <div>
          <Button color="primary">Exit Game</Button>
          <Button color="primary">Log Out</Button>
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
          <OpponentBoard />
        </GridRow>
        <GridRow>
          <Button variant="contained" color="primary" disableElevation>
            Start Game
          </Button>
        </GridRow>
      </GameContainer>
    </Container>
  );
};

export default GameLayout;

const useStyles = makeStyles((theme: Theme) => ({
  msg: {
    margin: 0,
    fontFamily: "frijole",
  },
}));
