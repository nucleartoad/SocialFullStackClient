import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { AuthContext } from "../helpers/AuthContext";

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    let navigate = useNavigate();
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate("/login");
        } else {
            axios.get("https://social-fullstack-edaefe4a2e52.herokuapp.com/posts", { headers: { accessToken: localStorage.getItem("accessToken") }}).then((response) => {
                setListOfPosts(response.data.listOfPosts);
                setLikedPosts(response.data.likedPosts.map((like) => {return like.PostId}));
            });
        }
    }, []);

    const goToProfile = (userId, e) => {
        e.stopPropagation();
        navigate(`/profile/${userId}`);
    }

    const likeAPost = (postId, e) => {
        e.stopPropagation();
        axios
            .post(
                "https://social-fullstack-edaefe4a2e52.herokuapp.com/likes", 
                { PostId: postId }, 
                { headers: { accessToken: localStorage.getItem("accessToken") } 
            })
            .then((response) => {
                setListOfPosts(listOfPosts.map((post) => {
                    if (post.id === postId) {
                        if (response.data.liked) {
                            return {...post, Likes: [...post.Likes, 0]};
                        } else {
                            const likesArray = post.Likes;
                            likesArray.pop();
                            return {...post, Likes: likesArray};
                        }
                    } else {
                        return post;
                    };
                }));
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
        <div>
            {listOfPosts.map((value, key) => {
                return (
                    <div
                        key={key}
                        className="post"
                        onClick={() => {
                            navigate(`/post/${value.id}`);
                        }}
                    >
                        <div className="title">{value.title}</div>
                        <div className="body">{value.postText}</div>
                        <div className="footer">
                            <div className="username" onClick={(e) => goToProfile(value.UserId, e)}>{value.username}</div>
                            <div className="buttons">
                                <ThumbUpAltIcon onClick={(e) => likeAPost(value.id, e)} className={likedPosts.includes(value.id) ? "unlikeBttn" : "likedBttn"}/>
                                <label> {value.Likes.length} </label>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Home;
