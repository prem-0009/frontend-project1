import React, { Component } from "react";
import validator from "validator";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Appointment from "../appointment/Appointment";
import { withRouter } from "react-router-dom";

console.clear();

export default class Signup extends Component {
  state = {
    email: "",
    password: "",
    error: false,
    message: "",
    success: false,
    successMessage: "",
    isAuth: true,
  };

  componentDidMount() {
      console.log(this.props)
    let token = localStorage.getItem("jwtToken");
    console.log("signup", token);
    if (token) {
      let decoded = jwtDecode(token);
      this.props.history.push("/make-appointment");
    } else {
      this.props.history.push("/");
    }
    // //   console.log(this.props)
  }

  handleOnEmailChange = (event) => {
    const { email } = this.state;
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        if (validator.isEmail(email)) {
          this.setState({
            error: false,
            message: "",
          });
        } else {
          this.setState({
            error: true,
            message: "please enter correct email",
          });
        }
      }
    );
  };

  handleOnPasswordChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleOnSubmit = async (event) => {
    event.preventDefault();
    const { email, password, isAuth } = this.state;

    if (validator.isEmpty(email)) {
      this.setState({
        error: true,
        message: "please enter the email",
      });
      return;
    } else {
      this.setState({
        error: false,
        message: "",
      });
    }
    if (validator.isEmpty(password)) {
      this.setState({
        error: true,
        message: "please enter the password",
      });
      return;
    } else {
      this.setState({
        error: false,
        message: "",
      });
    }
    try {
      let sendToBack = await axios.post(
        "http://localhost:4000/users/create-user",
        {
          email: email,
          password: password,
        }
      );
      console.log("hi");

      console.log("from bak", sendToBack.data);
      localStorage.setItem("jwtToken", sendToBack.data.jwtToken);
      //push to history
      this.setState(
        {
          isAuth: true,
        },
        () => {
          this.props.auth(sendToBack.data.jwtToken);
          console.log(this.props);
          this.props.history.push("/make-appointment");
        }
      );

      //   console.log(localStorage)
      //   if (sendToBack.data.jwtToken) {
      //     this.setState(
      //       {
      //         isAuth: true,
      //       },
      //       () => {}
      //     );
      //   }
      console.log(this.props);
    } catch (e) {
      console.log(e);
      if (e.response.status === 409) {
        this.setState({
          error: true,
          message: "user already created",
        });
      }
    }

    // console.log(this.state);
  };
  render() {
    // console.log(localStorage);
    // console.log('props', this.props)
    const {
      email,
      error,
      message,
      success,
      successMessage,
      isAuth,
    } = this.state;
    return (
      <div>
        <div style={{ textAlign: "center", marginTop: "10%" }}>
          {error ? message : null}
        </div>
        <form style={{ textAlign: "center" }} onSubmit={this.handleOnSubmit}>
          <input
            style={{ marginTop: "15%" }}
            type="text"
            placeholder="enter email"
            onChange={this.handleOnEmailChange}
            name="email"
          />
          <br />
          <input
            type="text"
            placeholder="enter password"
            onChange={this.handleOnPasswordChange}
            name="password"
          />
          <br />
          <button style={{ marginTop: "2%" }}>submit</button>
        </form>
      </div>
    );
  }
}
