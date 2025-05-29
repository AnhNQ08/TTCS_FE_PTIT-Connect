import React, {useContext, useEffect, useState} from 'react';
import { Header } from "../components/index.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faMagnifyingGlass, faRightToBracket, faUser, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {getImageMime} from "@/utils/format.js";
import AuthContext from "@/context/AuthContext.jsx";
import * as friendService from "@/APIs/friend.js";
import * as authenticationService from "../APIs/authentication.js"
import '../styles/HomePage.css'
import {useDebounce} from "../hooks/useDebounce.js";
import FriendListHomePage from "@/components/FriendListHomePage.jsx";
import {Link} from "react-router-dom";
import PostsContainer from "@/components/PostsContainer.jsx";

const HomePage = () => {
    const {user} = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [friendListSearch, setFriendListSearch] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const searchDebounce = useDebounce(searchInput, 300);

    useEffect(() => {
        const fetchData = async () => {
            setFriendRequests(await fetchFriendRequests());
            setFriendList(await fetchAllFriends());
        }
        fetchData();
    }, [user])

    useEffect(() => {
        if(searchInput !== ""){
            setIsSearching(true);
            fetchAllFriends().then(res => {
                setFriendListSearch(res);
            });
        }else{
            setIsSearching(false);
        }
    }, [searchDebounce])

    const fetchFriendRequests = async () => {
        return await friendService.getFriendRequests(0, 4);
    }

    const fetchAllFriends = async () => {
        return await friendService.findAllFriends(searchInput);
    }

    const acceptFriendRequest = async (friend) => {
        try {
            const response = await friendService.acceptFriendRequest(friend.userId);
            if(response === "New friend request accepted"){
                const tmpFriend = {
                    ...friend,
                    status: "accepted"
                }
                const tmpRequestList = friendRequests.map(tmp => {
                        if(tmp.userId === friend.userId) return tmpFriend;
                        return tmp;
                    }
                );
                setFriendRequests(tmpRequestList);
            }

        }catch (e){
            console.log(e);
        }
    }

    const declineFriendRequest = async (friend) => {
        try {
            const response = await friendService.declineFriendRequest(friend.userId, user.id);
            if(response === "Friend request deleted"){
                const tmpFriend = {
                    ...friend,
                    status: "declined"
                }
                const tmpRequestList = friendRequests.map(tmp => {
                        if(tmp.userId === friend.userId) return tmpFriend;
                        return tmp;
                    }
                );
                setFriendRequests(tmpRequestList);
            }
        }catch (e){
            console.log(e);
        }
    }

    const showRequestWithStatus = (request) => {
        setTimeout(async () => {
            const response1 = await fetchFriendRequests();
            const response2 = await fetchAllFriends();
            console.log(response2);
            setFriendRequests(response1);
            setFriendList(response2);
        }, [2000]);
        return (request.status === "accepted" ?
                <p className="status-text">Đã chấp nhận lời mời</p> :
                <p className="status-text">Đã từ chối lới mời</p>
        )
    }

    const handleLogout = async () => {
        await authenticationService.logout();
        localStorage.clear();
        window.location.href = "/login";
    }

    return user && (
        <div style={{
            height: '100vh',
            position: 'relative'
        }}>
            <Header/>
            <div className="sidebar-left">
                <Link style={{textDecoration: 'none', color: 'black'}} to={`/${user.id}`} className="sidebar-option">
                    <FontAwesomeIcon icon={faUser} />
                    <p>Trang cá nhân</p>
                </Link>
                <div className="sidebar-option">
                    <FontAwesomeIcon icon={faUserGroup} />
                    <p>Bạn bè</p>
                </div>
                <div className="sidebar-option">
                    <FontAwesomeIcon icon={faComment} />
                    <p>Nhắn tin</p>
                </div>
                <div className="sidebar-option" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightToBracket} flip="horizontal" />
                    <p>Đăng xuất</p>
                </div>
            </div>
            <div className="center-body">
                <PostsContainer/>
            </div>
            <div className="sidebar-right">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3>Lời mời kết bạn</h3>
                        <p>Tất cả</p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        height: 'auto',
                        maxHeight: '330px'
                    }}>
                        {friendRequests.length > 0 ? friendRequests.map((friend, index) => (
                                <div className="friend-request-container" key={index}>
                                    <img src={`data:${getImageMime(friend.avatar)};base64,${friend.avatar}`} alt="" style={{
                                        width: '55px',
                                        height: '55px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}/>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        gap: '5px',
                                        width: '100%'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <p className="friend-request-sender-name">{friend.username}</p>
                                            <p style={{color: 'lightgray', fontSize: '15px'}}>{friend.sendAt}</p>
                                        </div>
                                        {!friend.status ? (
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                width: '100%'
                                            }}>
                                                <button className="confirm-button" onClick={() => acceptFriendRequest(friend)}>
                                                    Xác nhận
                                                </button>
                                                <button className="cancel-button" onClick={() => declineFriendRequest(friend)}>
                                                    Xóa
                                                </button>
                                            </div>
                                        ) : showRequestWithStatus(friend)}
                                    </div>
                                </div>
                            )) :
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                gap: '10px',
                                marginTop: '-10px'
                            }}>
                                <img src="/public/no-request.png" alt="" style={{
                                    width: '170px',
                                    height: '170px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: '-30px'
                                }}/>
                                <p>Bạn chưa có lời mời kết bạn nào</p>
                            </div>
                        }
                    </div>
                    <h3>Bạn bè</h3>
                    <div className="search-bounding">
                        <FontAwesomeIcon icon={faMagnifyingGlass} fontSize="18px"/>
                        <input
                            type="text"
                            placeholder="Tìm kiếm bạn bè"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    {
                        isSearching ? (
                            friendListSearch.length > 0 && (
                                friendListSearch.map((friend, index) => (
                                    <FriendListHomePage key={index} friend={friend} index={index} />
                                ))
                            )
                        ) : (
                            friendList.length > 0 ? (
                                friendList.map((friend, index) => (
                                    <FriendListHomePage key={index} friend={friend} index={index} />
                                ))
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    gap: '10px',
                                }}>
                                    <img src="/public/no-request.png" alt="" style={{
                                        width: '170px',
                                        height: '170px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginBottom: '-30px'
                                    }}/>
                                    <p>Bạn chưa có người bạn nào</p>
                                    <a href="" style={{ textAlign: 'center' }}>
                                        Ấn vào đây để tìm <br />những người bạn mới
                                    </a>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default HomePage;