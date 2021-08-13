import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Banner from "../components/Banner";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

interface UserCredentials {
  username: string;
  password: string;
}

const Login = () => {
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: "Mutahhar",
    password: "Admin123",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const classes = useStyles();
  const history = useHistory();

  const onChangeHandler = (event: React.ChangeEvent) => {
    const { name, value }: { name: string; value: string } =
      event.target as HTMLInputElement;
    setCredentials({ ...credentials, [name]: value.trim() });
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (credentials.username.trim().length === 0) {
      setErrorMessage("Please enter a username");
      return;
    } else if (credentials.password.trim().length === 0) {
      setErrorMessage("Please enter a password");
      return;
    }
    history.push("/admin/dashboard");
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
              Login to Play
            </Typography>
          </div>
          <Form noValidate autoComplete="off" onSubmit={onSubmitHandler}>
            <TextField
              id="username"
              name="username"
              label="Username"
              className={classes.textField}
              fullWidth
              onChange={onChangeHandler}
              onFocus={() => setErrorMessage("")}
              value={credentials.username}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              className={classes.textField}
              fullWidth
              onChange={onChangeHandler}
              onFocus={() => setErrorMessage("")}
              value={credentials.password}
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
              Log In
            </Button>
            {/* <div>
              <Link className={classes.link}>Forgot Password?</Link>
            </div> */}
          </Form>
          <div>
            <div>
              <Link className={classes.link} to="/signup">
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </FormContainer>
    </Container>
  );
};

export default Login;

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
    margin: "4rem 1rem 2rem",
    [theme.breakpoints.down("md")]: {
      margin: "2rem",
    },
  },

  textField: {
    marginTop: theme.spacing(2),
  },
  loginBtn: {
    marginTop: theme.spacing(3),
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
  padding: 3rem 1.5rem;
  margin-top: 1.5rem;
`;

const ErrorText = styled.span`
  display: inline-block;
  color: red;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;
