import React, { Component } from "react";


export default class Login extends Component {
  constructor(props) {
    super(props);
    // set the states empty intially
    this.state = {
      email: "",
      password: "",
      token: "",
      
    };
  }
  //handle changes in the input fields
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  //Sends user input to server which should return a token
  handleSubmission = async (event) => {
    event.preventDefault();
    let user = { email: this.state.email, password: this.state.password };
    let response = await fetch("/users/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    let json = await response.json();
    console.log(json);
    if (json.error) {
      window.alert(json.error);
    }
    this.setState({ token: json.token });
    console.log(this.state.token);
    this.props.getToken(json.token);
  };

  render() {
    return (
      <div>
        <div>
          <h5>Login</h5>
          <form action="">
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" value={this.state.email} onChange={this.handleChange}/>
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange}/>
          </div>
            <div>
              <button onClick={this.handleSubmission}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}