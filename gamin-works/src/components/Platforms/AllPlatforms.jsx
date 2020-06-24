import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class AllPlatforms extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            consoles:[]
         }
    }

    componentDidMount= () => {
        this.loadData();
    }

    // load data
    loadData = async() => {
        let response = await fetch("/api/platform");
        let json = await response.json();
        this.setState({consoles: json});
    }

    render() { 
        return ( 
            <div>
                <h3>List of Game Consoles</h3>
                {this.state.consoles.map(
                    (console) => {
                        return (
                            <div key={console._id}>
                                <Link to={`/consoles/${console.name}`}>{console.name}</Link>
                            </div>
                        )
                    }
                )}
            </div>
         );
    }
}
 
export default AllPlatforms;