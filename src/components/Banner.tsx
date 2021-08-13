import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) => ({
  banner: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.secondary.main,
  },
  header: {
    color: "#fafafa",
    fontFamily: "Frijole",
    fontSize: "5rem",
    userSelect: "none",
    [theme.breakpoints.down("md")]: {
      fontSize: "4rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "3rem",
    },
  },
  subHeader: {
    color: "#fafafa",
    fontSize: "1.85rem",
    fontWeight: 400,
    userSelect: "none",
    [theme.breakpoints.down("md")]: {
      fontSize: "1.25rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
}));

const Banner = () => {
  const classes = useStyles();
  return (
    <div className={classes.banner}>
      <Typography className={classes.header} variant="h1">
        Battle Ship
      </Typography>
      <Typography className={classes.subHeader} variant="h4">
        Let's Begin
      </Typography>
    </div>
  );
};

export default Banner;
