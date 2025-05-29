import React, {useEffect, useState} from 'react';
import {getImageMime} from "@/utils/format.js";
import CreatePost from "@/components/CreatePost.jsx";
import PostsContainer from "@/components/PostsContainer.jsx";

const ProfilePost = ({posts, postedImages, friendList, userInfo, setPosts}) => {
    return (
        <div style={{
            display: 'flex',
            gap: '20px',
        }} className="profile-body">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <div className="left-side-container">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <p style={{
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}>Ảnh</p>
                        <p style={{
                            color: '#E53935',
                            cursor: 'pointer'
                        }}>Xem tất cả</p>
                    </div>
                    <div className="x3-grid-container image">
                        {postedImages.map((image, index) => (
                            <img src={image.url} alt="" style={{
                                width: '140px',
                                height: '140px',
                                borderRadius: '10px'
                            }} key={index}/>
                        ))}
                    </div>
                </div>
                <div className="left-side-container">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <p style={{
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}>Bạn bè</p>
                        <p style={{
                            color: '#E53935',
                            cursor: 'pointer'
                        }}>Xem tất cả</p>
                    </div>
                    <div className="x3-grid-container friend">
                        {friendList.map((friend, index) => (
                            <div className="friend-item" key={index}>
                                <img src={`data:${getImageMime(friend.avatar)};base64,${friend.avatar}`} alt="" style={{
                                    width: '140px',
                                    height: '140px',
                                    borderRadius: '10px'
                                }}/>
                                <p style={{
                                    fontSize: '15px',
                                    fontWeight: 'bold'
                                }}>{friend.username}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <CreatePost opponent={userInfo} setPosts={setPosts}/>
                <PostsContainer posts={posts} setPosts={setPosts}/>
            </div>
        </div>
    );
};

export default ProfilePost;