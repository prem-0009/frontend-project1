import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Signup from "./signup/Signup";
import Appointment from "./appointment/Appointment";
import PrivateRoute from "./shared/PrivateRoute";

export default class App extends Component {
  state = {
    isAuth: false,
    user: null,
  };

  componentDidMount() {
    let token = localStorage.getItem("jwtToken");
    console.log('app.js hi')

    if (token) {
      let decoded = jwtDecode(token);

      this.setState({
        isAuth: true,
        user: {
          email: decoded.email,
        },
      });
    }
  }

  auth = () => {
    // let decoded = jwtDecode(jwtToken);

    this.setState({
      isAuth: true,
      // user: {
      //   email: decoded.email,
      //   _id: decoded._id,
      // },
    });
  };

  logout = () => {
    localStorage.removeItem("jwtToken");
    this.setState({
      isAuth: false,
      user: null,
    });
  };

  render() {
    console.clear();
    console.log(this.props);
    return (
      <div>
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              component={(props) => <Signup {...props} auth={this.auth} logout={this.logout}/>}
            />
            
            <PrivateRoute
              exact
              path="/make-appointment"
              component={Appointment}
              isAuth={this.state.isAuth}
              logout={this.logout}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
