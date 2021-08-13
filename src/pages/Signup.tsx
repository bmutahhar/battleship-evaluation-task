import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Banner from "../components/Banner";
import styled from "styled-components";

interface UserData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  retypePassword: string;
}

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState<UserData>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    retypePassword: "",
  });
  const classes = useStyles();

  const onChangeHandler = (event: React.ChangeEvent) => {
    const { name, value }: { name: string; value: string } =
      event.target as HTMLInputElement;
    setUserData({ ...userData, [name]: value.trim() });
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (userData.fullname.trim().length === 0) {
      setErrorMessage("Please enter your full name");
      return;
    } else if (userData.username.trim().length === 0) {
      setErrorMessage("Please enter your username");
      return;
    } else if (userData.email.trim().length === 0) {
      setErrorMessage("Please enter your email address");
      return;
    } else if (userData.password.trim().length === 0) {
      setErrorMessage("Please enter your password");
      return;
    } else if (userData.retypePassword.trim().length === 0) {
      setErrorMessage("Please retype your password");
      return;
    } else if (userData.username.trim().length < 5) {
      setErrorMessage("Username must be at least 5 characters long");
      return;
    } else if (!validEmailRegex.test(userData.email.trim())) {
      setErrorMessage("Email address must be a valid email");
      return;
    } else if (!validPasswordRegex.test(userData.password.trim())) {
      setErrorMessage(`Password must be minimum eight characters, at least one letter,
       one number and one special character`);
      return;
    } else if (userData.password.trim() !== userData.retypePassword.trim()) {
      setErrorMessage("Password do not match correctly");
      return;
    }
    console.log(userData);
  };

  return (
    <Container>
      <BannerContainer>
        <Banner />
      </BannerContainer>
      <FormContainer>
        <div className={classes.formRoot}>
          <div>
            <Typography
              className={classes.formHeader}
              variant="h4"
              align="center"
            >
              Sign Up to Play
            </Typography>
          </div>
          <Form noValidate autoComplete="off" onSubmit={onSubmitHandler}>
            <TextField
              id="fullname"
              name="fullname"
              label="Full Name"
              className={classes.textField}
              fullWidth
              onFocus={() => setErrorMessage("")}
              onChange={onChangeHandler}
            />
            <TextField
              id="username"
              name="username"
              label="Username"
              className={classes.textField}
              fullWidth
              onFocus={() => setErrorMessage("")}
              onChange={onChangeHandler}
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              className={classes.textField}
              fullWidth
              onFocus={() => setErrorMessage("")}
              onChange={onChangeHandler}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              className={classes.textField}
              fullWidth
              onFocus={() => setErrorMessage("")}
              onChange={onChangeHandler}
            />
            <TextField
              id="retypePassword"
              name="retypePassword"
              label="Retype Password"
              type="password"
              className={classes.textField}
              fullWidth
              onFocus={() => setErrorMessage("")}
              onChange={onChangeHandler}
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
              Sign Up
            </Button>
          </Form>
          <div>
            <div>
              <Link className={classes.link} to="/login">
                Already have an account? Log In
              </Link>
            </div>
          </div>
        </div>
      </FormContainer>
    </Container>
  );
};

export default Signup;

const useStyles = makeStyles((theme: Theme) => ({
  formRoot: {
    width: "80%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },

  formHeader: {
    padding: "1rem",
    [theme.breakpoints.down("md")]: {
      padding: 0,
      fontSize: "1.85rem",
    },
  },

  textField: {
    marginTop: theme.spacing(2),
  },
  loginBtn: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  link: {
    cursor: "pointer",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Container = styled.div`
  display: flex;
`;

const BannerContainer = styled.div`
  width: 70%;
  height: 100vh;
  text-align: center;
  @media screen and (max-width: 768px) {
    width: 60%;
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const FormContainer = styled.div`
  width: 30%;
  height: 100vh;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  @media screen and (max-width: 768px) {
    width: 40%;
  }
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

const Form = styled.form`
  padding: 0.5rem 1.5rem;
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
