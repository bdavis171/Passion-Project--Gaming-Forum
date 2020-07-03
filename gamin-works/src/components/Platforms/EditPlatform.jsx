import React, { Component } from 'react';


class EditPlatform extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            maker: "",
            releaseDate: ""
         }
    }

    componentDidMount = () => {
        this.loadData();
    }

     // load data
     loadData = async () => {
        let response = await fetch(`/api/platform/${this.props.match.params.name}`);
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

      // handle changes to fields
      handleChanges = (event) => {
        this.setState({[event.target.id]:event.target.value});
    }

    // handle submission
    handleSubmission = async(event) => {
        event.preventDefault();
        let platform = {
            name: this.state.name,
            maker: this.state.maker,
            releaseDate: this.state.releaseDate
        };

        let response = await fetch(`/api/platform/${this.props.match.params.name}`,{
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            body: JSON.stringify(platform)
        });

        let json = await response.json();

        console.log(json);

        window.location = `/consoles/view/${json.name}`;

    }

    // delete the console
    handleDelete = async(event) => {
        if(window.confirm("Are you sure you want to delete this console?")){
            let response = await fetch(`/api/platform/${this.props.match.params.name}`,{
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            }
        });
        let json = await response.json();
        console.log(json);
        window.alert(`${this.state.name} has been deleted.`);
         window.location = "/home";
        }
       
    }

    render() { 
       
        return ( 
            <div>
                <h4>Edit Platform</h4>
                <form action="">
                    <div className="form-group">
                        <label htmlFor="name">Name:{" "}</label>
                        <input type="text" name="name" id="name" onChange={this.handleChanges} value={this.state.name}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="maker">Maker:{" "}</label>
                        <input type="text" name="maker" id="maker" onChange={this.handleChanges} value={this.state.maker}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="releaseDate">Release Date:{" "}</label>
                        <input type="date" name="releaseDate" id="releaseDate" onChange={this.handleChanges} value={this.state.releaseDate}/>
                    </div> 
                    
                    <div className="form-group">
                        <button type="submit" onClick={this.handleSubmission}>Update</button>
                    </div>
                </form>
                <button onClick={this.handleDelete}>Delete</button>
            </div>
         );
    }
}
 
export default EditPlatform;