import React, { useState, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Alert from "../components/Alert";
import Typography from "@material-ui/core/Typography";
import Loader from "../components/Loader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import { AlertConfig, UserData } from "../models";

const Requests = () => {
  const [userList, setUserList] = useState<UserData[]>([]);
  const classes = useStyles();
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    open: false,
    message: "",
    color: "green",
  });
  const [loading, setLoading] = useState<Boolean>(true);

  const handleApproveUser = (userId: string) => {
    const newUserList = userList.filter(
      (item: UserData) => item._id !== userId
    );
    setUserList(newUserList);
    requestActionHandler("approve", userId);
  };
  const handleRejectUser = (userId: string) => {
    const newUserList = userList.filter(
      (item: UserData) => item._id !== userId
    );
    setUserList(newUserList);
    requestActionHandler("reject", userId);
  };

  const closeAlertHandler = () => {
    setAlertConfig({ ...alertConfig, open: false });
  };

  const getPendingRequests = () => {
    const url = "http://localhost:8080/admin/requests";
    const token = localStorage.getItem("token");
    fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((resp) => resp.json())
      .then((respJson) => {
        if (respJson.error) {
          setAlertConfig({ message: respJson.error, color: "red", open: true });
          setLoading(false);
        } else {
          setUserList(respJson.data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        setAlertConfig({ message: err.message, color: "red", open: true });
        setLoading(false);
      });
  };

  const requestActionHandler = (endPoint: string, userId: string) => {
    const url = `http://localhost:8080/admin/requests/${endPoint}/${userId}`;
    const token = localStorage.getItem("token");
    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((resp) => resp.json())
      .then((respJson) => {
        if (respJson.error) {
          setAlertConfig({ message: respJson.error, color: "red", open: true });
        } else {
          if (respJson.message) {
            setAlertConfig({
              message: respJson.message,
              color: "green",
              open: true,
            });
          } else {
            setAlertConfig({
              message: "Request status updated",
              color: "green",
              open: true,
            });
          }
        }
      })
      .catch((err: Error) => {
        setAlertConfig({ message: err.message, color: "red", open: true });
      });
  };

  useEffect(() => {
    getPendingRequests();
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0} variant="outlined">
        <div>
          <Typography className={classes.title} variant="h4" align="center">
            {userList.length === 0
              ? "No New Sign Up Requests"
              : "New Sign Up Requests"}
          </Typography>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <List className={classes.listRoot}>
            {userList.map((item: UserData, index: number) => (
              <ListItem key={index}>
                <ListItemIcon className={classes.itemIcon}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemText,
                    secondary: classes.secondaryItemText,
                  }}
                  primary={item.username}
                  secondary={item.email}
                />

                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      handleApproveUser(item._id);
                    }}
                  >
                    <CheckCircleOutlineOutlinedIcon
                      className={classes.approveIcon}
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleRejectUser(item._id);
                    }}
                  >
                    <CancelOutlinedIcon className={classes.rejectIcon} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <Alert
        open={alertConfig.open}
        handleClose={closeAlertHandler}
        message={alertConfig.message}
        color={alertConfig.color}
      />
    </div>
  );
};
export default Requests;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: `calc(100vh - (${theme.mixins.toolbar.minHeight}px + 10px))`,
  },
  paper: {
    height: "80%",
    maxHeight: "80%",
    width: "90%",
  },
  title: {
    margin: theme.spacing(2, 2),
    fontSize: "1.5rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "2rem",
    },
  },
  listRoot: {
    overflow: "auto",
    maxHeight: "inherit",
  },
  itemText: {
    fontSize: "1rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.15rem",
    },
  },
  secondaryItemText: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  itemIcon: {
    color: theme.palette.primary.light,
    minWidth: 35,
    [theme.breakpoints.up("sm")]: {
      minWidth: 56,
    },
  },
  approveIcon: {
    color: green[500],
    fontSize: 24,
    [theme.breakpoints.up("sm")]: {
      fontSize: 30,
    },
  },
  rejectIcon: {
    color: red[400],
    fontSize: 24,
    [theme.breakpoints.up("sm")]: {
      fontSize: 30,
    },
  },
}));
