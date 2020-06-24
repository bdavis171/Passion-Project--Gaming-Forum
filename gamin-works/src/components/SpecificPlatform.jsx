import React, { Component } from 'react';


class SpecificPlatform extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name:"",
            maker:"",
            releaseDate:"",
            games:[]
         }
    }

    componentDidMount = () => {
        this.loadData();
    }

    shouldComponentUpdate = () => {
        return true;
    }

    // componentDidUpdate=() => {
        
    //     this.loadData();
        
    // }

    // load data
    loadData = async() => {
        let response = await fetch(`/api/platform/${this.props.match.params.consoleName}`);
        let json = await response.json();
        
        this.setState({
            name: json.name,
            maker: json.maker,
            releaseDate: json.releaseDate,
            games: json.games
        });
        console.log(this.state);
    }

    render() { 
        
          
        
        return ( 
            <div>
                <h5>{this.state.name}</h5>
            </div>
         );
    }
}
 
export default SpecificPlatform;