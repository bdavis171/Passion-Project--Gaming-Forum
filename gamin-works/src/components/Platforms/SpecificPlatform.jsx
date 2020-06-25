import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class SpecificPlatform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            maker: "",
            releaseDate: "",
            games: [],
            relatedPosts: []
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

    // render the component
    render() {



        return (
            <div>
                <h3>{this.state.name}</h3>

                <div>
                    <h5>Details</h5>
                    <p>Console Name: {this.state.name}</p>
                    <p>Console Maker: {this.state.maker}</p>
                    <p>Release Date: {this.state.releaseDate}</p>
                </div>

                <div>
                    <h5><strong>Games</strong></h5>
                    {this.state.games.map(
                        game => {
                            return (
                                <div key={game._id}>
                                    <Link to={`/games/${game._id}`}>{game.title}</Link>
                                </div>
                            )
                        }
                    )}
                </div>

            </div>
        );
    }
}

export default SpecificPlatform;