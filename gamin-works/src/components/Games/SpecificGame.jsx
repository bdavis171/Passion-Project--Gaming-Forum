import React, { Component } from 'react';


class SpecificGame extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            title:"",
            genre:"",
            platform:{},
            developer:"",
            publisher:"",
            releaseDate:"",
            relatedPosts:[]
         }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load data
    loadData = async() => {
        let response = await fetch(`/api/games/${this.props.match.params.gameID}`);
        let json = await response.json();
        this.setState({
            title: json.title,
            genre: json.genre,
            platform: json.platform[0],
            developer: json.developer,
            publisher: json.publisher,
            releaseDate: json.releaseDate,
            relatedPosts: json.relatedPosts
        });
        console.log(json);
    }

    render() { 
        return ( 
            <div>
                <h3>{this.state.title}</h3>
                <div>
                    <h4>Details</h4>
                    <p>Platform: {this.state.platform.name}</p>
                    <p>Title: {this.state.title}</p>
                    <p>Genre: {this.state.genre}</p>
                    <p>Developer: {this.state.developer}</p>
                    <p>Publisher: {this.state.publisher}</p>
                    <p>Release Date: {this.state.releaseDate}</p>
                </div>

                
            </div>
         );
    }
}
 
export default SpecificGame;