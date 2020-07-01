import React, { Component } from 'react';


class AddAPostforPlatform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            body: "",
            platformName: ""
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load game data
    loadData = async () => {
        let response = await fetch(`/api/platform/${this.props.match.params.platformName}`);
        let json = await response.json();

        // store game title and platform in the state
        this.setState({
            platformName: json.name
        });
    }

    // handle changes to fields
    handleChanges = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    // handle submission
    handleSubmission = async (event) => {
        event.preventDefault();
        let newPost = {
            title: this.state.title,
            body: this.state.body
        };

        let response = await fetch(`/api/posts/platform/${this.props.match.params.platformName}`, {
            method: "POST",
            headers: {
                "Authorization": sessionStorage.token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newPost)
        });

        let json = await response.json();
        console.log(json);
    }

    render() {
        return (
            <div>
                <div>
                    <h3>{this.state.platformName}</h3>

                </div>

                <h5>Create a Post</h5>
                <form action="">
                    <div className="form-group">
                        <label htmlFor="title">Title: {" "}</label>
                        <input type="text" name="title" id="title" onChange={this.handleChanges} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="body">Body: {" "}</label>
                        <textarea name="body" id="body" onChange={this.handleChanges} cols="30" rows="10"></textarea>
                    </div>

                    <div className="form-group">
                        <button type="submit" onClick={this.handleSubmission}>Submit</button>
                    </div>
                </form>

            </div>
        );
    }
}

export default AddAPostforPlatform;