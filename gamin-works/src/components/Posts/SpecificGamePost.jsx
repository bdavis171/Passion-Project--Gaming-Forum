import React, { Component } from 'react';
import {Link} from "react-router-dom";

class SpecificGamePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:"",
            title: "",
            body: "",
            replies: [],
            relatedGame: {},
            platform: {},
            author: {},
            dateCreated: ""

        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load data
    loadData = async () => {
        let response = await fetch(`/api/posts/${this.props.match.params.id}`);
        let json = await response.json();

        // exact the actual date from the dateCreated property of the json
        let date = json.dateCreated.split("T")[0];
        // store the data into the state
        this.setState({
            id:json._id,
            title: json.title,
            body: json.body,
            replies: json.replies,
            relatedGame: json.relatedGame[0],
            platform: json.relatedGame[0].platform[0],
            author: json.author[0],
            dateCreated: date
        });
        console.log(this.state);

    }

    render() {
        let editPost;
        if(JSON.parse(sessionStorage.tokenUser).id === this.state.author._id || JSON.parse(sessionStorage.tokenUser).role === "Admin"){
            editPost = <Link to = {`/posts/general/edit/${this.state.id}`}>Edit Post</Link>
        } else {
            editPost = "";
        }
        return (
            <div>

                <div>
                    <h3>{this.state.title}</h3>
                    <h4>{this.state.relatedGame.title}</h4>
                    <h5>{this.state.platform.name}</h5>
                </div>
            <Link to = {`/reply/add/${this.state.id}`}>Reply to this post</Link>

                <div>
                    <div>
                        <p>{this.state.author.name}{" "}{this.state.dateCreated}</p>
                    </div>
                    <div>
                        <p>{this.state.body}</p>
                        {editPost}
                    </div>
                    <br/>
                </div>

                <div>
                {this.state.replies.map(
                        (reply) => {
                            let date = reply.dateCreated.split("T")[0];
                            let editLink;
                            if(JSON.parse(sessionStorage.tokenUser).id === reply.author[0]._id || JSON.parse(sessionStorage.tokenUser).role === "Admin"){
                                editLink = <Link to={`/reply/edit/${reply._id}`}>edit</Link>;
                            } else {
                                editLink = "";
                            }
                            return (
                                <div key={reply._id}>
                                    <p>{reply.author[0].name}{" "}{date}</p>
                                    <p>{reply.body}</p>
                                    {editLink}
                                    <hr/>
                                </div>
                            )
                        }
                    )}
                </div>


            </div>
        );
    }
}

export default SpecificGamePost;