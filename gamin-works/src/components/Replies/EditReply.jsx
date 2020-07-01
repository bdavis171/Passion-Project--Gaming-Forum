import React, { Component } from 'react';


class EditReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            body: ""
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load reply data
    loadData = async () => {
        let response = await fetch(`/api/reply/${this.props.match.params.id}`);
        let json = await response.json();
        this.setState({ body: json.body });
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

    render() {
        return (
            <div>
                <h4>Edit Reply</h4>
                <form>
                    <div className="form-group">
                        <label htmlFor="body">Enter your message</label>
                        <textarea name="body" id="body" onChange={this.handleChanges} value={this.state.body} cols="30" rows="10"></textarea>
                    </div>

                    <div className="form-group">
                        <button onClick={this.handleSubmission}>Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default EditReply;