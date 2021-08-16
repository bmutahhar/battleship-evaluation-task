import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
  component: any;
}

const PrivateRoute = ({ component, ...rest }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={(routerProps) =>
        token ? (
          React.createElement(component, routerProps)
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                from: routerProps.location,
              },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
