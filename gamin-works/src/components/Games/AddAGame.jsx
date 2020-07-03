import React, { Component } from 'react';

class AddAGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            genre: "",
            platform: "",
            developer: "",
            publisher: "",
            releaseDate: "",
            consoles:[]
        }
    }

    componentDidMount= () => {
        this.loadConsoleData();
    }

    // load data for consoles
    loadConsoleData = async() => {
        let response = await fetch("/api/platform");
        let json = await response.json();
        this.setState({consoles: json});
    }

    // handle changes to fields
    handleChanges = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    // handle submission
    handleSubmission = async (event) => {
        event.preventDefault();
        let game = {
            title: this.state.title,
            genre: this.state.genre,
            developer: this.state.developer,
            publisher: this.state.publisher,
            releaseDate: this.state.releaseDate
        };

        let response = await fetch(`/api/games/${this.state.platform}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(game)
        });

        let json = await response.json();

        console.log(json);
        if(json.errors || json.error){
            window.alert("Check all fields and make sure they are full");
        } else {
            window.location = `/games/view/${json._id}`;
        }

    }

    render() {
        return (
            <div>
                <h3>Add A Game</h3>
                <form action="">
                    <div className="form-group">
                        <label htmlFor="title">Title:{" "}</label>
                        <input type="text" name="title" id="title" onChange={this.handleChanges} placeholder="Ex: Megaman X"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="platform">Platform:{" "}</label>
                        <select name="platform" id="platform" onChange={this.handleChanges}>
                            <option value="">Choose a Platform</option>
                            {this.state.consoles.map(
                                (platform) => {
                                    return (
                                        <option key={platform._id} value={platform._id}>{platform.name}</option>
                                    )
                                }
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="developer">Developer:{" "}</label>
                        <input type="text" name="developer" id="developer" onChange={this.handleChanges} placeholder="Ex: Monolith Soft"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="publisher">Publisher:{" "}</label>
                        <input type="text" name="publisher" id="publisher" onChange={this.handleChanges} placeholder="Ex: Square Enix"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="genre">Genre:{" "}</label>
                        <input type="text" name="genre" id="genre" onChange={this.handleChanges} placeholder="Ex: Action Adventure" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="releaseDate">Release Date:{" "}</label>
                        <input type="date" name="releaseDate" id="releaseDate" onChange={this.handleChanges} />
                    </div>

                    <div className="form-group">
                        <button type="submit" onClick={this.handleSubmission}>Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddAGame;