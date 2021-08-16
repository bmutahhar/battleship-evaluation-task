import React, { useState, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { AlertConfig, UserDisplayData } from "../models";

const RemoveUsers = () => {
  const [userList, setUserList] = useState<UserDisplayData[]>([]);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    open: false,
    message: "",
    color: "green",
  });
  const [loading, setLoading] = useState<Boolean>(true);
  const classes = useStyles();

  const handleRemoveUser = (userId: string) => {
    const newUserList = userList.filter(
      (item: UserDisplayData) => item._id !== userId
    );
    setUserList(newUserList);
    deleteActionHandler(userId);
  };

  const deleteActionHandler = (userId: string) => {
    const url = `http://localhost:8080/admin/deleteUser/${userId}`;
    const token = localStorage.getItem("token");
    fetch(url, {
      method: "DELETE",
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
              message: "User removed successfully",
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

  const closeAlertHandler = () => {
    setAlertConfig({ ...alertConfig, open: false });
  };

  const getAllUsers = () => {
    const token = localStorage.getItem("token");
    const url = "http://localhost:8080/admin/users";
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((resp) => resp.json())
      .then((respJson) => {
        if (respJson.error) {
          setAlertConfig({ message: respJson.error, color: "red", open: true });
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

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0} variant="outlined">
        <div>
          <Typography className={classes.title} variant="h4" align="center">
            {userList.length === 0 ? "User List Empty" : "Remove Users"}
          </Typography>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <List className={classes.listRoot}>
            {userList.map((item: UserDisplayData) => (
              <ListItem key={item._id}>
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
                      handleRemoveUser(item._id);
                    }}
                  >
                    <DeleteForeverIcon className={classes.deleteIcon} />
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

export default RemoveUsers;

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
  deleteIcon: {
    color: theme.palette.primary.light,
    fontSize: 24,
    [theme.breakpoints.up("sm")]: {
      fontSize: 30,
    },
  },
}));
