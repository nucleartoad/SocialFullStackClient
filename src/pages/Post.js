import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, []);

    const addComment = () => {
        axios.post("http://localhost:3001/comments", { commentBody: newComment, PostId: id }, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
                setNewComment("");
            } else {
                const commentToAdd = { commentBody: newComment, username: response.data.username };
                setComments([...comments, commentToAdd]);
                setNewComment("");
            }
        });
    };

    const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then(() => {
            setComments(
                comments.filter((val) => {
                    return val.id != id;
                })
            );
        });
    };

    const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then(() => {
            alert("deleted post");
            navigate("/");
        });
    };

    const editPost = (option, e) => {
        e.stopPropagation();
        if (option === "title") {
            let newTitle = prompt("Enter New Title");
            axios.put(`http://localhost:3001/posts/title`, { newTitle: newTitle, id: id }, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
                setPostObject({ ...postObject, title: newTitle });
                console.log(response.data);
            });
        } else {
            let newBody = prompt("Enter New Post Text");
            axios.put("http://localhost:3001/posts/body", { newBody: newBody, id: id }, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
                setPostObject({ ...postObject, postText: newBody });
                console.log(response.data);
            });
        }
    };

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div
                        className="title"
                        onClick={(e) => {
                            if (authState.username === postObject.username) {
                                editPost("title", e);
                            }
                        }}
                    >
                        {postObject.title}
                    </div>
                    <div
                        className="body"
                        onClick={(e) => {
                            if (authState.username === postObject.username) {
                                editPost("body", e);
                            }
                        }}
                    >
                        {postObject.postText}
                    </div>
                    <div className="footer">
                        {postObject.username}
                        {authState.username === postObject.username && (
                            <button
                                onClick={() => {
                                    deletePost(postObject.id);
                                }}
                            >
                                Delete Post
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input
                        type="text"
                        placeholder="comment..."
                        value={newComment}
                        onChange={(event) => {
                            setNewComment(event.target.value);
                        }}
                    />
                    <button onClick={addComment}>Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment">
                                {comment.commentBody}
                                <label> Username: {comment.username}</label>
                                {authState.username === comment.username && (
                                    <button
                                        onClick={() => {
                                            deleteComment(comment.id);
                                        }}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;
