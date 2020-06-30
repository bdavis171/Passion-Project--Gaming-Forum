import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import AddAPlatform from "./Platforms/AddAPlatform";
import SpecificPlatform from "./Platforms/SpecificPlatform";
import AllPlatforms from "./Platforms/AllPlatforms";
import AddAGame from "./Games/AddAGame";
import SpecificGame from "./Games/SpecificGame";
import AddAPostForGame from "./Posts/AddAPostForGame";
import SpecificGamePost from "./Posts/SpecificGamePost";
import AddAReply from "./Replies/AddAReply";
import AddAPostforPlatform from "./Posts/AddAPostforPlatform";
import SearchByGameTitle from "./Games/SearchByGameTitle";
import SpecificPlatformPost from "./Posts/SpecificPlatformPost";
import MyProfile from "./MyProfile";

class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            tokenUser: "",
            consoles: [],
            searchParam: ""
        };
    }

    componentDidMount = () => {
        this.loadConsoleData();
    }

    shouldComponentUpdate = () => {
        return true;
    }

    // load console data
    loadConsoleData = async () => {
        let response = await fetch("/api/platform");
        let json = await response.json();

        this.setState({ consoles: json });

    }

    // handle changes to search field
    handleSearch = (event) => {
        this.setState({searchParam: event.target.value});
    }

    // function to get the token when a user logs in
    getToken = async (token) => {
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
        console.log(sessionStorage.getItem("token"));
        console.log(JSON.parse(sessionStorage.tokenUser));
        window.location = "/";

    };

    // log out user
    handleLogout = (event) => {
        sessionStorage.setItem("token", "");
        window.location = "/";
    }

    render() {
        let handleLogin, handleRegister;
        if (sessionStorage.getItem("token")) {
            handleLogin = <Link to="/" onClick={this.handleLogout}>Logout{" "}</Link>;
            handleRegister = <Link to={`/users/myProfile`}>{JSON.parse(sessionStorage.tokenUser).name}{" "}</Link>;
        } else {
            handleLogin = <Link to="/login">Login{" "}</Link>;
            handleRegister = <Link to="/register">Register{" "}</Link>;
        }

        return (
            <div>
                <Router>
                    <Link to="/"><h1>Gamin' Works</h1></Link>
                    <nav>
                        {handleLogin}
                        {handleRegister}
                        <form>
                            <fieldset>
                                <input type="text" name="searchGame" id="searchGame" onChange={this.handleSearch} placeholder="Enter a Game Title"/>
                                <Link to={`/games/searchByTitle/${this.state.searchParam}`}><button>Search</button></Link>
                            </fieldset>
                        </form>
                        
                        {this.state.consoles.map(
                            (platform, index) => {

                                if (index === (this.state.consoles.length - 1) || index === (this.state.consoles.length - 2) || index === (this.state.consoles.length - 3) || index === (this.state.consoles.length - 4) || index === (this.state.consoles.length - 5) || index === (this.state.consoles.length - 6) || index === (this.state.consoles.length - 7))
                                    return (

                                        <Link key={index} to={`/consoles/view/${platform.name}`} >{platform.name}{" "}</Link>

                                    )

                            }
                        )}
                        {/* <Link to="/consoles/listOfConsoles">More Systems</Link> */}
                        

                        {/* User Routes */}
                        <Route path="/users/myProfile" component = {(props) => <MyProfile {...props}/>}/>
                        <Route path="/login" component={() => <Login getToken={this.getToken} />} />
                        <Route path="/register" component={() => <Register />} />

                        {/* Platform Routes */}
                        <Route path="/consoles/addConsole" component={() => <AddAPlatform />} />
                        <Route path="/consoles/listOfConsoles" component={() => <AllPlatforms />} />
                        <Route path="/consoles/view/:consoleName" component={(props) => <SpecificPlatform {...props} />} />

                        {/* Game Routes */}
                        <Route path="/games/addGame" component={() => <AddAGame />} />
                        <Route path="/games/view/:gameID" component={(props) => <SpecificGame {...props} />} />
                        <Route path="/games/searchByTitle/:searchParam" component={(props) => <SearchByGameTitle {...props}/>}/>

                        {/* Post Routes */}
                        <Route path="/posts/games/createPost/:gameID" exact component={(props) => <AddAPostForGame {...props} />} />
                        <Route path="/posts/consoles/createPost/:platformName" exact component={(props) => <AddAPostforPlatform {...props}/>}/>
                        <Route path="/posts/games/view/:id" component={(props) => <SpecificGamePost {...props}/>}/>
                        <Route path="/posts/consoles/view/:id" component={(props) => <SpecificPlatformPost {...props}/>}/>

                        {/* Reply Routes */}
                        <Route path="/reply/:postID" component={(props) => <AddAReply {...props}/>}/>
                    </nav>
                </Router>


            </div>
        )
    }
}

export default AppContainer;