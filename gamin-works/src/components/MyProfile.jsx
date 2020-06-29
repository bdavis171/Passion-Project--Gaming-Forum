import React, { Component } from 'react';


class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            bio: "",
            signature: "",
            profileImg: "",
            gamesOwned: [],
            posts: [],
            replies: []
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
            profileImg: json.profileImg,
            gamesOwned: json.gamesOwned,
            posts: json.posts,
            replies: json.replies
        });
    }

    render() {
        return (
            <div>
                <div>
                    <img src={this.state.profileImg} alt="profile image" />
                    <p>{this.state.name}</p>

                    <div>
                        <h5>Contact:</h5>
                        <p>{this.state.email}</p>
                    </div>

                    <div>
                        <h5>Bio:</h5>
                        <p>{this.state.bio}</p>
                    </div>

                    <div>
                        <h5>Signature:</h5>
                        <p>{this.state.signature}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyProfile;