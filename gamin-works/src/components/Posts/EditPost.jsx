import React, { Component } from 'react';


class EditPost extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            title: "",
            body: "",
            author:{}
         }
    }

    componentDidMount = () => {
        this.loadData();
    }

    // go back twice
    goBackTwice = () => {
        window.history.back();
        window.history.back();
    }

    // load post data
    loadData = async () => {
        let response = await fetch(`/api/posts/${this.props.match.params.id}`);
        let json = await response.json();
        this.setState({ 
            title: json.title,
            body: json.body,
            author: json.author[0]
         });
    }

    // handle changes to fields
    handleChanges = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    // handle submission
    handleSubmission = async (event) => {
        event.preventDefault();
        let updatedPost = {
            title: this.state.title,
            body: this.state.body
        };

        let response = await fetch(`/api/posts/${this.props.match.params.id}`, {
            method: "PUT",
            headers: {
                "Authorization": sessionStorage.token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(updatedPost)
        });

        let json = await response.json();
        console.log(json);
        window.history.back();
    }

    // delete post
    handleDelete = async(event) => {
        if(window.confirm("Are you sure you want to delete this post?")){
            let response = await fetch(`/api/posts/${this.props.match.params.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                }
            });

            let json = await response.json();
            console.log(json);
            window.alert("Post has been deleted");
            this.goBackTwice();
        }
    }

    render() { 
        let canEdit = false;
        if (JSON.parse(sessionStorage.tokenUser).role === "Admin" && JSON.parse(sessionStorage.tokenUser).id !== this.state.author._id){
            canEdit = true;
        }
        return ( 
            <div>
                <h4>Edit Post</h4>
                <form action="">
                    <div className="form-group">
                        <label htmlFor="title">Title: {" "}</label>
                        <input type="text" name="title" id="title" onChange={this.handleChanges} value={this.state.title} disabled = {canEdit}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="body">Body: {" "}</label>
                        <textarea name="body" id="body" onChange={this.handleChanges} cols="30" rows="10" value={this.state.body} disabled = {canEdit}></textarea>
                    </div>

                    <div className="form-group">
                        <button type="submit" onClick={this.handleSubmission} disabled = {canEdit}>Update</button>
                    </div>
                </form>
                <button onClick={this.handleDelete}>Delete</button>
            </div>
         );
    }
}
 
export default EditPost;