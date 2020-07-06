import React, { Component } from 'react';


class AddAReply extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            body:""
         }
    }

    // handle changes to fields
    handleChanges = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    // handle submission
    handleSubmission = async(event) => {
        event.preventDefault();
        let newReply = {
            body: this.state.body
        };

        let response = await fetch(`/api/reply/${this.props.match.params.postID}`,{
            method: "POST",
            headers: {
                "Authorization":sessionStorage.token,
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            body:JSON.stringify(newReply)
        });

        let json = await response.json();
        if(json.error || json.errors){
            console.log(json);
        } else {
            console.log(json);
            window.history.back();
        }
        
    }

    render() { 
        return ( 
            <div>
                <h3>Create a Reply</h3>
                <div className="form-group">
                    <label htmlFor="body">Enter your message</label>
                    <textarea name="body" id="body" onChange={this.handleChanges} cols="30" rows="10"></textarea>
                </div>

                <div className="form-group">
                    <button onClick={this.handleSubmission}>Submit</button>
                </div>
            </div>
         );
    }
}
 
export default AddAReply;