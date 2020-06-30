import React, { Component } from 'react';


class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            bio: "",
            signature: "",
            profileImg: ""
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load user data
    loadData = async () => {
        let response = await fetch(`/users/${JSON.parse(sessionStorage.tokenUser).email}`);
        let json = await response.json();

        this.setState({
            name: json.name,
            email: json.email,
            bio: json.bio,
            signature: json.signature,
            profileImg: json.profileImg
        })
    }

    //function to handle changes in input fields and save them in state
    handleChanges = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    //handle submit button
    handleSubmission = async (event) => {
        event.preventDefault();
        //define data to be passed through the body
        let user;
        if (!this.state.password) {
            user = {
                name: this.state.name,
                email: this.state.email,
                bio: this.state.bio,
                signature: this.state.signature
            }
        } else {
            user = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                bio: this.state.bio,
                signature: this.state.signature
            }
        }

        //use fetch to import create method from server to register a new customer
        let response = await fetch(`/users/${this.props.match.params.id}`, {
            method: 'Put',
            headers: {
                'Accept': 'application/json',
                "Content-type": "application/json",

            },
            body: JSON.stringify(user)
        })
        let json = await response.json();

        let tokenUser = {
            name: json.name,
            email: json.email,
            role: json.role
        };
        sessionStorage.setItem("tokenUser", JSON.stringify(tokenUser))
        //sanity
        console.log(json);
        // sessionStorage.token = "";
        window.location = "/myProfile";
    }

    render() {
        return (
            <div>
                <h4>Edit Profile</h4>
                <form action="">
                    {/* <div>
                        <input type="file"/>
                    </div> */}

                    <div>
                        <label htmlFor="name">Name:{" "}</label>
                        <input type="text" id="name" name="name" onChange={this.handleChanges} value={this.state.name} />
                    </div>

                    <div>
                        <label htmlFor="email">Email:{" "}</label>
                        <input type="text" id="email" name="email" onChange={this.handleChanges} value={this.state.email} />
                    </div>

                    <div>
                        <label htmlFor="bio">Bio:{" "}</label>
                        <textarea name="bio" id="bio" onChange={this.handleChanges} value={this.state.bio} cols="30" rows="10"></textarea>
                    </div>

                    <div>
                        <label htmlFor="signature">Signature:{" "}</label>
                        <textarea name="signature" id="signature" onChange={this.handleChanges} value={this.state.signature} cols="30" rows="10"></textarea>
                    </div>

                    <div>
                        <button onClick={this.handleSubmission}>Update</button>
                    </div>
                </form>
                <div>
                    <button>Delete</button>
                </div>
            </div>
        );
    }
}

export default EditProfile;