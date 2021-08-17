import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { GameOverProps } from "../../models";

const GameOver: React.FC<GameOverProps> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <Typography className={classes.title} variant="h3" color="primary">
          Battle Ship
        </Typography>
        <Typography variant="h6" color="primary">
          Game Over
        </Typography>
      </div>
      <div>
        <Typography variant="h6" color="secondary" gutterBottom>
          Winner
        </Typography>
        <Typography variant="h4">{props.winner}</Typography>
      </div>
      <div className={classes.btnWrapper}>
        <Button
          color="primary"
          className={classes.btn}
          onClick={props.startAgain}
        >
          Restart
        </Button>
        <Button
          color="primary"
          variant="contained"
          className={classes.btn}
          onClick={props.quitGame}
        >
          Quit
        </Button>
      </div>
    </div>
  );
};

export default GameOver;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    textAlign: "center",
    width: "100%",
    height: "100vh",
  },
  title: {
    fontFamily: "frijole",
    userSelect: "none",
    margin: theme.spacing(2),
  },
  btnWrapper: {
    display: "flex",
  },
  btn: {
    padding: theme.spacing(1, 4),
    margin: theme.spacing(2),
    fontSize: "1.1rem",
    fontWeight: 500,
  },
}));
