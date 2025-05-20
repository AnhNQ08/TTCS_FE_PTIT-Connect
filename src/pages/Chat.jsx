import React, {useContext, useEffect, useState} from 'react';
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import '../styles/Chat.css';
import SockJSContext from "@/context/SockJSContext.jsx";
import * as chatService from '../services/chat.js';
import getImageMime from "@/services/getImageFromUnit8.js";

const Chat = () => {
    const {stompClientRef} = useContext(SockJSContext);
    const [chatRooms, setChatRooms] = useState([]);
    const [chatRoom, setChatRoom] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await chatService.getChatRoom();
                console.log(response);
                setChatRooms(response);
            }catch(err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            <div style={{
                display: 'flex',
                gap: '15px',
                margin: '0 auto',
                maxWidth: '2000px',
            }}>
                <div className="left-content">
                    <h1>Đoạn chat</h1>
                    <div className="search-bounding">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            type="text" placeholder="Tìm kiếm trên PTIT Connect"
                            style={{
                               width: '100%',
                               border: 'none',
                                fontSize: '20px',
                                backgroundColor: 'inherit',
                                color: 'rgb(255,255,255)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div className="chat-room-container">
                        {chatRooms && chatRooms.map((chatRoom, index) => (
                            <div className="chat-room" key={index} onClick={() => setChatRoom(chatRoom)}>
                                <div style={{
                                    position: 'relative',
                                }}>
                                    <img src={`data:${getImageMime(chatRoom.avatar)};base64,${chatRoom.avatar}`} className="chat-room-avatar"/>
                                    <img src="/green-dot.jpg" alt="" style={{
                                        position: 'absolute',
                                        right: '-3px',
                                        bottom: '10px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                    }}/>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    gap: '5px'
                                }}>
                                    <p className="chat-room-name">{chatRoom.name !== "" ? chatRoom.name : chatRoom.displayName}</p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <p>{chatRoom.lastMessage && chatRoom.lastMessage.content}</p>
                                        <p>20 giờ</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="middle-content">
                    <div className="chat-room-header">
                        <div className="chat-room-info">
                            <img src="/vite.svg" alt="" style={{
                                width: '50px',
                                height: '50px',
                                border: '1px solid black',
                                borderRadius: '50%',
                            }}/>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <p style={{fontWeight : 'bold', fontSize : "19px"}}>Tại vì sao</p>
                                <p style={{color: "rgb(117,117,117)", fontSize: "15px", marginTop: "-5px"}}>Online 2 phút trước</p>
                            </div>
                            <div className="function">

                            </div>
                        </div>
                    </div>
                    <div className="chat-room-messages">
                        <div className="sender-message">
                            <p style={{
                                backgroundColor: '#E53935',
                                padding: '10px',
                                borderRadius: '25px',
                                color: 'white'
                            }}>Đây là tin nhắn của người gửi sdf dsf sdfdsfsdfsdfsdfsdfsdfd sf dsf dsds fdsf dsf dsf dsdsf fsdf dsf sd fs </p>
                        </div>
                        <div className="recipient-message">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <img src="/vite.svg" alt=""/>
                                <div className="message-files">

                                </div>
                                <p style={{
                                    backgroundColor: 'lightgray',
                                    padding: '10px',
                                    borderRadius: '25px',
                                    color: 'black'
                                }}>Đây là tin nhắn của người nhận</p>
                            </div>
                        </div>
                    </div>
                    <div className="chat-room-bottom"></div>
                </div>
            </div>
        </div>
    );
};

export default Chat;