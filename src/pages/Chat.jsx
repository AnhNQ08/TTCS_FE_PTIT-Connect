import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    faCamera,
    faChevronDown,
    faChevronUp,
    faCircleInfo,
    faEllipsis,
    faFile,
    faFileImage,
    faFileLines,
    faImage,
    faMagnifyingGlass,
    faPen, faPenToSquare,
    faPhone,
    faPlus,
    faUserPlus,
    faVideo, faX,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import '../styles/Chat.css';
import SockJSContext from "@/context/SockJSContext.jsx";
import * as conversationService from '../services/conversation.js';
import * as chatService from '../services/message.js';
import * as messageService from '../services/message.js';
import getImageMime from "@/services/getImageFromUnit8.js";
import AuthContext from "@/context/AuthContext.jsx";
import {useNavigate, useParams} from "react-router-dom";
import ParticipantListNickname from "@/components/ParticipantListNickname.jsx";

const Chat = () => {
    const {chatId} = useParams();
    const navigate = useNavigate();
    const {stompClientRef, setUpStompClient, disconnectStomp} = useContext(SockJSContext);
    const {user} = useContext(AuthContext);
    const [chatRooms, setChatRooms] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [mediaList, setMediaList] = useState([]);
    const [showInfo, setShowInfo] = useState(false);
    const [messages, setMessages] = useState([]);
    const chatRoomRef = useRef(null);
    const messageEndRef = useRef(null);
    const userRef = useRef(null);
    const [option1, setOption1] = useState(false);
    const [option2, setOption2] = useState(false);
    const [option3, setOption3] = useState(false);
    const [option11, setOption11] = useState(false);
    const [option13, setOption13] = useState(false);
    const [option21, setOption21] = useState(false);
    const [option31, setOption31] = useState(false);
    const [option32, setOption32] = useState(false);
    const [optionInput, setOptionInput] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if(user){
                userRef.current = user;
                const response = await fetchChatRooms();
                setChatRooms(response);
                const chatRoomIds = response.map(chatRoom => chatRoom.id);
                await setUpStompClient(chatRoomIds, user.id, onMessageReceived, null);
                const tmp = JSON.parse(localStorage.getItem("chatRoomRef"));
                if(tmp) {
                    const tmpMessage = await messageService.getMessages(tmp.id);
                    setMessages(tmpMessage);
                    chatRoomRef.current = tmp;
                }
            }
        }
        fetchData();

        return () => {
            disconnectStomp();
        }
    }, [user])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if(!chatRoomRef.current){
                    chatRoomRef.current = JSON.parse(localStorage.getItem("chatRoom"));
                }
                const response = await messageService.getMessages(chatId);
                setMessages(response);
            }catch(e) {
                console.log(e);
            }
        }
        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchChatRooms = async () => {
        try {
            return await conversationService.getChatRoom();
        }catch(err) {
            console.log(err);
        }
    }

    const sendMessage = async () => {
        if(messageInput.length === 0 && mediaList.length === 0){
            alert("Hãy nhập tin nhắn hoặc gửi file!");
            return;
        }
        let response = [];
        if(mediaList.length > 0){
            const formData = new FormData();
            for(const file of mediaList){
                formData.append('file', file);
            }
            console.log(formData);
            response = await chatService.uploadMessageFile(formData);
        }
        const payload = {
            senderId: user.id,
            content: messageInput,
            conversationId: chatRoomRef.current.id,
            mediaList: response
        }
        if(chatRoomRef.current.type === 'GROUP'){
            stompClientRef.current.publish({
                destination: `/app/groupChat`,
                body: JSON.stringify(payload),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        }else{
            payload.recipientId = chatRoomRef.current.participants.find(participant => participant.participantId !== user.id).participantId;
            stompClientRef.current.publish({
                destination: `/app/privateChat`,
                body: JSON.stringify(payload),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        }
        const messageId = await chatService.getLastMessageIdByConversationId(chatRoomRef.current.id, user.id);
        const messageDTO = {
            id: messageId,
            sender: user,
            content: messageInput,
            mediaList: response,
            conversationId: chatRoomRef.current.id,
            sentAt: new Date()
        }
        console.log(messageDTO.sender);
        const lastMessage = {
            senderName: chatRoomRef.current.participants.find(participant => participant.participantId === user.id).participantName,
            senderId: user.id,
            content: messageInput,
            notRead: chatRoomRef.current.participants.filter(id => id !== user.id),
            sentAt: new Date()
        }
        setChatRooms(prev => prev.map(chatRoom => {
            if(chatRoom.id === chatRoomRef.current.id){
                return {
                    ...chatRoom,
                    lastMessage: lastMessage
                }
            }
            return chatRoom;
        }))
        setMessageInput("");
        setMediaList([]);
        setMessages(prev => [...prev, messageDTO]);
    }

    const onMessageReceived = useCallback(async (payload) => {
        setTimeout(async () => {
            const message = JSON.parse(payload.body);
            if(chatRoomRef.current && message.conversationId === chatRoomRef.current.id){
                if(chatRoomRef.current.lastMessage) {
                    console.log(chatRoomRef.current.lastMessage);
                    const response = await conversationService.updateLastMessageStatus(chatRoomRef.current.id, userRef.current.id);
                    if(response !== "Status updated"){
                        alert("Có lỗi xảy ra");
                        return;
                    }
                }
                if(message.sender.id !== userRef.current.id){
                    setMessages((prev) => [...prev, message]);
                }
            }
            const tmpChatRooms = await fetchChatRooms();
            setChatRooms(tmpChatRooms);
        }, 150);
    }, [])

    // const onMessageRevoke = async (payload) => {
    //     setMessages(await chatService.getMessages(payload.body));
    // }

    const showFileSize = useCallback((size) => {
        const tmp = size / 1000;
        if(tmp < 1024){
            return `${tmp.toFixed(0)} KB`;
        }
        return `${(tmp / 1024).toFixed(0)} MB`;
    }, [])

    const showFiles = useCallback((files, type) => {
        const imageVideoList = [];
        const fileList = [];
        files.forEach((file) => {
            if (file.type === "IMAGE" || file.type === "VIDEO") {
                imageVideoList.push(file);
            } else {
                fileList.push(file);
            }
        });

        return (
            <>
                {imageVideoList.length > 0 && (
                    <div className={`media-grid media-count-${imageVideoList.length}`}>
                        {imageVideoList.map((file, index) => (
                            <img src={file.url} alt="" key={index} />
                        ))}
                    </div>
                )}
                {fileList.map((file, index) => (
                    <a className={`file-info-message ${type}`} key={index} href={file.url} download>
                        <FontAwesomeIcon icon={faFile} style={{ fontSize: '35px' }} />
                        <div style={{ maxWidth: '230px', overflow: 'hidden' }}>
                            <p className="file-name">{file.name}</p>
                            <p className="file-size">{showFileSize(file.size)}</p>
                        </div>
                    </a>
                ))}
            </>
        );
    }, []);

    const handleClickChatRoom = async (chatRoom) => {
        localStorage.setItem("chatRoom", JSON.stringify(chatRoom));
        if(chatRoom.lastMessage){
            await conversationService.updateLastMessageStatus(chatRoom.id, user.id);
            setChatRooms(prev => prev.map(prevChatRoom => {
                if (prevChatRoom.id === chatRoom.id && chatRoom.lastMessage) {
                    return {
                        ...chatRoom,
                        lastMessage: {
                            ...prevChatRoom.lastMessage,
                            notRead: chatRoom.participants.filter(id => id !== user.id)
                        }
                    };
                }
                return prevChatRoom;
            }));
        }
        chatRoomRef.current = chatRoom;
        navigate(`/chat/${chatRoom.id}`);
    }

    const getCurtainContent = () => {
        return(
            <div className="popup">
                {option11 && (
                    <>
                        <p className="popup-title">Đổi tên đoạn chat</p>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '15px',
                            gap: '10px'
                        }}>
                            <input
                                type="text"
                                maxLength="30"
                                value={optionInput}
                                placeholder="Nhập tên đoạn chat"
                                style={{
                                    width: '400px',
                                    height: '20px',
                                    border: '2px solid lightgray',
                                    borderRadius: '7px',
                                    fontSize: '20px',
                                    padding: '10px',
                                    outline: 'none'
                                }}
                                onChange={(e) => setOptionInput(e.target.value)}
                            />
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                alignSelf: 'flex-end'
                            }}>
                                <button className="cancel-button" onClick={() => setOption11(false)}>
                                    Hủy
                                </button>
                                <button className={`confirm-button ${optionInput === chatRoomRef.current.name && "unavailable"}`} onClick={async () => {
                                    if(optionInput !== chatRoomRef.current.name) {
                                        try {
                                            const response = await conversationService.updateName(chatRoomRef.current.id, optionInput);
                                            if(response !== "Name updated") alert("Có lỗi xảy ra");
                                            else {
                                                setOption11(false);
                                                setChatRooms(prev => prev.map(chatRoom => {
                                                    if(chatRoom.id === chatRoomRef.current.id){
                                                        return {
                                                            ...chatRoom,
                                                            name: optionInput
                                                        }
                                                    }
                                                    return chatRoom;
                                                }));
                                                chatRoomRef.current.name = optionInput;
                                                localStorage.setItem("chatRoom", JSON.stringify(chatRoomRef.current));
                                                setOptionInput("");
                                            }
                                        }catch(e) {
                                            console.log(e);
                                        }
                                    }
                                }}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {option13 && (
                    <>
                        <p className="popup-title">Đổi biệt danh</p>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '15px',
                            gap: '10px'
                        }}>
                            {chatRoomRef.current.participants.map((participant, index) => (
                                <ParticipantListNickname setMessages={setMessages} optionInput={optionInput} setOptionInput={setOptionInput} participant={participant} index={index} chatRoomRef={chatRoomRef} setChatRooms={setChatRooms}/>
                            ))}
                            <FontAwesomeIcon icon={faX} style={{
                                fontSize: '15px',
                                padding: '10px',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                cursor: 'pointer',
                                backgroundColor: 'lightgray'
                            }} onClick={() => setOption13(false)}/>
                        </div>
                    </>
                )}
            </div>
        )
    }

    return user && (
        <div style={{
            backgroundColor: 'lightgray',
        }}>
            {(option11 || option13 || option21 || option31 || option32) && (
                <div className="curtain">
                    <div style={{
                        position: 'relative'
                    }}>
                        {getCurtainContent()}
                    </div>
                </div>
            )}
            <div style={{
                display: 'flex',
                gap: '15px',
                margin: '0 auto',
                height: '100vh',
                paddingRight: '15px',
                maxWidth: '2000px',
            }}>
                <div className="left-content">
                    <h1>Đoạn chat</h1>
                    <div className="search-bounding">
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{fontSize: '20px'}}/>
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
                    <div style={{
                        display: 'flex',
                        gap: '5px',
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }}>
                        <p className="filter-choice">Tất cả</p>
                        <p className="filter-choice">Chưa đọc</p>
                    </div>
                    <div className="chat-room-container">
                        {chatRooms && chatRooms.map((data, index) => (
                            <div className="chat-room" key={index} onClick={() => handleClickChatRoom(data)}>
                                <div style={{
                                    position: 'relative',
                                }}>
                                    <img src={`data:${getImageMime(data.avatar)};base64,${data.avatar}`} className="chat-room-avatar"/>
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
                                    <p className="chat-room-name">{data.name !== "" ? data.name : data.displayName}</p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        {data.lastMessage && (
                                            <p className={`last-message ${data.lastMessage.notRead.find(id => id === user.id) && "not-read"}`}>
                                                {data.lastMessage.senderId !== user.id ? `${data.lastMessage.senderName}: ` : `Bạn: `}
                                                {data.lastMessage.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {chatRoomRef.current && (
                    <div className="middle-content">
                        <div className="chat-room-header">
                            <div className="chat-room-info">
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <img src={`data:${getImageMime(chatRoomRef.current.avatar)};base64,${chatRoomRef.current.avatar}`} alt="" style={{
                                        width: '50px',
                                        height: '50px',
                                        border: '1px solid black',
                                        borderRadius: '50%',
                                    }}/>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}>
                                        <p style={{fontWeight : 'bold', fontSize : "19px"}}>{chatRoomRef.current.name !== "" ? chatRoomRef.current.name : chatRoomRef.current.displayName}</p>
                                        <p style={{color: "rgb(117,117,117)", fontSize: "15px", marginTop: "-5px"}}>Online 2 phút trước</p>
                                    </div>
                                </div>
                                <div className="function" >
                                    <FontAwesomeIcon icon={faPhone} style={{color: '#E53935'}} onClick={() => alert("Chức năng này chưa khả dụng!")}/>
                                    <FontAwesomeIcon icon={faVideo} style={{color: '#E53935'}} onClick={() => alert("Chức năng này chưa khả dụng!")}/>
                                    <FontAwesomeIcon icon={faCircleInfo} style={{color: '#E53935'}} onClick={() => setShowInfo(!showInfo)}/>
                                </div>
                            </div>
                        </div>
                        <div className="chat-room-messages">
                            {messages.map((message, index) => (
                                message.sender.id === user.id ? (
                                    <div className="sender-message" key={index}>
                                        {message.content !== "" &&
                                            <p style={{
                                                backgroundColor: '#E53935',
                                                padding: '10px',
                                                borderRadius: '25px',
                                                color: 'white',
                                                lineHeight: '1.3'
                                            }}>{message.content}</p>
                                        }
                                        {showFiles(message.mediaList, "sender")}
                                    </div>
                                ) : (
                                    <div className="recipient-message">
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            gap: '10px'
                                        }}>
                                            <img src={`data:${getImageMime(message.sender.avatar)};base64,${message.sender.avatar}`} alt="" style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                            }}/>
                                            <div className="message-content">
                                                <p style={{
                                                    fontSize: '15px',
                                                    color: 'rgb(128,128,128)'
                                                }}>{message.sender.username}</p>
                                                {message.content !== "" &&
                                                    <p style={{
                                                    backgroundColor: 'lightgray',
                                                    padding: '10px',
                                                    borderRadius: '25px',
                                                    color: 'black',
                                                    lineHeight: '1.3',
                                                    alignSelf: 'flex-start'
                                                }}>{message.content}</p>}
                                                {showFiles(message.mediaList, "recipient")}
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                            <div ref={messageEndRef}></div>
                        </div>
                        <div className="chat-room-bottom">
                            <label htmlFor="file-upload">
                                <FontAwesomeIcon icon={faCamera} style={{
                                    fontSize: '30px',
                                    cursor: 'pointer',
                                    marginBottom: '4px',
                                    color: '#E53935'
                                }}/>
                                <input
                                    type="file"
                                    id="file-upload"
                                    hidden
                                    multiple
                                    accept="image/*, video/*,
                                    .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                    .xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                    .pdf,application/pdf"
                                    onChange={(e) => setMediaList([...e.target.files])}
                                />
                            </label>
                            <div style={{
                                width: '90%',
                                padding: '10px',
                                backgroundColor: 'lightgray',
                                borderRadius: '20px',
                            }}>
                                {mediaList.length > 0 &&
                                    <div className="tmp-media-list">
                                        <label htmlFor="file-upload-tmp">
                                            <FontAwesomeIcon icon={faPlus} style={{
                                                fontSize: '30px',
                                                padding: '15px',
                                                cursor: 'pointer',
                                                backgroundColor: '#efefef',
                                                borderRadius: '15px',
                                                border: '1px solid #E53935',
                                                borderStyle: 'dashed'
                                            }}/>
                                            <input
                                                type="file"
                                                id="file-upload-tmp"
                                                hidden
                                                multiple
                                                accept="image/*, video/*,
                                    .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                    .xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                    .pdf,application/pdf"
                                                onChange={(e) => setMediaList(prev => [...prev, ...e.target.files])}
                                            />
                                        </label>
                                        {mediaList.map((file, index) => (
                                            <div style={{
                                                position: 'relative'
                                            }}>
                                                {file.type.includes('image') || file.type.includes('video') ? (
                                                    <img src={URL.createObjectURL(file)} alt="" key={index} style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        borderRadius: '10px',
                                                        objectFit: 'cover'
                                                    }}/>
                                                ) : (
                                                    <div className = "file-info">
                                                        <FontAwesomeIcon icon={faFile} style={{
                                                            fontSize: '25px'
                                                        }}/>
                                                        <p className="file-name">{file.name}</p>
                                                    </div>
                                                )}
                                                <FontAwesomeIcon icon={faXmark} style={{
                                                    fontSize: '20px',
                                                    position: 'absolute',
                                                    top: '-5px',
                                                    right: '-5px',
                                                    cursor: 'pointer',
                                                    width: '20px',
                                                    height: '20px',
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%',
                                                }} onClick={() => setMediaList(mediaList.filter((_, i) => i !== index))} />
                                            </div>
                                        ))}
                                    </div>
                                }
                                <input
                                    className="chat-room-message-input"
                                    placeholder="Nhập tin nhắn"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") await sendMessage();
                                    }}
                                />
                            </div>
                            <div className="send-icon" onClick={async () => await sendMessage()}></div>
                        </div>
                    </div>
                )}
                {showInfo &&
                    <div className="right-content">
                        <img src={`data:${getImageMime(chatRoomRef.current.avatar)};base64,${chatRoomRef.current.avatar}`} alt="" style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}/>
                        <p style={{fontSize: '20px', fontWeight: 'bold', marginTop: '10px', marginBottom: '40px'}}>{chatRoomRef.current.name ? chatRoomRef.current.name : chatRoomRef.current.displayName}</p>
                        <div className="option">
                            <div className = "option-label" onClick={() => setOption1(prev => !prev)}>
                                <p>Tùy chỉnh đoạn chat</p>
                                {!option1 ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronUp}/>}
                            </div>
                            {option1 &&
                                <div>
                                    <div className="option-content" onClick={() => {
                                        setOption11(true);
                                        setOptionInput(chatRoomRef.current.name);
                                    }}>
                                        <div className="option-item">
                                            <FontAwesomeIcon icon={faPen} style={{color: '#E53935', fontSize: '25px'}}/>
                                            <p>Đổi tên đoạn chat</p>
                                        </div>
                                    </div>
                                    <label htmlFor="file-upload-avatar" className="option-content">
                                        <div className="option-item">
                                            <FontAwesomeIcon icon={faImage} style={{color: '#E53935', fontSize: '25px'}}/>
                                            <p>Thay đổi ảnh</p>
                                        </div>
                                        <input
                                            type="file"
                                            id="file-upload-avatar"
                                            hidden
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const formData = new FormData();
                                                formData.append('image', e.target.files[0]);
                                                try {
                                                    const response = await conversationService.changeAvatar(chatRoomRef.current.id, formData);
                                                    chatRoomRef.current.avatar = response;
                                                    localStorage.setItem("chatRoom", JSON.stringify(chatRoomRef.current));
                                                    setChatRooms(prev => prev.map(chatRoom => {
                                                        if(chatRoom.id === chatRoomRef.current.id){
                                                            return {
                                                                ...chatRoom,
                                                                avatar: response
                                                            }
                                                        }
                                                        return chatRoom;
                                                    }));
                                                }catch (e) {
                                                    console.log(e);
                                                }
                                            }}
                                        />
                                    </label>
                                    <div className="option-content" onClick={() => setOption13(true)}>
                                        <div className="option-item">
                                            <div className="change-nickname-icon"></div>
                                            <p>Chỉnh sửa biệt danh</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="option">
                            <div className = "option-label"  onClick={() => setOption2(prev => !prev)}>
                                <p>Thành viên trong đoạn chat</p>
                                {!option2 ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronUp}/>}
                            </div>
                            {option2 &&
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    padding: '5px 10px 5px 10px',
                                    maxHeight: '320px',
                                    overflowY: 'auto'
                                }}>
                                    {chatRoomRef.current.participants.map((participant, index) => (
                                        <div className="participant" key={index}>
                                            <div style={{
                                                display: 'flex',
                                                gap: '15px',
                                                alignItems: 'center'
                                            }}>
                                                <img src={`data:${getImageMime(participant.avatar)};base64,${participant.avatar}`} alt="" className="participant-avatar"/>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    gap: '7px'
                                                }}>
                                                    <p className="participant-name">{participant.username}</p>
                                                    <p className="participant-role">{participant.role !== "Thành viên" && participant.role}</p>
                                                </div>
                                            </div>
                                            <FontAwesomeIcon icon={faEllipsis} className="participant-more-icon"/>
                                        </div>
                                    ))}
                                    <div className="option-item" onClick={() => setOption21(true)}>
                                        <FontAwesomeIcon icon={faUserPlus} style={{fontSize: '25px', color: '#E53935'}}/>
                                        <p>Thêm người</p>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="option">
                            <div className = "option-label" onClick={() => setOption3(prev => !prev)}>
                                <p>File phương tiện & file</p>
                                {!option3 ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronUp}/>}
                            </div>
                            {option3 &&
                                <div>
                                    <div className="option-content" onClick={() => setOption31(true)}>
                                        <div className="option-item">
                                            <FontAwesomeIcon icon={faFileImage} style={{color: '#E53935', fontSize: '25px'}}/>
                                            <p>File phương tiện</p>
                                        </div>
                                    </div>
                                    <div className="option-content" onClick={() => setOption32(true)}>
                                        <div className="option-item">
                                            <FontAwesomeIcon icon={faFileLines} style={{color: '#E53935', fontSize: '25px'}}/>
                                            <p>File</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Chat;