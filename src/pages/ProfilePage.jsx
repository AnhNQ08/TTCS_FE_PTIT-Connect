import React, { useContext, useEffect, useRef, useState } from 'react';
import { getProfile } from "@/APIs/user.js";
import { useParams } from "react-router-dom";
import ProfileHeader from "@/components/ProfileHeader.jsx";
import { Header } from "@/components/index.js";
import '../styles/ProfilePage.css';
import AuthContext from "@/context/AuthContext.jsx";
import ProfilePost from "@/components/ProfilePost.jsx";
import CurtainContext from "@/context/CurtainContext.jsx";
import PostsContainer from "@/components/PostsContainer.jsx";
import {getPostByUserId} from "@/APIs/post.js";

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const { showCurtain } = useContext(CurtainContext);
    const userId = useParams();
    const [directParam, setDirectParam] = useState(false);
    const [posts, setPosts] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [userFriend, setUserFriend] = useState([]);
    const [userImages, setUserImages] = useState([]);
    const [selectedChoice, setSelectedChoice] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                setDirectParam(Number(user.id) === Number(userId.userId));
                setPosts(await getPostByUserId(userId.userId));
                const response = await getProfile(userId.userId);
                const userInfo = {
                    id: response.id,
                    username: response.username,
                    avatar: response.avatar,
                    background: response.backgroundImage,
                    bio: response.bio,
                    numberOfFriends: response.numberOfFriends
                };
                setUserInfo(userInfo);
                setUserFriend(response.friends);
                setUserImages(response.postedImages);
            } catch (error) {
                console.error("Lỗi khi lấy profile:", error);
            }finally {
                setLoading(false);
            }
        };
        if(user) fetchData();
    }, [user]);

    return !loading && (
        <div>
            <Header />
            {showCurtain && <div className="curtain-background"></div>}
            <div className="center-body" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <ProfileHeader selectedChoice={selectedChoice} isMine={directParam} userInfo={userInfo} setUserInfo={setUserInfo} setSelectedChoice={setSelectedChoice}/>
                <ProfilePost setPosts={setPosts} posts={posts} friendList={userFriend} postedImages={userImages} userInfo={userInfo} setLoading={setLoading}/>
            </div>
        </div>
    );
};

export default ProfilePage;
