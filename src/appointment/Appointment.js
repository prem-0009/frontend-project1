import React, { Component } from "react";
import axios from "axios";
import "./Appointment.css";
import jwtDecode from "jwt-decode";

export default class Appointment extends Component {
  state = {
    timeOne: "9:30",
    timeTwo: "10:30",
    timeThree: "11:30",
    timeFour: "12:30",
    timeFive: "01:30",
    appointmentTime: "",
    done: false,
    message: "",
    disabledOne: false,
    disabledtwo: false,
    disabledthree: false,
    error: false,
    eMessage: "",
  };

  componentDidMount() {
    console.clear();
    console.log('appointment props', this.props)
    console.log(this.props);
    let token = localStorage.getItem("jwtToken");
    if (token) {
        let decoded = jwtDecode(token);
        console.log(decoded);//checking to see what comes here..
      this.props.history.push("/make-appointment");
    } else {
      this.props.history.push("/");
    }
  }

  handleOnChangeTime = (event) => {
    // console.log(event.target);

    this.setState({
      appointmentTime: event.target.value,
    });
  };

  handleOnSubmit = async (event) => {
    event.preventDefault();
    const { appointmentTime } = this.state;
    
    //get email or id from local storage
    let token = localStorage.getItem("jwtToken");
    
        let decoded = jwtDecode(token);
console.log(decoded)
    
    try {
      const sendBack = await axios.post(
        "http://localhost:4000/todo/make-appointment",
        {
          appointmentTime: appointmentTime,
          //have to send email or id
          email:decoded.email,


        }
      );

      console.log(sendBack.data);
      console.log("props", this.props);
      if ((sendBack.data.status = 409)) {
        this.setState({
          error: true,
          eMessage: `${sendBack.data.message}`,
        });
      }
      
      if (sendBack.data.message === `see you at ${appointmentTime}`) {
        localStorage.removeItem("jwtToken");
        console.log("hi");
        this.setState(
          {
            done: true,
            message: sendBack.data.message,
          },
          () => {
            this.props.logout();
          }
        );
      }

      //   this.setState(
      //     {
      //       done: true,

      //       message: `${sendBack.data.message}.`,
      //     },
      //     () => {
      //       localStorage.removeItem("jwtToken");
      //       this.setState({
      //         isAuth: false,
      //         user: null, //??
      //       });
      //     }
      //   );
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {
      done,
      message,
      disabledOne,
      disabledtwo,
      disabledthree,
      error,
      eMessage,
    } = this.state;
    // console.log(this.props)
    return (
      <div>
        <form onSubmit={this.handleOnSubmit}>
          {done ? message : null}
          {error ? eMessage : null}
          <div style={{ textAlign: "center" }}>
            <input
              onChange={this.handleOnChangeTime}
              type="radio"
              name="appointmentTime"
              value={this.state.timeOne}
              className={`${disabledOne ? "disabled" : ""}`}
            />
            09:30
            <input
              onChange={this.handleOnChangeTime}
              type="radio"
              name="appointmentTime"
              value={this.state.timeTwo}
              className={`${disabledtwo ? "disabled" : ""}`}
            />
            10:30
            <input
              onChange={this.handleOnChangeTime}
              type="radio"
              name="appointmentTime"
              value={this.state.timeThree}
              className={`${disabledthree ? "disabled" : ""}`}
            />
            11:30
            <input
              onChange={this.handleOnChangeTime}
              type="radio"
              name="appointmentTime"
              value={this.state.timeFour}
              className={`${disabledthree ? "disabled" : ""}`}
            />
            12:30
            <input
              onChange={this.handleOnChangeTime}
              type="radio"
              name="appointmentTime"
              value={this.state.timeFive}
              className={`${disabledthree ? "disabled" : ""}`}
            />
            01:30
            <br />
            <button>submit</button>
          </div>
        </form>
      </div>
    );
  }
}
