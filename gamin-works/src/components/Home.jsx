import React, { Component } from 'react';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            recentPosts:[],
            popularGames:[],
            popularConsoles:[]
         }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // load data
    loadData = async() => {
        // load post data
        let response1 = await fetch("/api/posts");
        let json1 = await response1.json();
        console.log(json1)
        
        // load game data
        let response2 = await fetch("/api/games");
        let json2 = await response2.json();

        // load console data
        let response3 = await fetch("/api/platform");
        let json3 = await response3.json();

        // store the 10 most recent posts in the state
        for(let i = 0;i < 10; i++){
            this.state.recentPosts.push(json1[i]);
            this.setState({recentPosts: this.state.recentPosts});
        }
        console.log(this.state.recentPosts);
        
    }

    render() { 
        return ( 
            <div>
                <h4>Home</h4>
            </div>
         );
    }
}
 
export default Home;