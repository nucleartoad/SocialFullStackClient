import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
    let { id } = useParams();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    let navigate = useNavigate();
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`https://social-fullstack-edaefe4a2e52.herokuapp.com/auth/basicinfo/${id}`).then((response) => {
            setUsername(response.data.username);
        });

        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        } else {
            axios.get(`https://social-fullstack-edaefe4a2e52.herokuapp.com/posts/byUserId/${id}`, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
                setListOfPosts(response.data.listOfPosts);
                setLikedPosts(
                    response.data.likedPosts.map((like) => {
                        return like.PostId;
                    })
                );
            });
        }
    }, []);

    const likeAPost = (postId, e) => {
        e.stopPropagation();
        axios.post("https://social-fullstack-edaefe4a2e52.herokuapp.com/likes", { PostId: postId }, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
            setListOfPosts(
                listOfPosts.map((post) => {
                    if (post.id === postId) {
                        if (response.data.liked) {
                            return { ...post, Likes: [...post.Likes, 0] };
                        } else {
                            const likesArray = post.Likes;
                            likesArray.pop();
                            return { ...post, Likes: likesArray };
                        }
                    } else {
                        return post;
                    }
                })
            );
            if (likedPosts.includes(postId)) {
                setLikedPosts(
                    likedPosts.filter((id) => {
                        return id != postId;
                    })
                );
            } else {
                setLikedPosts([...likedPosts, postId]);
            }
            alert(`liked ${response.data.liked}`);
        });
    };

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1>Username: {username}</h1>
                {authState.username === username && <button onClick={() => {navigate("/changepassword")}}>Change My Password</button>}
            </div>
            <div className="listOfPosts">
                {listOfPosts.map((value, key) => {
                    return (
                        <div
                            key={key}
                            className="post"
                            onClick={() => {
                                navigate(`/post/${value.id}`);
                            }}
                        >
                            <div className="title"> {value.title} </div>
                            <div className="body"> {value.postText} </div>
                            <div className="footer">
                                <div className="username"> {value.username} </div>
                                <div className="buttons">
                                    <ThumbUpAltIcon onClick={(e) => likeAPost(value.id, e)} className={likedPosts.includes(value.id) ? "unlikeBttn" : "likedBttn"} />
                                    <label> {value.Likes.length} </label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Profile;
