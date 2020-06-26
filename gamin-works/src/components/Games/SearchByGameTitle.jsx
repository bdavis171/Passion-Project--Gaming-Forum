import React, { Component } from 'react';
import { Link } from "react-router-dom";


class SearchByGameTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: []
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load search data
    loadData = async () => {
        let response = await fetch(`/api/games/searchByTitle/${this.props.match.params.searchParam}`);
        let json = await response.json();
        console.log(json);

        // store results into the state
        this.setState({ searchResults: json });
    }

    render() {
        return (
            <div>
                <h3>Results</h3>
                <div>
                    {this.state.searchResults.map(
                        (game) => {
                            return (
                                <Link key={game._id} to={`/games/view/${game._id}`}>
                                    <p>{game.title}</p>
                                    <p>{game.platform[0].name}</p>
                                    <br/>
                                </Link>
                            )
                        }
                    )}
                </div>
            </div>
        );
    }
}

export default SearchByGameTitle;