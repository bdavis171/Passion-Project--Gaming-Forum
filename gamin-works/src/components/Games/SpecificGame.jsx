import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class SpecificGame extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id:"",
            title:"",
            genre:"",
            platform:{},
            developer:"",
            publisher:"",
            releaseDate:"",
            relatedPosts:[]
         }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load data
    loadData = async() => {
        let response = await fetch(`/api/games/${this.props.match.params.gameID}`);
        let json = await response.json();

        // set the json data into the correct state properties
        this.setState({
            id: json._id,
            title: json.title,
            genre: json.genre,
            
            developer: json.developer,
            publisher: json.publisher,
            releaseDate: json.releaseDate,
            
        });

        if(json.platform){
            this.setState({platform: json.platform[0]})
        }

        if(json.relatedPosts){
            this.setState({relatedPosts: json.relatedPosts})
        }
        console.log(json);
    }

    // render the component
    render() {
        let editGame;
        if(JSON.parse(sessionStorage.tokenUser).role === "Admin") {
            editGame = <Link to= {`/games/edit/${this.state.id}`}>Edit Game</Link>
        } else {
            editGame = "";
        }
        return ( 
            <div>
                <h3>{this.state.title}</h3>
                <div>
                    <h4>Details</h4>
                    <p>Platform: {this.state.platform.name}</p>
                    <p>Title: {this.state.title}</p>
                    <p>Genre: {this.state.genre}</p>
                    <p>Developer: {this.state.developer}</p>
                    <p>Publisher: {this.state.publisher}</p>
                    <p>Release Date: {this.state.releaseDate}</p>
                </div>
                    {/* <button>Add to Collection</button> */}
                    {editGame}
                <div>
                    <h4>Posts</h4>
                    <p><strong>Title</strong>{" "}| Author{" "}| # of Posts{" "}| Date Created</p>
                    {this.state.relatedPosts.map(
                        (post) => {
                            let date = post.dateCreated.split("T")[0];
                            return (
                                <div key={post._id}>
                                    <Link to={`/posts/games/view/${post._id}`}><strong>{post.title}</strong>{" "}| {post.author[0].name}{" "}| {post.replies.length}{" "}| {date}</Link>
                                </div>
                            )
                        }
                    )}
                </div>

                <Link to={`/posts/games/createPost/${this.state.id}`}>Create A New Post</Link>
            </div>
         );
    }
}
 
export default SpecificGame;