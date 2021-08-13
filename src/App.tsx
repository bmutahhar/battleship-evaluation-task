import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5668D1",
    },
    secondary: {
      main: "#11183F",
    },
  },
  typography: {
    fontFamily: ["Poppins", "Frijole"].join(","),
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path={["/", "/login"]}>
            <Login />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
