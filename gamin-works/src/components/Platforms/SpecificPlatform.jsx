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
        console.log(this.state);
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
        let displayGames, displayPosts;
        if (this.state.showGames) {
            displayGames = <div>
                <h5><strong>Games</strong></h5>
                {this.state.games.map(
                    game => {
                        return (
                            <div key={game._id}>
                                <Link to={`/games/view/${game._id}`}>{game.title}</Link>
                            </div>
                        )
                    }
                )}
            </div>;

            displayPosts = "";

        } else {
            displayGames = "";

            displayPosts = <div>
                <h5>Posts</h5>
                <p><strong>Title</strong>{" "}| Author{" "}| # of Posts{" "}| Date Created</p>
                {this.state.relatedPosts.map(
                    (post) => {
                        let date = post.dateCreated.split("T")[0];
                        return (
                            <div>
                                <Link to={`/posts/view/${post._id}`}><strong>{post.title}</strong>{" "}| {post.author}{" "}| {post.replies.length}{" "}| {date}</Link>
                            </div>
                        )
                    }
                )}
            </div>

        }


        return (
            <div>
                <h3>{this.state.name}</h3>

                <div>
                    <h5>Details</h5>
                    <p>Console Name: {this.state.name}</p>
                    <p>Console Maker: {this.state.maker}</p>
                    <p>Release Date: {this.state.releaseDate}</p>
                </div>

                <button onClick={this.handleDisplayGames}>Games</button>
                <button onClick={this.handleDisplayPosts}>Posts</button>
                {displayPosts}
                {displayGames}

                <Link to={`/posts/consoles/createPost/${this.state.name}`}>Create a Post</Link>

            </div>
        );
    }
}

export default SpecificPlatform;