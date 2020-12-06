import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuth, ...rest }) => {
  // console.clear()
  console.log("isauth", isAuth);
  //   console.log(props)
  return (
    <Route
      //   {...rest}
      render={(props) =>
        isAuth ? (
          <Component {...props} {...rest} isAuth={isAuth} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;
