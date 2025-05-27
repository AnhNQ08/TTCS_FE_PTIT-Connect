import React, {useContext} from 'react';
import '../styles/Header.css';
import AuthContext from "@/context/AuthContext.jsx";
import {getImageMime} from "../utils/format.js";
import {faBell, faComment} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Header = () => {
    const {user} = useContext(AuthContext);

    return user && (
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
                gap: '15px'
            }}>
                <FontAwesomeIcon icon={faComment} className="icon-gray-background" fontSize="25px"/>
                <FontAwesomeIcon icon={faBell} className="icon-gray-background" fontSize="25px"/>
                <div className="user-header-container">
                    <img src={`data:${getImageMime(user.avatar)};base64,${user.avatar}`} className="user-avatar" alt=""/>
                    <p style={{fontSize: '17px', fontWeight: 'bold'}}>{user.username}</p>
                </div>
            </div>
        </div>
    );
};

export default Header;