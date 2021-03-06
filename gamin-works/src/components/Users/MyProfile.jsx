import React, { Component } from "react";
import { Link } from "react-router-dom";

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
      replies: [],
    };
  }

  componentDidMount = () => {
    this.loadData();
  };

  // load user data
  loadData = async () => {
    let response = await fetch(
      `/users/${JSON.parse(sessionStorage.tokenUser).id}`
    );
    let json = await response.json();
    this.setState({
      name: json.name,
      email: json.email,
      bio: json.bio,
      signature: json.signature,
      profileImg: json.profileImg,
      gamesOwned: json.gamesOwned,
      posts: json.posts,
      replies: json.replies,
    });
    console.log(json);
  };

  render() {
    let addConsole, recentPosts, recentReplies, gamesOwned;
    if (JSON.parse(sessionStorage.tokenUser).role === "Admin") {
      addConsole = (
        <Link className="addConsole-addGame-link" to="/consoles/addConsole">
          Add Console{" "}
        </Link>
      );
    } else {
      addConsole = "";
    }

    if (!this.state.posts[0]) {
      recentPosts = <p>No recent posts</p>;
    } else {
      recentPosts = (
        <div>
          {this.state.posts.map((post, index) => {
            let date = post.dateCreated.split("T")[0];
            let relatedTopic, postLink;
            if (
              index === this.state.posts.length - 1 ||
              index === this.state.posts.length - 2 ||
              index === this.state.posts.length - 3 ||
              (index === this.state.posts.length - 4) |
                (index === this.state.posts.length - 5)
            ) {
              if (post.relatedGame[0]) {
                console.log(post.relatedGame[0]);
                relatedTopic = (
                  <Link
                    className="relatedTopic-link"
                    to={`/games/view/${post.relatedGame[0]._id}`}
                  >
                    {post.relatedGame[0].title} -{" "}
                    {post.relatedGame[0].platform[0].name}
                  </Link>
                );
                postLink = (
                  <Link
                    className="post-link"
                    to={`/posts/games/view/${post._id}`}
                  >
                    <strong>{post.title}</strong> {date}
                  </Link>
                );
              } else if (post.relatedPlatform[0]) {
                relatedTopic = (
                  <Link
                    className="relatedTopic-link"
                    to={`/consoles/view/${post.relatedPlatform[0].name}`}
                  >
                    {post.relatedPlatform[0].name}
                  </Link>
                );
                postLink = (
                  <Link
                    className="post-link"
                    to={`/posts/consoles/view/${post._id}`}
                  >
                    <strong>{post.title}</strong> {date}
                  </Link>
                );
              }
              return (
                <div key={post._id}>
                  {postLink}
                  <br />
                  {relatedTopic}
                  <br />
                  <br />
                </div>
              );
            }
          })}
        </div>
      );
    }

    if (!this.state.replies[0]) {
      recentReplies = <p>No recent replies</p>;
    } else {
      recentReplies = this.state.replies.map((reply, index) => {
        let postLink;
        if (reply.relatedPost[0].relatedGame[0]) {
          postLink = (
            <Link
              className="post-link"
              to={`/posts/games/view/${reply.relatedPost[0]._id}`}
            >
              <strong>{reply.relatedPost[0].title}</strong>
            </Link>
          );
        } else if (reply.relatedPost[0].relatedPlatform[0]) {
          postLink = (
            <Link className="post-link" to={`/posts/consoles/view/${reply.relatedPost[0]._id}`}>
              <strong>{reply.relatedPost[0].title}</strong>
            </Link>
          );
        }
        if (
          index === 0 ||
          index === 1 ||
          index === 2 ||
          (index === 3) | (index === 4)
        ) {
          return (
            <div>
              <p>You replied to {postLink}</p>
            </div>
          );
        }
      });
    }

    if (!this.state.gamesOwned[0]) {
      gamesOwned = (
        <p>
          Hmmm... seems you don't have any games. When visiting a game's message
          board, click on the "Add to Collection" button to add a game here
        </p>
      );
    } else {
      gamesOwned = this.state.gamesOwned.map((game) => {
        return (
          <div key={game._id}>
            <Link to={`/games/view/${game._id}`}>{game.title}</Link>
          </div>
        );
      });
    }

    console.log(this.state.posts[0]);
    return (
      <div id="myProfile-container">
        <div id="profile-section">
          <img src={this.state.profileImg} alt="profile image" width="35%" />
          <br/>
          <Link to={`/users/edit/${JSON.parse(sessionStorage.tokenUser).id}`}>
            {" "}
            <button>Edit Profile</button>{" "}
          </Link>
          <div id="name-section">
            <h5>Name:</h5>
            <p>{this.state.name}</p>
          </div>

          <div id="contact-section">
            <h5>Contact:</h5>
            <p>{this.state.email}</p>
          </div>

          <div id="bio-section">
            <h5>Bio:</h5>
            <p>{this.state.bio}</p>
          </div>

          <div id="signature-section">
            <h5>Signature:</h5>
            <p>{this.state.signature}</p>
          </div>

          {addConsole}
          <br/>
          <br/>
        </div>

        <div id="recent-activity-section">
          <h4>Recent Activities</h4>
          <div id="recent-posts">
            <h5>Recent Posts</h5>
            {recentPosts}
          </div>
          <div id="recent-replies">
            <h5>Recent Replies</h5>
            {recentReplies}
          </div>
        </div>
        {/* 
                <div>
                    <h5>Your Games</h5>
                    {gamesOwned}
                </div> */}
      </div>
    );
  }
}

export default MyProfile;
