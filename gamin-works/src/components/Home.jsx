import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recentPosts: [],
            popularGames: [],
            popularConsoles: []
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load data
    loadData = async () => {
        // load post data
        let response1 = await fetch("/api/posts");
        let json1 = await response1.json();


        // load game data
        let response2 = await fetch("/api/games");
        let json2 = await response2.json();

        // load console data
        let response3 = await fetch("/api/platform");
        let json3 = await response3.json();

        // store 10 recent post data in state
        for (let i = 0; i < 10; i++) {
            this.state.recentPosts.push(json1[i]);
            this.setState({ recentPosts: this.state.recentPosts });
        }
        console.log(this.state.recentPosts);

        // store the most popular game (based on # of posts) in state

        if (json2[0]) {
            let maxValue = json2[0].relatedPosts.length;
            for (let i = 0; i < json2.length; i++) {
                if (json2[i].relatedPosts.length >= maxValue) {
                    this.state.popularGames.push(json2[i]);
                    this.setState({ popularGames: this.state.popularGames });
                    maxValue = json2[i].relatedPosts.length;
                }
            }
        }
        console.log(this.state.popularGames);

        // store the most popular console (based on the # of posts) in state
        if(json3[0]){
            let maxValue = json3[0].relatedPosts.length;
            for (let i=0; i < json3.length;i++){
                if(json3[i].relatedPosts.length >= maxValue){
                    this.state.popularConsoles.push(json3[i]);
                    this.setState({popularConsoles: this.state.popularConsoles});
                    maxValue = json3[i].relatedPosts.length;
                }
            }
        }
        console.log(this.state.popularConsoles);


    }

    render() {
        return (
            <div>

                <div>
                    <h4>Recent Posts</h4>
                    {this.state.recentPosts.map(
                        (post) => {
                            if (post) {
                                let date = post.dateCreated.split("T")[0];
                                let relatedTopic, postLink;

                                if (post.relatedGame[0]) {
                                    console.log(post.relatedGame[0]);
                                    relatedTopic = <Link to={`/games/view/${post.relatedGame[0]._id}`}>{post.relatedGame[0].title} <br /> {post.relatedGame[0].platform[0].name}</Link>
                                    postLink = <Link to={`/posts/games/view/${post._id}`}><strong>{post.title}</strong>{" "}| {post.author[0].name}{" "}| {post.replies.length}{" "}| {date}</Link>
                                } else if (post.relatedPlatform[0]) {
                                    relatedTopic = <Link to={`/consoles/view/${post.relatedPlatform[0].name}`}>{post.relatedPlatform[0].name}</Link>
                                    postLink = <Link to={`/posts/consoles/view/${post._id}`}><strong>{post.title}</strong>{" "}| {post.author[0].name}{" "}| {post.replies.length + 1}{" "}| {date}</Link>
                                }

                                return (
                                    <div key={post._id}>
                                        {postLink}
                                        <br />
                                        {relatedTopic}
                                        <br />
                                        <br />
                                    </div>
                                )
                            }
                        }
                    )}
                </div>

                <div>
                    <h4>Popular Game</h4>
                    {
                        this.state.popularGames.map(
                            (game) => {
                                if (game) {
                                    return (
                                        <div key={game._id}>
                                            <Link to={`/games/view/${game._id}`}>{game.title}</Link>
                                        </div>
                                    )
                                }
                            }
                        )
                    }
                </div>

                <div>
                    <h4>Popular Console</h4>
                    {
                        this.state.popularConsoles.map(
                            (platform) => {
                                if(platform){
                                    return(
                                        <Link key={platform._id} to={`/consoles/view/${platform.name}`} >{platform.name}{" "}</Link>
                                    )
                                }
                            }
                        )
                    }
                </div>

            </div>
        );
    }
}

export default Home;