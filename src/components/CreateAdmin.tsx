import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import { AdminData, AlertConfig } from "../models";
import Alert from "../components/Alert";

const CreateAdmin = () => {
  const [adminData, setAdminCredentials] = useState<AdminData>({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    open: false,
    message: "",
    color: "green",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const classes = useStyles();

  const onChangeHandler = (event: React.ChangeEvent) => {
    const { name, value }: { name: string; value: string } =
      event.target as HTMLInputElement;
    setAdminCredentials({ ...adminData, [name]: value.trim() });
  };

  const closeAlertHandler = () => {
    setAlertConfig({ ...alertConfig, open: false });
  };

  const submitData = () => {
    const url: string = "http://localhost:8080/admin/createAdmin";
    const token = localStorage.getItem("token");
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },

      body: JSON.stringify({
        username: adminData.username,
        fullName: adminData.fullName,
        email: adminData.email,
        password: adminData.password,
      }),
    })
      .then((resp) => resp.json())
      .then((respJSON) => {
        // If response object exists
        if (respJSON) {
          if (respJSON.error) {
            // If error is an object and has msg
            if (respJSON.error.msg) {
              setAlertConfig({
                message: respJSON.error?.msg,
                color: "red",
                open: true,
              });
            }
            // else if error is a string
            else if (respJSON.error) {
              setAlertConfig({
                message: respJSON.error,
                color: "red",
                open: true,
              });
            }
            // no error object, message property
            else {
              if (respJSON.message) {
                setAlertConfig({
                  message: respJSON.message,
                  color: "red",
                  open: true,
                });
              }
              // Custom error message, not reachable in 99% cases
              else {
                setAlertConfig({
                  message: "Some error occured while parsing your request",
                  color: "red",
                  open: true,
                });
              }
            }
          }
          //Success case
          else {
            setAlertConfig({
              message: "Admin account created successfully.",
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

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (adminData.fullName.trim().length === 0) {
      setErrorMessage("Please enter your full name");
      return;
    } else if (adminData.username.trim().length === 0) {
      setErrorMessage("Please enter your username");
      return;
    } else if (adminData.email.trim().length === 0) {
      setErrorMessage("Please enter your email address");
      return;
    } else if (adminData.password.trim().length === 0) {
      setErrorMessage("Please enter your password");
      return;
    } else if (adminData.username.trim().length < 5) {
      setErrorMessage("Username must be at least 5 characters long");
      return;
    } else if (!validEmailRegex.test(adminData.email.trim())) {
      setErrorMessage("Email address must be a valid email");
      return;
    } else if (!validPasswordRegex.test(adminData.password.trim())) {
      setErrorMessage(`Password must be minimum eight characters, at least one letter,
       one number and one special character`);
      return;
    } else {
      submitData();
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0} variant="outlined">
        <div className={classes.titleWrapper}>
          <Icon>
            <PersonAddIcon className={classes.titleIcon} />
          </Icon>
          <Typography className={classes.title} variant="h5">
            Create New Admin
          </Typography>
        </div>
        <Form noValidate autoComplete="off" onSubmit={onSubmitHandler}>
          <TextField
            id="fullName"
            name="fullName"
            label="Full Name"
            className={classes.textField}
            variant="outlined"
            size="small"
            fullWidth
            onChange={onChangeHandler}
            onFocus={() => setErrorMessage("")}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            size="small"
            className={classes.textField}
            variant="outlined"
            fullWidth
            onChange={onChangeHandler}
            onFocus={() => setErrorMessage("")}
          />
          <TextField
            id="username"
            name="username"
            label="Username"
            size="small"
            className={classes.textField}
            variant="outlined"
            fullWidth
            onChange={onChangeHandler}
            onFocus={() => setErrorMessage("")}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            className={classes.textField}
            fullWidth
            onChange={onChangeHandler}
            onFocus={() => setErrorMessage("")}
          />
          <ErrorText>{errorMessage}</ErrorText>
          <Button
            className={classes.loginBtn}
            variant="contained"
            color="primary"
            type="submit"
            disableElevation
            fullWidth
          >
            Create Account
          </Button>
        </Form>
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

export default CreateAdmin;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: `calc(100vh - (${theme.mixins.toolbar.minHeight}px + 10px))`,
  },
  paper: {
    height: "90%",
    maxHeight: "90%",
    width: "70%",
    [theme.breakpoints.up(769)]: {
      width: "50%",
    },
    [theme.breakpoints.down(460)]: {
      width: "90%",
    },
  },
  titleWrapper: {
    textAlign: "center",
    margin: theme.spacing(2),
  },
  title: {
    fontSize: "1.25rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.5rem",
    },
  },
  titleIcon: {
    color: theme.palette.primary.light,
    fontSize: 42,
    [theme.breakpoints.up("sm")]: {
      fontSize: 50,
    },
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  loginBtn: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

const Form = styled.form`
  padding: 1.5rem;
  margin-top: 1.5rem;
  width: 70%;
  margin: 0 auto;
  text-align: center;
  @media screen and (max-width: 600px) {
    width: 90%;
    padding: 3rem 0.5rem;
  }
`;

const ErrorText = styled.span`
  display: inline-block;
  color: red;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const validEmailRegex =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const validPasswordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
