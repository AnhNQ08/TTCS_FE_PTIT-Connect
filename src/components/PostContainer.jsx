import React, {useContext} from 'react';
import {getImageMime} from "@/utils/format.js";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEarthAsia, faUserGroup, faXmark} from "@fortawesome/free-solid-svg-icons";
import LikeButton from "@/components/LikeButton.jsx";
import CurtainContext from "@/context/CurtainContext.jsx";

const PostContainer = ({ post, reactions, setPosts, handleClickPost, setCurrentPost }) => {
    const { showCurtain, setShowCurtain, setCreatePost } = useContext(CurtainContext);
    const navigate = useNavigate();

    return (
        <div className="post-container">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px'
            }}>
                <div className="post-header">
                    <img className="post-creator-avatar" src={`data:${getImageMime(post.userSummary.avatar)};base64,${post.userSummary.avatar}`} alt="" onClick={
                        () => navigate(`/profile/${post.userSummary.id}`)
                    }/>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        flexDirection: 'column',
                        gap: '3px',
                    }}>
                        <Link to={`/profile/${post.userSummary.id}`} className="post-creator-name">{post.userSummary.username}</Link>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '15px',
                            color: 'rgb(179,179,179)',
                            fontWeight: 'bold'
                        }}>
                            <p>{post.updatedAt ? post.updatedAt : post.createdAt}</p>
                            <span className="spacing-dot"></span>
                            {post.privacy === "PUBLIC" ? <FontAwesomeIcon icon={faEarthAsia} /> : <FontAwesomeIcon icon={faUserGroup} />}
                        </div>
                    </div>
                </div>
                {!showCurtain && <FontAwesomeIcon icon={faXmark} fontSize="30px" cursor="pointer"/>}
            </div>
            <div className="post-body" style={{
                backgroundImage: post.backgroundUrl && `url(${post.backgroundUrl})`,
                justifyContent: post.backgroundUrl && 'center',
                alignItems: post.backgroundUrl && 'center',
                minHeight: post.backgroundUrl && '300px',
            }}>
                <p className="post-content" style={{
                    padding: post.backgroundUrl && '40px',
                    fontWeight: post.backgroundUrl && 'bold',
                    fontSize: post.backgroundUrl && '28px',
                    color: post.backgroundUrl && 'white',
                    textAlign: post.backgroundUrl && 'center'
                }}>{post.content}</p>
                <div className={`post-media-grid post-media-count-${post.mediaList.length} ${post.mediaList.length}`}>
                    {post.mediaList.map((media, index) => (
                        <img key={index} src={media.url} alt=""/>
                    ))}
                </div>
            </div>
            <div className="post-bottom">
                {(post.reactionSummary.total !== 0 || post.totalComment !== 0) &&
                    <div className="reactions-comments">
                        <div className="reactions">
                            {post.reactionSummary.emotions.map((emotion, index) => {
                                const reaction = reactions.find(r => r.name === emotion);
                                return (
                                    <img src={reaction.value} alt="" key={index} className="emoji"/>
                                )
                            })}
                            {post.reactionSummary.total > 0 && <p style={{color: 'rgb(145,145,145)', marginLeft: '7px'}}>{post.reactionSummary.total}</p>}
                        </div>
                        <p style={{color: 'rgb(145,145,145)'}}>{post.totalComment > 0 && `${post.totalComment} bình luận`} </p>
                    </div>
                }
                <div className="post-function">
                    <LikeButton reactions={reactions} currentReaction={post.currentUserReaction} setPosts={setPosts} postId={post.id} type={"POST"}/>
                    <div className="function-item" onClick={() => handleClickPost(post)}>
                        <img src="/public/comment-icon.png" alt="" className="emoji"/>
                        <p>Bình luận</p>
                    </div>
                    <div className="function-item" onClick={() => {
                        localStorage.setItem('postId', post.id);
                        setShowCurtain(true);
                        setCreatePost(false);
                        setCurrentPost(false);
                    }}>
                        <img src="/public/share.png" alt="" className="emoji"/>
                        <p>Chia sẻ</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostContainer;