import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


class EditGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            developer: "",
            publisher: "",
            releaseDate: "",
            hasSetDate: true,
            genre: "",
            redirect: false
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load game data
    loadData = async () => {
        let response = await fetch(`/api/games/${this.props.match.params.id}`);
        let json = await response.json();
        this.setState({
            title: json.title,
            genre: json.genre,
            developer: json.developer,
            publisher: json.publisher,
            releaseDate: json.releaseDate
        })
    }

    // handle if a game has a set release date
    handleReleaseDate = (event) => {
        if(event.target.id === "true"){
            this.setState({hasSetDate: true});
            console.log("yes");
        } else if (event.target.id === "false") {
            this.setState({hasSetDate: false});
            console.log("no");
        }
        // console.log(event.target.value);
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

        let response = await fetch(`/api/games/${this.props.match.params.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(game)
        });

        let json = await response.json();

        console.log(json);

    }

    // delete the game
    handleDelete = async(event) => {
        if(window.confirm("Are you sure you want to delete this game?")){
            let response = await fetch(`/api/games/${this.props.match.params.id}`,{
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            }
        });
        let json = await response.json();
        console.log(json);
        window.alert(`${this.state.title} has been deleted.`)
        }
        this.setState({redirect: true});
    }

    render() {
        let dateField;
        if (this.state.hasSetDate === true) {
            dateField = <div className="form-group">
                <label htmlFor="releaseDate">Release Date:{" "}</label>
                <input type="date" name="releaseDate" id="releaseDate" onChange={this.handleChanges} placeholder="Ex: March 14, 2008" />
            </div>
        } else {
            dateField = <div className="form-group">
                <label htmlFor="releaseDate">Release Date:{" "}</label>
                <input type="text" name="releaseDate" id="releaseDate" onChange={this.handleChanges} placeholder="Ex: March 14, 2008" />
            </div>
        }

        if(this.state.redirect){
            return <Redirect to="/home"/>
        }

        return (
            <div>
                <h4>Edit Game</h4>
                <form action="">
                    <div className="form-group">
                        <label htmlFor="title">Title:{" "}</label>
                        <input type="text" name="title" id="title" onChange={this.handleChanges} value={this.state.title} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="developer">Developer:{" "}</label>
                        <input type="text" name="developer" id="developer" onChange={this.handleChanges} value={this.state.developer} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="publisher">Publisher:{" "}</label>
                        <input type="text" name="publisher" id="publisher" onChange={this.handleChanges} value={this.state.publisher} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="genre">Genre:{" "}</label>
                        <input type="text" name="genre" id="genre" onChange={this.handleChanges} value={this.state.genre} />
                    </div>

                    <div>
                        <p>Does the game have a set release date?</p>
                        <label htmlFor="true">Yes</label>
                        <input type="radio" name="hasSetDate" id="true" value= {true} onClick={this.handleReleaseDate}/>

                        <label htmlFor="false">No</label>
                        <input type="radio" name="hasSetDate" id="false" value={false} onClick={this.handleReleaseDate}/>
                    </div>

                {dateField}

                    <div className="form-group">
                        <button type="submit" onClick={this.handleSubmission}>Update</button>
                    </div>
                </form>
                <button onClick={this.handleDelete}>Delete</button>
            </div>
        );
    }
}

export default EditGame;