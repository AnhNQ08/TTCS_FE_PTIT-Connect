import React, {useContext, useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import AuthContext from "@/context/AuthContext.jsx";
import '../styles/CreatePost.css'
import {getImageMime} from "@/utils/format.js";
import CurtainContext from "@/context/CurtainContext.jsx";
import {
    faCaretDown,
    faCaretUp,
    faChevronLeft,
    faEarthAsia, faFileImage,
    faUserGroup,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const CreatePost = ({opponent}) => {
    const {user} = useContext(AuthContext);
    const {showCurtain, setShowCurtain} = useContext(CurtainContext);
    const optionNumberRef = useRef(null);
    const [showBackground, setShowBackground] = useState(false);
    const [isChosing, setIsChosing] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [postImages, setPostImages] = useState([]);
    const [text, setText] = useState("");
    const [selectedBackground, setSelectedBackground] = useState(null);
    const backgroundColors = [
        "/public/post-background/white.jpg",
        "/public/post-background/blue.jpg",
        "/public/post-background/browne.jpg",
        "/public/post-background/gray.jpg",
        "/public/post-background/orange.jpg",
        "/public/post-background/pink.jpg",
        "/public/post-background/red.jpg",
        "/public/post-background/red-lighter.jpg",
        "/public/post-background/light-blue.jpg",
    ]

    useEffect(() => {
        if(text.length > 150){
            setSelectedBackground(null);
            setShowBackground(false);
        }
    }, [text])

    return (
        <div style={{
            display: 'flex',
            gap: '20px',
            padding: '10px 15px 10px 15px',
            borderRadius: '10px',
            backgroundColor: 'white',
        }}>
            {showCurtain &&
                <div className="popup">
                    <p className="popup-title">Tạo bài viết</p>
                    <FontAwesomeIcon icon={faXmark} className="popup-close-icon" onClick={() => setShowCurtain(false)} fontSize="20px"/>
                    <div className="create-body">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '0px 15px 0px 15px',
                        }}>
                            <img src={`data:${getImageMime(user.avatar)};base64,${user.avatar}`} alt="" className="post-creator-avatar"/>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px'
                            }}>
                                <p className="post-creator-name">{user.username}</p>
                                <div className="post-type" onClick={() => setIsChosing(!isChosing)}>
                                    {isPublic ? <FontAwesomeIcon icon={faEarthAsia} fontSize="15"/> : <FontAwesomeIcon icon={faUserGroup} fontSize="15"/>}
                                    {isPublic ? <p className="type-text">Công khai</p> : <p className="type-text">Bạn bè</p>}
                                    {!isChosing ? <FontAwesomeIcon icon={faCaretDown} fontSize="15"/> : <FontAwesomeIcon icon={faCaretUp} fontSize="15"/>}
                                    {isChosing &&
                                        <div className="type-dropdown">
                                            <div className="type-dropdown-item" onClick={(e) => {
                                                e.stopPropagation();
                                                setIsPublic(true);
                                                setIsChosing(false);
                                            }}>
                                                <FontAwesomeIcon icon={faEarthAsia} fontSize="15"/>
                                                <p className="type-text">Công khai</p>
                                            </div>
                                            <div className="type-dropdown-item" onClick={(e) => {
                                                e.stopPropagation();
                                                setIsPublic(false);
                                                setIsChosing(false);
                                            }}>
                                                <FontAwesomeIcon icon={faUserGroup} fontSize="15"/>
                                                <p className="type-text">Bạn bè</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={user.id === opponent.id ? "Bạn đang nghĩ gì?" : "Hãy viết gì đó cho " + opponent.username}
                            style={{
                                textAlign: !selectedBackground ? 'left' : 'center',
                                paddingTop: !selectedBackground ? '0px' : '120px',
                                paddingBottom: !selectedBackground ? '0px' : '50px',
                                resize: 'none',
                                border: 'none',
                                outline: 'none',
                                color: selectedBackground ? 'white' : 'black',
                                fontSize: !selectedBackground ? '19px' : '22px',
                                fontWeight: selectedBackground && 'bold',
                                backgroundImage: `url(${selectedBackground})`,
                                height: '150px',
                                width: '600px',
                                paddingLeft: '15px',
                                paddingRight: '15px'
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            flex: 1,
                            alignItems: 'center',
                            gap: '10px',
                            marginTop: '-12px',
                            paddingLeft: '15px',
                            backgroundImage: selectedBackground && `url(${selectedBackground})`
                        }}>
                            <FontAwesomeIcon icon={faFileImage} fontSize="25px" style={{
                                padding: '8px 10px 8px 10px',
                                borderRadius: '50%',
                                backgroundColor: 'lightgray',
                                cursor: selectedBackground ? 'not-allowed' : 'pointer',
                                display: showBackground && 'none'
                            }}/>
                            <div className={`show-background-color ${showBackground && 'active'}`} style={{
                                display: postImages.length > 0 && 'none'
                            }} onClick={() => {
                                if(text.length > 150) return;
                                setShowBackground(!showBackground)
                            }}>
                                {!showBackground && <p style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: 'white'
                                }} >
                                    Aa
                                </p>}
                                {showBackground && <FontAwesomeIcon icon={faChevronLeft} fontSize="20px"/>}
                            </div>
                            {showBackground && backgroundColors.map((color, index) => (
                                <img className={`background-option ${optionNumberRef.current === index && 'chosen'} ${optionNumberRef.current === 0 && index === 0 && 'white'}`} key={index} src={color} alt="" onClick={() => {
                                    optionNumberRef.current = index;
                                    if(index !== 0) setSelectedBackground(color);
                                    else setSelectedBackground(null);
                                }}/>
                            ))}
                        </div>
                    </div>
                </div>
            }
            <img src={`data:${getImageMime(user.avatar)};base64,${user.avatar}`} className="post-creator-avatar" alt=""/>
            <button className="create-post-button" onClick={() => setShowCurtain(true)}>{user.id === opponent.id ? "Bạn đang nghĩ gì?" : "Hãy viết gì đó cho " + opponent.username}</button>
        </div>
    );
};

export default CreatePost;