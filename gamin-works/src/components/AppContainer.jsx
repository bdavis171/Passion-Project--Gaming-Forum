import React, {Component} from "react";
import Login from "./Login";
import Register from "./Register";

class AppContainer extends Component{
    constructor(props) {
        super(props);
        // set the states empty intially
        this.state = {
         
          token: "",

        };
      }
    // fetch method to verify the user on login and assign them a token to give and recieve payload to hold onto/use
    getToken = async (token) => {
        this.setState({
            token: token
        })
        console.log(this.state);
        const response = await fetch('/users/verify', {
            method: "POST",
            headers: {
                "Authorization": this.state.token
            }
        });
        const json = await response.json();
        console.log(json);
        
            this.setState({
                tokenUser: {
                    id: json.message.id,
                    name: json.message.name,
                    email: json.message.email,
                    role: json.message.role
                },
            });
            console.log(this.state.tokenUser);
        
    };
    render(){

    

        return(
            <div>
                <Login getToken={this.getToken} tokenUser={this.state.tokenUser} token={this.state.token} />
                <Register/>
            </div>
        )
    }
}

export default AppContainer;