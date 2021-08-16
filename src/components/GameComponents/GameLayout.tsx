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
          <Typography align="center" variant="h6" className={classes.msg}>
            Place the ships
          </Typography>
        </MsgContainer>
      </Header>
      <GameContainer>
        <GridRow>
          <Harbor availableShips={props.availableShips} />
          <PlayerBoard />
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
    fontWeight: 500,
  },
}));
