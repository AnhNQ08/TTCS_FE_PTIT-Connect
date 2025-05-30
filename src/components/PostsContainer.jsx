import React from 'react';
import '../styles/Post.css';
import { faEarthAsia, faXmark, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getImageMime} from "@/utils/format.js";
import LikeButton from "@/components/LikeButton.jsx";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";

const PostsContainer = ({posts, setPosts, ref}) => {
    const navigate = useNavigate();

    const reactions = [
        {name: "LIKE", value: "/public/reactions/like.png"},
        {name: "LOVE", value: "/public/reactions/heart.png"},
        {name: "HAHA", value: "/public/reactions/haha.png"},
        {name: "CRY", value: "/public/reactions/sad.png"},
        {name: "WOW", value: "/public/reactions/wow.png"},
        {name: "ANGRY", value: "/public/reactions/angry.png"},
    ]

    return posts.length > 0 && (
        <div className="posts-container">
            {posts.map((post, index) => (
                <div className="post-container" key={index}>
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
                        <FontAwesomeIcon icon={faXmark} fontSize="30px" cursor="pointer"/>
                    </div>
                    <div className="post-body" style={{
                        backgroundImage: post.backgroundUrl && `url(${post.backgroundUrl})`,
                        justifyContent: post.backgroundUrl && 'center',
                        alignItems: post.backgroundUrl && 'center',
                        minHeight: post.backgroundUrl && '300px',
                    }}>
                        <div className="post-content" style={{
                            padding: post.backgroundUrl && '40px',
                            fontWeight: post.backgroundUrl && 'bold',
                            fontSize: post.backgroundUrl && '28px',
                            color: post.backgroundUrl && 'white'
                        }}>{post.content}</div>
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
                            <div className="function-item">
                                <img src="/public/comment-icon.png" alt="" className="emoji"/>
                                <p>Bình luận</p>
                            </div>
                            <div className="function-item">
                                <img src="/public/share.png" alt="" className="emoji"/>
                                <p>Chia sẻ</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={ref}></div>
        </div>
    );
};

export default PostsContainer;