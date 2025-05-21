import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    faCamera,
    faChevronDown, faChevronUp,
    faCircleInfo, faEllipsis, faFile, faFileImage, faFileLines, faImage,
    faMagnifyingGlass, faPen,
    faPhone, faPlus,
    faVideo,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import '../styles/Chat.css';
import SockJSContext from "@/context/SockJSContext.jsx";
import * as conversationService from '../services/conversation.js';
import * as chatService from '../services/chat.js';
import getImageMime from "@/services/getImageFromUnit8.js";

const Chat = () => {
    const {stompClientRef, setUpStompClient, disconnectStomp} = useContext(SockJSContext);
    const []
    const [chatRooms, setChatRooms] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [mediaList, setMediaList] = useState([]);
    const [showInfo, setShowInfo] = useState(true);
    const [messages, setMessages] = useState([]);
    const [chatRoom, setChatRoom] = useState({});
    const messageEndRef = useRef(null);
    const [option1, setOption1] = useState(false);
    const [option2, setOption2] = useState(false);
    const [option3, setOption3] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchChatRooms();
            const chatRoomIds = response.map(chatRoom => chatRoom.id);
            await setUpStompClient(chatRoomIds, user);
        }
    }, [])

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchChatRooms = async () => {
        try {
            const response = await conversationService.getChatRoom();
            setChatRooms(response);
        }catch(err) {
            console.log(err);
        }
    }

    const sendMessage = async (e) => {
        if(messageInput.length === 0 && mediaList.length === 0){
            e.preventDefault();
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
            content: messageInput,
            conversationId: chatRoom.id,
            mediaList: response
        }
        if(chatRoom.type === 'GROUP'){

        }
    }

    const onMessageReceived = useCallback(async (payload) => {
        setTimeout(async () => {
            const message = JSON.parse(payload.body);
            if(message.conversationId === chatRoom.id) {
                const response = await conversationService.updateLastMessageStatus(localStorage.getItem("chatRoomId"));
                if(response !== "Status updated"){
                    alert("Có lỗi xảy ra");
                    return;
                }
                setMessages((prev) => [...prev, message]);
            }
            const tmpChatRooms = await fetchChatRooms();
            setChatRooms(tmpChatRooms);
        }, 150);
    }, [])

    const onMessageRevoke = async (payload) => {
        setMessages(await chatService.getMessages(payload.body));
    }

    const showFiles = (files, type) => {
        const imageVideoList = [];
        const fileList = [];
        files.map((file) => {
            if(file.type.includes('image') || file.type.includes('video')){
                imageVideoList.push(file);
            }else{
                fileList.push(file);
            }
        })
        if(files.length > 0){
            return (
                <>
                    {imageVideoList.length > 0 &&
                        <div className={`media-grid media-count-${imageVideoList.length}`}>
                            {imageVideoList.map((file, index) => (
                                <img src={file.url} alt="" key={index} style={{}}/>
                            ))}
                        </div>
                    }
                    {fileList.length > 0 &&
                        fileList.map((file, index) => (
                            <a className = {`file-info-message ${type}`} key={index}
                                href={file.url}
                               download={file.name}
                            >
                                <FontAwesomeIcon icon={faFile} style={{
                                    fontSize: '35px'
                                }}/>
                                <div style={{
                                    maxWidth: '230px',
                                    overflow: 'hidden'
                                }}>
                                    <p className="file-name" >{file.name}</p>
                                    <p className="file-size">{file.size}</p>
                                </div>
                            </a>
                        ))
                    }
                </>
            )
        }
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                gap: '15px',
                margin: '0 auto',
                maxWidth: '2000px',
                paddingRight: '15px',
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
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
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
                            </div>
                            <div className="function" >
                                <FontAwesomeIcon icon={faPhone} style={{color: '#E53935'}} onClick={() => alert("Chức năng này chưa khả dụng!")}/>
                                <FontAwesomeIcon icon={faVideo} style={{color: '#E53935'}} onClick={() => alert("Chức năng này chưa khả dụng!")}/>
                                <FontAwesomeIcon icon={faCircleInfo} style={{color: '#E53935'}} onClick={() => setShowInfo(!showInfo)}/>
                            </div>
                        </div>
                    </div>
                    <div className="chat-room-messages">
                        <div className="sender-message">
                            <p style={{
                                backgroundColor: '#E53935',
                                padding: '10px',
                                borderRadius: '25px',
                                color: 'white',
                                lineHeight: '1.3'
                            }}>Đây là tin nhắn của người gửi sdf dsf sdfdsfsdfsdfsdfsdfsdfd sf dsf dsds fdsf dsf dsf dsdsf fsdf dsf sd fs </p>
                            {showFiles(mediaList, "sender")}
                        </div>
                        <div className="recipient-message">
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '10px'
                            }}>
                                <img src="/vite.svg" alt=""/>
                                <div className="message-content">
                                    <p style={{
                                        backgroundColor: 'lightgray',
                                        padding: '10px',
                                        borderRadius: '25px',
                                        color: 'black',
                                        lineHeight: '1.3',
                                        alignSelf: 'flex-start'
                                    }}>Đây là tin nhắn của người nhận</p>
                                </div>
                            </div>
                        </div>
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
                            />
                        </div>
                        <div className="send-icon"></div>
                    </div>
                </div>
                {showInfo &&
                    <div className="right-content">
                        <img src="/vite.svg" alt="" style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}/>
                        <p style={{fontSize: '20px', fontWeight: 'bold', marginTop: '10px'}}>Tinh hoa cột sống</p>
                        <div className="option">
                            <div className = "option-label" onClick={() => setOption1(prev => !prev)}>
                                <p>Tùy chỉnh đoạn chat</p>
                                {!option1 ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronUp}/>}
                            </div>
                            {option1 &&
                                <div>
                                    <div className="option-content">
                                        <div className="option-item">
                                            <FontAwesomeIcon icon={faPen} style={{color: '#E53935', fontSize: '25px'}}/>
                                            <p>Đổi tên đoạn chat</p>
                                        </div>
                                    </div>
                                    <div className="option-content">
                                        <div className="option-item">
                                            <FontAwesomeIcon icon={faImage} style={{color: '#E53935', fontSize: '25px'}}/>
                                            <p>Thay đổi ảnh</p>
                                        </div>
                                    </div>
                                    <div className="option-content">
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
                                    gap: '10px'
                                }}>
                                    <div className="participant">
                                        <div style={{
                                            display: 'flex',
                                            gap: '15px',
                                            alignItems: 'center'
                                        }}>
                                            <img src="/vite.svg" alt="" className="participant-avatar"/>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}>
                                                <p className="participant-name">Hứa Duy Anh</p>
                                                <p className="participant-role">Người tạo nhóm</p>
                                            </div>
                                        </div>
                                        <FontAwesomeIcon icon={faEllipsis} className="participant-more-icon"/>
                                    </div>
                                    <div className="participant">
                                        <div style={{
                                            display: 'flex',
                                            gap: '15px',
                                            alignItems: 'center'
                                        }}>
                                            <img src="/vite.svg" alt="" className="participant-avatar"/>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}>
                                                <p className="participant-name">Phan Văn Biên</p>
                                                <p className="participant-role"></p>
                                            </div>
                                        </div>
                                        <FontAwesomeIcon icon={faEllipsis} className="participant-more-icon"/>
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
                                    <div className="option-content">
                                        <div className="option-item">
                                            <FontAwesomeIcon icon={faFileImage} style={{color: '#E53935', fontSize: '25px'}}/>
                                            <p>File phương tiện</p>
                                        </div>
                                    </div>
                                    <div className="option-content">
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