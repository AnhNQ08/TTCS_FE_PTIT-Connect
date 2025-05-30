import React, {useContext, useEffect, useRef, useState} from 'react';
import '../styles/Header.css';
import AuthContext from "@/context/AuthContext.jsx";
import {getImageMime} from "../utils/format.js";
import {faBell, faComment} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getNotifications} from "@/APIs/notification.js";
import {Link} from "react-router-dom";
import {useInView} from "react-intersection-observer";

const Header = () => {
    const {user} = useContext(AuthContext);
    const containerRef = useRef(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowNotification(false);
            }
        };

        if (showNotification) {
            getNotifications(1, 6).then(res => {
                setNotifications(res);
            })
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotification]);

    const handleClickNotification = async (notification) => {

    }

    return user && (
        <React.Fragment>
            <div className="header">
                <svg className="header-logo" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" onClick={() => window.location.href = "/"}>
                    <g fill="#E53935" stroke="#E53935" strokeWidth="6" strokeLinecap="round">
                        <circle cx="80" cy="100" r="20"/>

                        <circle cx="40" cy="100" r="10"/>
                        <circle cx="105" cy="60" r="10"/>
                        <circle cx="105" cy="140" r="10"/>

                        <path d="M50 100 A30 30 0 0 1 80 70
             M80 70 A30 30 0 0 1 110 100
             M110 100 A30 30 0 0 1 80 130
             M80 130 A30 30 0 0 1 50 100"
                              fill="none"/>

                        <line x1="80" y1="80" x2="105" y2="60"/>
                        <line x1="80" y1="120" x2="105" y2="140"/>
                        <line x1="60" y1="100" x2="40" y2="100"/>
                    </g>

                    <text x="150" y="95" fontFamily="Arial" fontSize="48" fill="#E53935" fontWeight="bold" dominantBaseline="middle">PTIT</text>
                    <text x="150" y="140" fontFamily="Arial" fontSize="32" fill="#E53935" dominantBaseline="middle">CONNECT</text>
                </svg>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    position: 'relative'
                }}>
                    <FontAwesomeIcon icon={faComment} className="icon-gray-background" fontSize="25px" onClick={() => window.location.href = "/chat"} style={{}}/>
                    <FontAwesomeIcon icon={faBell} className="icon-gray-background" fontSize="25px" onClick={() => setShowNotification(prev => !prev)}/>
                    <div className="user-header-container">
                        <img src={`data:${getImageMime(user.avatar)};base64,${user.avatar}`} className="user-avatar" alt=""/>
                        <p style={{fontSize: '17px', fontWeight: 'bold'}}>{user.username}</p>
                    </div>
                </div>
            </div>
            {showNotification &&
                <div className="notification-container" ref={containerRef}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <h2 style={{
                            margin: 0
                        }}>Thông báo</h2>
                        <Link to="/notifications" className="link" style={{
                            alignSelf: 'center'
                        }}>Tất cả</Link>
                    </div>
                    {notifications && notifications.map((notification, index) => (
                        <div className="notification" key={index}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }} onClick={() => handleClickNotification(notification)}>
                                <img src={`data:${getImageMime(notification.author.avatar)};base64,${notification.author.avatar}`} alt="" style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}/>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '3px'
                                }}>
                                    <p className="notification-content">
                                        <span style={{
                                        fontWeight: 'bold'
                                        }}>
                                            {notification.author.username}
                                        </span>
                                        &nbsp;
                                        {notification.content}
                                    </p>
                                    <p style={{
                                        fontWeight: 'bold',
                                        color: '#E53935'
                                    }}>{notification.noticeAt}</p>
                                </div>
                            </div>
                            <div className={`notice-status ${!notification.read && "unread"}`}></div>
                        </div>
                    ))}
                </div>
            }
        </React.Fragment>
    );
};

export default Header;