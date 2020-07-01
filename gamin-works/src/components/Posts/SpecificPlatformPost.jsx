import React, { Component } from 'react';
import { Link } from "react-router-dom";


class SpecificPlatformPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            title: "",
            body: "",
            replies: [],
            relatedPlatform: {},
            author: "",
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
            id: json._id,
            title: json.title,
            body: json.body,
            replies: json.replies,
            relatedPlatform: json.relatedPlatform[0],
            author: json.author,
            dateCreated: date
        });
        console.log(this.state);

    }

    render() {

        return (
            <div>

                <div>
                    <h3>{this.state.title}</h3>
                    <h4>{this.state.relatedPlatform.name}</h4>
                </div>
                <Link to={`/reply/add/${this.state.id}`}>Reply to this post</Link>

                <div>
                    <div>
                        <p>{this.state.author}{" "}{this.state.dateCreated}</p>
                    </div>
                    <div>
                        <p>{this.state.body}</p>
                        <Link to = {`/posts/general/edit/${this.state.id}`}>Edit Post</Link>
                    </div>
                    <br/>
                </div>

                <div>
                    {this.state.replies.map(
                        (reply) => {
                            let date = reply.dateCreated.split("T")[0];
                            let editLink;
                            
                            return (
                                <div key={reply._id}>
                                    <p>{reply.author}{" "}{date}</p>
                                    <p>{reply.body}</p>
                                    <Link to={`/reply/edit/${reply._id}`}>edit</Link>
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



export default SpecificPlatformPost;