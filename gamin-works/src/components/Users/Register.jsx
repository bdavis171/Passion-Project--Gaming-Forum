import React, { Component } from "react";
import { Redirect } from "react-router-dom";


class Register extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      name: "",
      email: "",
      password: "",
      role: "User",
      redirect: false
    };
  }

  //function to handle changes in input fields and save them in state
  handleChanges = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  //handle submit button
  handleSubmission = async (event) => {
    event.preventDefault();
    //define data to be passed through the body
    let newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      role: this.state.role
    }
    //use fetch to import create method from server to register a new customer
    let response = await fetch('/users/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-type": "application/json",

      },
      body: JSON.stringify(newUser)
    })
    let json = await response.json();

    //sanity
    console.log(json)
    this.setState({redirect: true});
  }

  render() {
    if(this.state.redirect){
      return <Redirect to = "/login"/>
    }

    return (
      <div>
        <h5>Register</h5>
        <form action="">
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleChanges} />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" value={this.state.email} onChange={this.handleChanges} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChanges} />
          </div>
          <button onClick={this.handleSubmission}>Submit</button>
        </form>
      </div>
    );
  }
}

export default Register;