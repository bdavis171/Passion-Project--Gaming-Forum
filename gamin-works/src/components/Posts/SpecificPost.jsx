import React, { Component } from 'react';


class SpecificPost extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            title:"",
            body:"",
            replies:[],
         }
    }
    render() { 
        return ( 
            <div>
                <h3>Specific Post</h3>
            </div>
         );
    }
}
 
export default SpecificPost;