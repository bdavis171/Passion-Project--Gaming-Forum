import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Login from "./Users/Login";
import Register from "./Users/Register";
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
import MyProfile from "./Users/MyProfile";
import EditProfile from "./Users/EditProfile";
import EditReply from "./Replies/EditReply";
import EditPost from "./Posts/EditPost";
import EditGame from "./Games/EditGame";
import EditPlatform from "./Platforms/EditPlatform";
import Home from "./Home";
import "./style.css";

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      tokenUser: "",
      consoles: [],
      searchParam: "",
    };
  }

  componentDidMount = () => {
    this.loadConsoleData();
  };

  shouldComponentUpdate = () => {
    return true;
  };

  // load console data
  loadConsoleData = async () => {
    let response = await fetch("/api/platform");
    let json = await response.json();

    this.setState({ consoles: json });
  };

  // handle changes to search field
  handleSearch = (event) => {
    this.setState({ searchParam: event.target.value });
  };

  // function to get the token when a user logs in
  getToken = async (token) => {
    sessionStorage.setItem("token", token);
    // store the logged in users info in the state
    const response = await fetch("/users/verify", {
      method: "POST",
      headers: {
        Authorization: sessionStorage.getItem("token"),
      },
    });
    const json = await response.json();

    let tokenUser = {
      id: json.message.id,
      name: json.message.name,
      email: json.message.email,
      role: json.message.role,
    };

    sessionStorage.setItem("tokenUser", JSON.stringify(tokenUser));
    console.log(sessionStorage.getItem("token"));
    console.log(JSON.parse(sessionStorage.tokenUser));
    window.location = "/home";
  };

  // log out user
  handleLogout = (event) => {
    sessionStorage.setItem("token", "");
    window.location = "/home";
  };

  render() {
    let handleLogin, handleRegister;
    if (sessionStorage.getItem("token")) {
      handleLogin = (
        <Link to="/home" onClick={this.handleLogout} className="login-logout-link">
          Logout{" "}
        </Link>
      );
      handleRegister = (
        <Link to={`/users/myProfile`} className="register-myProfile-link">
          {JSON.parse(sessionStorage.tokenUser).name}{" "}
        </Link>
      );
    } else {
      handleLogin = <Link to="/login"  className="login-logout-link">Login </Link>;
      handleRegister = <Link to="/register" className="register-myProfile-link">Register </Link>;
    }

    return (
      <div>
        <Router>
          <div id="nav-bar">
            <Link to="/home" id="home-link">
              <img src="/gaminWorksLogo.png" alt="Gamin' Works"/>
            </Link>
            {handleLogin}
            {handleRegister}
            <form id="search-bar">
              <fieldset>
                <input
                  type="text"
                  name="searchGame"
                  id="searchGame"
                  onChange={this.handleSearch}
                  placeholder="Enter a Game Title"
                />
                <Link to={`/games/searchByTitle/${this.state.searchParam}`}>
                  <button>Search</button>
                </Link>
              </fieldset>
            </form>

            <div className="dropdown">
              <button className="dropbtn">Select a Console</button>
              <div className="dropdown-content">
                {this.state.consoles.map((platform, index) => {
                  return (
                    <div>
                      <Link
                        className="content"
                        key={index}
                        to={`/consoles/view/${platform.name}`}
                      >
                        {platform.name}{" "}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            </div>

            {/* User Routes */}
            <Route
              path="/users/myProfile"
              component={(props) => <MyProfile {...props} />}
            />
            <Route
              path="/login"
              component={() => <Login getToken={this.getToken} />}
            />
            <Route path="/register" component={() => <Register />} />
            <Route
              path="/users/edit/:id"
              component={(props) => <EditProfile {...props} />}
            />
            <Route path="/home" component={() => <Home />} />

            {/* Platform Routes */}
            <Route
              path="/consoles/addConsole"
              component={() => <AddAPlatform />}
            />
            <Route
              path="/consoles/listOfConsoles"
              component={() => <AllPlatforms />}
            />
            <Route
              path="/consoles/view/:consoleName"
              component={(props) => <SpecificPlatform {...props} />}
            />
            <Route
              path="/consoles/edit/:name"
              component={(props) => <EditPlatform {...props} />}
            />

            {/* Game Routes */}
            <Route path="/games/addGame" component={() => <AddAGame />} />
            <Route
              path="/games/view/:gameID"
              component={(props) => <SpecificGame {...props} />}
            />
            <Route
              path="/games/searchByTitle/:searchParam"
              component={(props) => <SearchByGameTitle {...props} />}
            />
            <Route
              path="/games/edit/:id"
              component={(props) => <EditGame {...props} />}
            />

            {/* Post Routes */}
            <Route
              path="/posts/games/createPost/:gameID"
              exact
              component={(props) => <AddAPostForGame {...props} />}
            />
            <Route
              path="/posts/consoles/createPost/:platformName"
              exact
              component={(props) => <AddAPostforPlatform {...props} />}
            />
            <Route
              path="/posts/games/view/:id"
              component={(props) => <SpecificGamePost {...props} />}
            />
            <Route
              path="/posts/consoles/view/:id"
              component={(props) => <SpecificPlatformPost {...props} />}
            />
            <Route
              path="/posts/general/edit/:id"
              component={(props) => <EditPost {...props} />}
            />

            {/* Reply Routes */}
            <Route
              path="/reply/add/:postID"
              component={(props) => <AddAReply {...props} />}
            />
            <Route
              path="/reply/edit/:id"
              component={(props) => <EditReply {...props} />}
            />
          
        </Router>
      </div>
    );
  }
}

export default AppContainer;
