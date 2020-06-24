import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import AddAPlatform from "./AddAPlatform";
import SpecificPlatform from "./SpecificPlatform";
import AllPlatforms from "./AllPlatforms";

class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            tokenUser: "",
            consoles: []
        };
    }

    componentDidMount = () => {
        this.loadConsoleData();
    }

    // load console data
    loadConsoleData = async () => {
        let response = await fetch("/api/platform");
        let json = await response.json();

        this.setState({ consoles: json });

    }

    // function to get the token when a user logs in
    getToken = async (token) => {
        // this.setState({
        //     token: token
        // })
        // console.log(this.state);
        sessionStorage.setItem("token", token);
        // store the logged in users info in the state
        const response = await fetch('/users/verify', {
            method: "POST",
            headers: {
                "Authorization": sessionStorage.getItem("token")
            }
        });
        const json = await response.json();

        let tokenUser = {
            id: json.message.id,
            name: json.message.name,
            email: json.message.email,
            role: json.message.role
        };

        sessionStorage.setItem("tokenUser", JSON.stringify(tokenUser))
        // console.log(json);

        // this.setState({
        //     tokenUser: {
        //         id: json.message.id,
        //         name: json.message.name,
        //         email: json.message.email,
        //         role: json.message.role
        //     },
        // });
        // console.log(this.state.tokenUser);
        console.log(sessionStorage.getItem("token"));
        console.log(json);


    };

    render() {
        let handleLogin;
        if(sessionStorage.getItem("token")){
            handleLogin = <Link to="/">Logout{" "}</Link>;
        } else {
            handleLogin = <Link to="/login">Login{" "}</Link>;
        }
        let user = JSON.parse(sessionStorage.getItem("tokenUser"));
        console.log(sessionStorage.token);
        console.log(JSON.parse(sessionStorage.tokenUser).name)
        return (
            <div>
                <Router>
                    <Link to="/"><h1>Gamin' Works</h1></Link>
                    <nav>
                        {handleLogin}
                        <Link to="/register">Register{" "}</Link>
                        <Link to="/addConsole">Add Console{" "}</Link>
                        {this.state.consoles.map(
                            (platform, index) => {

                                if (index === (this.state.consoles.length - 1) || index === (this.state.consoles.length - 2) || index === (this.state.consoles.length - 3) || index === (this.state.consoles.length - 4) || index === (this.state.consoles.length - 5) || index === (this.state.consoles.length - 6) || index === (this.state.consoles.length - 7))
                                    return (

                                        <Link key={index} to={`/consoles/${platform.name}`}>{platform.name}{" "}</Link>

                                    )

                            }
                        )}
                        <Link to="/listOfConsoles">More Systems</Link>

                        <Route path="/login" component={() => <Login getToken={this.getToken} />} />
                        <Route path="/register" component={() => <Register />} />
                        <Route path="/addConsole" component={() => <AddAPlatform />} />
                        <Route path="/listOfConsoles" component={() => <AllPlatforms />} />
                        <Route path="/consoles/:consoleName" component={(props) => <SpecificPlatform {...props} />} />
                    </nav>
                </Router>


            </div>
        )
    }
}

export default AppContainer;