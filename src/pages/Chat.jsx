import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    faCamera,
    faChevronDown,
    faChevronUp,
    faCircleInfo,
    faFile,
    faFileImage,
    faFileLines,
    faImage,
    faMagnifyingGlass,
    faPen,
    faPhone,
    faPlus, faUserPlus,
    faVideo,
    faX,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import '../styles/Chat.css';
import SockJSContext from "@/context/SockJSContext.jsx";
import * as conversationService from '../services/conversation.js';
import * as chatService from '../services/message.js';
import * as messageService from '../services/message.js';
import * as friendService from '../services/friend.js';
import * as participantService from '../services/chatParticipant.js';
import getImageMime from "@/services/getImageFromUnit8.js";
import AuthContext from "@/context/AuthContext.jsx";
import {useNavigate, useParams} from "react-router-dom";
import ParticipantListNickname from "@/components/ParticipantListNickname.jsx";
import ParticipantList from "@/components/ParticipantList.jsx";
import FriendList from "@/components/FriendList.jsx";
import {useInView} from "react-intersection-observer";
import {useDebounce} from '../hooks/useDebounce.js';
import {getParticipants} from "../services/chatParticipant.js";

const Chat = () => {
    const {chatId} = useParams();
    const navigate = useNavigate();
    const {stompClientRef, setUpStompClient, disconnectStomp, unsubscribe, subscribe} = useContext(SockJSContext);
    const {user} = useContext(AuthContext);
    const [chatRooms, setChatRooms] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [mediaList, setMediaList] = useState([]);
    const [showInfo, setShowInfo] = useState(false);
    const [messages, setMessages] = useState([]);
    const chatRoomRef = useRef(null);
    const messageEndRef = useRef(null);
    const userRef = useRef(null);
    const participantRef = useRef(null);
    const pageNumberRef = useRef(0);
    const [chosenParticipant, setChosenParticipant] = useState([]);
    const [option1, setOption1] = useState(false);
    const [option2, setOption2] = useState(false);
    const [option3, setOption3] = useState(false);
    const [option11, setOption11] = useState(false);
    const [option13, setOption13] = useState(false);
    const [option21, setOption21] = useState(false);
    const [option31, setOption31] = useState(false);
    const [option32, setOption32] = useState(false);
    const [findParticipantList, setFindParticipantList] = useState([]);
    const [optionInput, setOptionInput] = useState("");
    const [participantNameInput, setParticipantNameInput] = useState("");
    const participantInputDebounce = useDebounce(participantNameInput, 300);
    const {ref: loadMoreRef, inView} = useInView({});
    const [beingKicked, setBeingKicked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if(user){
                userRef.current = user;
                setFindParticipantList([]);
                const response = await fetchChatRooms();
                setChatRooms(response);
                const chatRoomIds = response.map(chatRoom => chatRoom.id);
                await setUpStompClient(chatRoomIds, user.id, onMessageReceived, onNoticeReceived);
                const savedChatRoom = JSON.parse(localStorage.getItem("chatRoom"));
                if(savedChatRoom) {
                    const tmpMessage = await messageService.getMessages(savedChatRoom.id);
                    setMessages(tmpMessage);
                    participantRef.current = savedChatRoom.participants.find(participant => participant.participantId === user.id);
                    chatRoomRef.current = savedChatRoom;
                    const savedMessage = JSON.parse(localStorage.getItem("messages"));
                    if(savedMessage) setMessages(savedMessage);
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
                const response = await messageService.getMessages(chatId);
                localStorage.setItem("messages", JSON.stringify(response));
                setMessages(response);
            }catch(e) {
                console.log(e);
            }
        }
        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if(inView){
            pageNumberRef.current++;
            fetchParticipantList().then(newFriendList => {
                setFindParticipantList(prev => prev.concat(newFriendList));
            })
        }
    }, [inView]);

    useEffect(() => {
        pageNumberRef.current = 0;
        fetchParticipantList().then(newFriendList => {
            setFindParticipantList(newFriendList);
        })
    }, [participantInputDebounce]);

    const fetchParticipantList = async () => {
        try {
            console.log(participantNameInput);
            const response = await friendService.findFriends(user.id, participantNameInput, pageNumberRef.current);
            const res = response.filter(friend =>
                !chatRoomRef.current.participants.some(participant => participant.participantId === friend.id)
            );
            return res || [];
        }catch(e) {
            console.log(e);
        }
    }

    const fetchChatRooms = async () => {
        try {
            return await conversationService.getChatRoom();
        }catch(err) {
            console.log(err);
        }
    }

    const sendNoticeToUser = useCallback(async (content, opponentId) => {
        const payload = {
            recipientId: opponentId,
            content,
            conversationId: chatRoomRef.current.id
        }
        stompClientRef.current.publish({
            destination: '/app/privateNotice',
            body: JSON.stringify(payload)
        })
    }, [])

    const onNoticeReceived = useCallback(async (payload) => {
        const message = JSON.parse(payload.body);
        if(message.content === ("bị xóa khỏi nhóm")){
            unsubscribe(message.conversationId);
            setChatRooms(prev => prev.filter(chatRoom => chatRoom.id !== chatRoomRef.current.id));
            setBeingKicked(true);
            if(chatRoomRef.current.id === message.conversationId){
                chatRoomRef.current.participants = chatRoomRef.current.partcipants.filter(participant => participant.participantId !== userRef.current.id);
            }
        }else if(message.content === "được thêm vào nhóm"){
            if(stompClientRef.current){
                stompClientRef.current.subscribe(
                    `/topic/conversation/${message.conversationId}`, onMessageReceived
                );
            }
            setChatRooms(await fetchChatRooms());
        }
    }, [])

    const sendMessage = useCallback(async (content, type) => {
        if(content.length === 0 && mediaList.length === 0){
            alert("Hãy nhập tin nhắn hoặc gửi file!");
            return;
        }
        let response = [];
        if(mediaList.length > 0){
            const formData = new FormData();
            for(const file of mediaList){
                formData.append('file', file);
            }
            response = await chatService.uploadMessageFile(formData);
        }
        const payload = {
            senderId: userRef.current.id,
            content: content,
            conversationId: chatRoomRef.current.id,
            type: type,
            mediaList: response
        }
        if(chatRoomRef.current.type === 'GROUP'){
            stompClientRef.current.publish({
                destination: `/app/groupChat`,
                body: JSON.stringify(payload)
            });
        }else{
            payload.recipientId = chatRoomRef.current.participants.find(participant => participant.participantId !== userRef.current.id).participantId;
            stompClientRef.current.publish({
                destination: `/app/privateChat`,
                body: JSON.stringify(payload)
            });
        }
        const lastMessage = {
            senderName: chatRoomRef.current.participants.find(participant => participant.participantId === userRef.current.id).participantName,
            senderId: userRef.current.id,
            content: content,
            notRead: chatRoomRef.current.participants.filter(id => id !== userRef.current.id),
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
        const messageId = await chatService.getLastMessageIdByConversationId(chatRoomRef.current.id, userRef.current.id);
        const messageDTO = {
            id: messageId,
            sender: userRef.current,
            content: content,
            mediaList: response,
            conversationId: chatRoomRef.current.id,
            type: type,
            sentAt: new Date()
        }
        setMessages(prev => [...prev, messageDTO]);
    }, [])

    const onMessageReceived = useCallback(async (payload) => {
        setTimeout(async () => {
            const message = JSON.parse(payload.body);
            if(chatRoomRef.current && message.conversationId === chatRoomRef.current.id){
                if(chatRoomRef.current.lastMessage) {
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
            if(message.type === "GROUP_NOTICE" && message.sender.id !== userRef.current.id){
                chatRoomRef.current = tmpChatRooms.find(chatRoom => chatRoom.id === chatRoomRef.current.id);
            }
            setChatRooms(tmpChatRooms);
        }, 50);
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

    const handleAddParticipant = async () => {
        try {
            for(const participant of chosenParticipant){
                const response1 = await participantService.addParticipant(chatRoomRef.current.id, participant.id);
                if (response1 !== "Participant added") alert("Có lỗi xảy ra")
                else{
                    const response2 = await participantService.getParticipants(chatRoomRef.current.id);
                    chatRoomRef.current.participants = response2;
                    localStorage.setItem("chatRoom", JSON.stringify(chatRoomRef.current));
                    await sendMessage(user.username + " đã thêm " + participant.username + " vào nhóm.", "GROUP_NOTICE");
                    await sendNoticeToUser("được thêm vào nhóm", participant.id);
                }

            }
            setOption21(false);
            setChosenParticipant([]);
            pageNumberRef.current = 0;
        }catch (e){
            console.log(e);
        }
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
                                                // setChatRooms(prev => prev.map(chatRoom => {
                                                //     if(chatRoom.id === chatRoomRef.current.id){
                                                //         return {
                                                //             ...chatRoom,
                                                //             name: optionInput
                                                //         }
                                                //     }
                                                //     return chatRoom;
                                                // }));
                                                chatRoomRef.current.name = optionInput;
                                                localStorage.setItem("chatRoom", JSON.stringify(chatRoomRef.current));
                                                await sendMessage(user.username + " đã đổi tên nhóm thành " + optionInput + ".", "GROUP_NOTICE");
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
                                <ParticipantListNickname user={participantRef} stompClientRef={stompClientRef} sendMessage={sendMessage} setMessages={setMessages} optionInput={optionInput} setOptionInput={setOptionInput} participant={participant} index={index} chatRoomRef={chatRoomRef}/>
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
                {option21 && (
                    <>
                        <p className="popup-title">Thêm thành viên</p>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            gap: '10px',
                            width: '500px',
                        }}>
                            <div className="search-new-participant-div">
                                <FontAwesomeIcon icon={faMagnifyingGlass}/>
                                <input
                                    type="text"
                                    value={participantNameInput}
                                    placeholder="Tìm kiếm bạn bè"
                                    style={{
                                        backgroundColor: 'inherit',
                                        outline: 'none',
                                        border: 'none',
                                        width: 'auto',
                                        fontSize: '19px',
                                    }}
                                    onChange={(e) => setParticipantNameInput(e.target.value)}
                                />
                            </div>
                            <div className="chosen-new-participant">
                                {chosenParticipant.length > 0 && chosenParticipant.map((participant, index) => (
                                    <>
                                        <div key={index} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '5px',
                                            position: 'relative',
                                            width: '85px'
                                        }}>
                                            <img src={`data:${getImageMime(participant.avatar)};base64,${participant.avatar}`} alt="" className="participant-avatar"/>
                                            <p style={{
                                                color: 'rgb(117,117,117)',
                                                fontSize: '14px',
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>{participant.username}</p>
                                            <FontAwesomeIcon icon={faXmark} style={{
                                                fontSize: '12px',
                                                padding: '5px',
                                                borderRadius: '50%',
                                                position: 'absolute',
                                                top: '0',
                                                right: '15px',
                                                cursor: 'pointer',
                                                backgroundColor: 'lightgray'
                                            }} onClick={() => setChosenParticipant(prev => prev.filter(p => p.id !== participant.id))}/>
                                        </div>
                                    </>
                                ))}
                            </div>
                            <div style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                            }}>
                                {findParticipantList.length > 0 && findParticipantList.map((friend, index) => (
                                    <FriendList index={index} setChosenParticipant={setChosenParticipant} opponent={friend} chosenParticipant={chosenParticipant}/>
                                ))}
                                <div ref={loadMoreRef}></div>
                            </div>
                            <FontAwesomeIcon icon={faX} style={{
                                fontSize: '15px',
                                padding: '10px',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                cursor: 'pointer',
                                backgroundColor: 'lightgray'
                            }} onClick={() => {
                                setOption21(false);
                                pageNumberRef.current = 1;
                            }}/>
                        </div>
                        <button className="confirm-button" style={{margin: '0px 20px 20px 20px'}} onClick={() => handleAddParticipant()}>Xác nhận</button>
                    </>
                )}
            </div>
        )
    }

    return user && (
        <div style={{
            backgroundColor: 'lightgray',
            position: 'relative'
        }}>
            {(option11 || option13 || option21 || option31 || option32) && (
                <>
                    <div className="curtain">
                    </div>
                    {getCurtainContent()}
                </>
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
                                                {data.lastMessage.type === "GROUP_NOTICE" ? (
                                                    data.lastMessage.content
                                                ) : (
                                                    data.lastMessage.senderId !== user.id
                                                        ? `${data.lastMessage.senderName}: ${data.lastMessage.content}`
                                                        : `Bạn: ${data.lastMessage.content}`
                                                )}
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
                            <div style={{marginTop: 'auto'}}></div>
                            {messages.map((message, index) => (
                                message.type === "GROUP_NOTICE" ?
                                <p className="notice-message">{message.content}</p> :
                                (
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
                                )
                            ))}
                            <div ref={messageEndRef}></div>
                        </div>
                        <div>
                            {!beingKicked ? (
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
                                                if (e.key === "Enter") await sendMessage(messageInput, "NORMAL");
                                            }}
                                        />
                                    </div>
                                    <div className="send-icon" onClick={async () => await sendMessage(messageInput, "NORMAL")}></div>
                                </div>
                            ) : (
                                <p style={{
                                    color: 'red',
                                    fontSize: '20px',
                                    textAlign: 'center',
                                    padding: '15px'
                                }}>Bạn không thể nhắn tin vào nhóm này</p>
                            )}
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
                                    (chatRoomRef.current.type === "GROUP" && (
                                    <div className="option-content" onClick={() => {
                                        if(beingKicked){
                                            alert("Bạn không thể thực hiện chức năng này");
                                            return;
                                        }
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
                                                if(beingKicked){
                                                    alert("Bạn không thể thực hiện chức năng này");
                                                    return;
                                                }
                                                const formData = new FormData();
                                                formData.append('image', e.target.files[0]);
                                                try {
                                                    chatRoomRef.current.avatar = await conversationService.changeAvatar(chatRoomRef.current.id, formData);
                                                    await sendMessage(user.username + " đã đổi ảnh nhóm.", "GROUP_NOTICE");
                                                    localStorage.setItem("chatRoom", JSON.stringify(chatRoomRef.current));
                                                    // setChatRooms(prev => prev.map(chatRoom => {
                                                    //     if(chatRoom.id === chatRoomRef.current.id){
                                                    //         return {
                                                    //             ...chatRoom,
                                                    //             avatar: response
                                                    //         }
                                                    //     }
                                                    //     return chatRoom;
                                                    // }));
                                                }catch (e) {
                                                    console.log(e);
                                                }
                                            }}
                                        />
                                    </label>
                                    ))
                                    <div className="option-content" onClick={() => {
                                        if(beingKicked){
                                            alert("Bạn không thể thực hiện chức năng này");
                                            return;
                                        }
                                        setOption13(true);
                                        setOptionInput("");
                                    }}>
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
                                    padding: '5px 10px 5px 10px'
                                }}>
                                    {chatRoomRef.current.participants.map((participant, index) =>
                                        <ParticipantList sendNoticeToUser={sendNoticeToUser} sendMessage={sendMessage} chatRoomRef={chatRoomRef} participant={participant} index={index} currentUser={participantRef.current}/>
                                    )}
                                    (chatRoomRef.current.type === "GROUP" && (
                                        <div className="option-item" onClick={() => {
                                            if(beingKicked){
                                                alert("Bạn không thể thực hiện chức năng này");
                                                return;
                                            }
                                            setOption21(true);
                                            pageNumberRef.current = 0;
                                            fetchParticipantList().then(res => {
                                                setFindParticipantList(res);
                                            })
                                        }}>
                                            <FontAwesomeIcon icon={faUserPlus} style={{fontSize: '25px', color: '#E53935'}}/>
                                            <p>Thêm người</p>
                                        </div>
                                    )
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