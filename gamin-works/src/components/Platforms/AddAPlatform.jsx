import React, { Component } from 'react';


class AddAPlatform extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name:"",
            maker:"",
            releaseDate:""
         }
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

        let response = await fetch("/api/platform",{
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            body: JSON.stringify(platform)
        });

        let json = await response.json();

        console.log(json);
        if(json.errors || json.error){
            window.alert("Check all fields and make sure they are full");
        } else {
            window.location = `/consoles/view/${json.name}`;
        }
        

    }

    render() { 
        return ( 
            <div>
                <h5>Add A Platform</h5>
                <form action="">
                    <div className="form-group">
                        <label htmlFor="name">Name:{" "}</label>
                        <input type="text" name="name" id="name" onChange={this.handleChanges} placeholder="Ex: Playstation 3"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="maker">Maker:{" "}</label>
                        <input type="text" name="maker" id="maker" onChange={this.handleChanges} placeholder="Ex: Nintendo"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="releaseDate">Release Date:{" "}</label>
                        <input type="date" name="releaseDate" id="releaseDate" onChange={this.handleChanges} placeholder="Ex: January 1, 2020"/>
                    </div> 
                    
                    <div className="form-group">
                        <button type="submit" onClick={this.handleSubmission}>Submit</button>
                    </div>
                </form>
            </div>
         );
    }
}
 
export default AddAPlatform;