import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import AddAPostforPlatform from "../Posts/AddAPostforPlatform";


class SpecificPlatform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            maker: "",
            releaseDate: "",
            games: [],
            relatedPosts: [],
            showGames: true,
            showPosts: false
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    componentDidUpdate = () => {
        // if the state.name and the URL parameter do not match, reload the data
        if (!(this.state.name === this.props.match.params.consoleName)) {
            this.loadData();
        }
    }

    // load data
    loadData = async () => {
        let response = await fetch(`/api/platform/${this.props.match.params.consoleName}`);
        let json = await response.json();

        // set the json data into the correct state properties
        this.setState({
            name: json.name,
            maker: json.maker,
            releaseDate: json.releaseDate,
            games: json.games,
            relatedPosts: json.relatedPosts
        });
        console.log(json);
    }

    // handle displaying game list
    handleDisplayGames = (event) => {
        if (this.state.showPosts) {
            this.setState({
                showGames: true,
                showPosts: false
            });
        }
    }

    // handle displaying post list
    handleDisplayPosts = (event) => {
        if (this.state.showGames) {
            this.setState({
                showGames: false,
                showPosts: true
            });
        }
    }

    // render the component
    render() {
        let displayGames, displayPosts, editPlatform,addGame;

        if (JSON.parse(sessionStorage.tokenUser).role === "Admin") {
            
            addGame = <Link className="addConsole-addGame-link" to="/games/addGame">Add Game</Link>;
        } else {
            
            addGame = "";
        }

        if(JSON.parse(sessionStorage.tokenUser).role === "Admin"){
            editPlatform = <Link className="post-link" to={`/consoles/edit/${this.state.name}`}>Edit</Link>;
        } else {
            editPlatform = "";
        }

        if (this.state.showGames) {
            displayGames = <div id="games-section">
                <h5><strong>Games</strong></h5>
                <div id="games">
                
                {this.state.games.map(
                    game => {
                        return (
                            <div key={game._id}>
                                <Link className="post-link" to={`/games/view/${game._id}`}>{game.title}</Link>
                                <br/>
                                <br/>
                            </div>
                        )
                    }
                )}
                </div>
                <br/>
                {addGame}
            </div>;

            displayPosts = "";

        } else {
            displayGames = "";

            displayPosts = <div id="console-posts-section">
                <h5>Posts</h5>
                <p><strong>Title</strong>{" "}| Author{" "}| # of Posts{" "}| Date Created</p>
                <div id="console-posts">
                {this.state.relatedPosts.map(
                    (post) => {
                        let date = post.dateCreated.split("T")[0];
                        return (
                            <div>
                                <Link className="post-link" to={`/posts/consoles/view/${post._id}`}><strong>{post.title}</strong>{" "}| {post.author[0].name}{" "}| {post.replies.length + 1}{" "}| {date}</Link>
                                <br/>
                                <br/>
                            </div>
                        )
                    }
                )}
                
                </div>
                <br/>
                <Link className="post-link" to={`/posts/consoles/createPost/${this.state.name}`}>Create a Post</Link>
                <br/>
                <br/>
            </div>

        }


        return (
            <div id="console-container">
                <h3>{this.state.name}</h3>

                <div id="console-details">
                    <h5>Details</h5>
                    <p>Console Name: {this.state.name}</p>
                    <p>Console Maker: {this.state.maker}</p>
                    <p>Release Date: {this.state.releaseDate}</p>
                    {editPlatform}
                </div>
            
            <div id="game-post-btn">
                <button id="game-btn" onClick={this.handleDisplayGames}>Games</button>
                <button id="post-btn" onClick={this.handleDisplayPosts}>Posts</button>
            </div>
                
                {displayPosts}
                {displayGames}

                

            </div>
        );
    }
}

export default SpecificPlatform;