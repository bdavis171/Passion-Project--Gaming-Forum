import React, { Component } from 'react';


class EditReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            body: "",
            author: {}
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load reply data
    loadData = async () => {
        let response = await fetch(`/api/reply/${this.props.match.params.id}`);
        let json = await response.json();
        this.setState({ body: json.body, author: json.author[0] });
    }

    // handle changes to fields
    handleChanges = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    // handle submission
    handleSubmission = async (event) => {
        event.preventDefault();
        let newReply = {
            body: this.state.body,
            author: JSON.parse(sessionStorage.tokenUser).name,
            authorEmail: JSON.parse(sessionStorage.tokenUser).email
        };

        let response = await fetch(`/api/reply/${this.props.match.params.id}`, {
            method: "PUT",
            headers: {
                "Authorization": sessionStorage.token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newReply)
        });

        let json = await response.json();
        console.log(json);
        window.history.back();
    }

    // delete reply
    handleDelete = async(event) => {
        if(window.confirm("Are you sure you want to delete this reply?")){
            let response = await fetch(`/api/reply/${this.props.match.params.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                }
            });

            let json = await response.json();
            console.log(json);
            window.alert("Reply has been deleted");
            window.history.back();
        }
    }

    render() {
        let canEdit = false;
        if (JSON.parse(sessionStorage.tokenUser).role === "Admin" && JSON.parse(sessionStorage.tokenUser).id !== this.state.author._id){
            canEdit = true
        }
        return (
            <div>
                <h4>Edit Reply</h4>
                <form>
                    <div className="form-group">
                        <label htmlFor="body">Enter your message</label>
                        <textarea name="body" id="body" onChange={this.handleChanges} value={this.state.body} cols="30" rows="10" disabled={canEdit}></textarea>
                    </div>

                    <div className="form-group">
                        <button onClick={this.handleSubmission} disabled={canEdit}>Submit</button>
                    </div>
                </form>
                <button onClick={this.handleDelete}>Delete</button>
            </div>
        );
    }
}

export default EditReply;