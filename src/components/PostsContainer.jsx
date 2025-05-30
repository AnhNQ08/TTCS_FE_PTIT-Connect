import React, {useContext, useEffect, useState} from 'react';
import '../styles/Post.css';
import {useNavigate} from "react-router-dom";
import CurtainContext from "@/context/CurtainContext.jsx";
import PostContainer from "@/components/PostContainer.jsx";
import {getPostComment} from "@/APIs/comment.js";
import {faImage, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getImageMime} from "@/utils/format.js";
import '../styles/Comment.css'
import {createPostComment} from '@/APIs/comment.js';
import CreatePostButton from "@/components/CreatePostButton.jsx";
import AuthContext from "@/context/AuthContext.jsx";
import CreatePostPopup from "@/components/CreatePostPopup.jsx";

const PostsContainer = ({posts, setPosts, ref}) => {
    const { showCurtain, setShowCurtain } = useContext(CurtainContext);
    const [currentPost, setCurrentPost] = useState(null);
    const [postComments, setPostComments] = useState([])
    const [textInput, setTextInput] = useState("");
    const [commentMedia, setCommentMedia] = useState(null);
    const {user} = useContext(AuthContext);

    const reactions = [
        {name: "LIKE", value: "/public/reactions/like.png"},
        {name: "LOVE", value: "/public/reactions/heart.png"},
        {name: "HAHA", value: "/public/reactions/haha.png"},
        {name: "CRY", value: "/public/reactions/sad.png"},
        {name: "WOW", value: "/public/reactions/wow.png"},
        {name: "ANGRY", value: "/public/reactions/angry.png"},
    ]

    const handleSubmitComment = async () => {
        try {
            const formData = new FormData();
            formData.append("content", textInput);
            formData.append("file", commentMedia);
            const response = await createPostComment(currentPost.id, formData);
            setPostComments(prev => ([response, ...prev]));
            setTextInput("");
            setCommentMedia(null);
        }catch (e){
            console.log(e);
        }
    }

    const handleClickPost = async (post) => {
        setCurrentPost(post);
        setPostComments(await getPostComment(post.id));
        setShowCurtain(true);
    }

    const handleClosePopup = () => {
        setCurrentPost(null);
        setShowCurtain(false);
    }

    return posts.length > 0 && (
        <React.Fragment>
            {showCurtain &&
                <div className="popup" style={{
                    width: '730px',
                }}>
                    {currentPost ? <React.Fragment>
                        <h3 className="popup-title" style={{margin: 0}}>{`Bài viết của ${currentPost.userSummary.username}`}</h3>
                        <div style={{
                            height: '100%',
                        }}>
                            <PostContainer post={currentPost} reactions={reactions} setPosts={setPosts} index={0} setCurrentPost={setCurrentPost}/>
                        </div>
                        <div className="comment-bounding">
                            {postComments.length > 0 && postComments.map((comment, index) => (
                                <div className="comment" key={index}>
                                    <img className="comment-sender-avatar" src={`data:${getImageMime(comment.userSummary.avatar)};base64,${comment.userSummary.avatar}`} alt=""/>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '5px',
                                    }}>
                                        <div style={{
                                            padding: '10px',
                                            backgroundColor: '#e6e6e6',
                                            borderRadius: '15px'
                                        }}>
                                            <p className="comment-sender-name">{comment.userSummary.username}</p>
                                            <p className="comment-sender-content">{comment.content}</p>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            fontSize: '12px',
                                            gap: '15px',
                                            alignSelf: 'flex-start',
                                            fontWeight: 'bold',
                                            color: '#a3a3a3',
                                            marginLeft: '10px',
                                        }}>
                                            <p>{comment.commentedAt}</p>
                                            <p>Thích</p>
                                            <p>Trả lời</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="send-comment-bounding">
                            <img className="comment-sender-avatar" src={`data:${getImageMime(currentPost.userSummary.avatar)};base64,${currentPost.userSummary.avatar}`} alt=""/>
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#e6e6e6',
                                borderRadius: '15px',
                                flex: 1,
                            }}>
                            <textarea
                                value={textInput}
                                placeholder="Viết bình luận"
                                onChange={(e) => setTextInput(e.target.value)}
                                className="comment-input"
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter" && !e.shiftKey){
                                        e.preventDefault();
                                        handleSubmitComment();
                                    }
                                }}
                            />
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <label htmlFor="comment-image-upload">
                                        <FontAwesomeIcon icon={faImage} fontSize="25px" color="#E53935" cursor="pointer"/>
                                        <input
                                            id="comment-image-upload"
                                            type="file"
                                            hidden
                                            accept="image/*, video/*"
                                            onChange={(e) => setCommentMedia(e.target.files[0])}
                                        />
                                    </label>
                                    <div className="send-icon" style={{
                                        width: '27px',
                                        height: '27px'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                        <FontAwesomeIcon icon={faXmark} fontSize="20px" className="popup-close-icon" onClick={handleClosePopup}/>
                    </React.Fragment> : <CreatePostPopup setPosts={setPosts} setShowCurtain={setShowCurtain} createPost={false} opponent={user} setCreatePost={setShowCurtain}/>
                    }
                </div>
            }
            <div className="posts-container">
                {posts.map((post, index) => (
                    <PostContainer key={index} post={post} reactions={reactions} setPosts={setPosts} handleClickPost={handleClickPost} setCurrentPost={setCurrentPost}/>
                ))}
                <div ref={ref}></div>
            </div>
        </React.Fragment>
    );
};

export default PostsContainer;