import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";

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
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/admin/dashboard">
            <AdminDashboard />
          </Route>
          <Route
            exact
            path="/admin"
            render={() => <Redirect to="/admin/dashboard" />}
          />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
