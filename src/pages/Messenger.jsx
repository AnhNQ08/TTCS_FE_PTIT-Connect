import React, { useState } from "react";
import "../styles/message.css";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import userAvatar from "../assets/user.jpg";

const recentChats = [
  {
    id: 1,
    user: "Nguyễn Quang Anh",
    avatar: userAvatar,
    lastMessage: "Chào bạn!",
    time: "1 phút trước",
    messages: [
      { sender: "me", content: "Chào bạn!", timestamp: "vừa xong" },
      {
        sender: "Nguyễn Văn A",
        content: "Bạn khỏe không?",
        timestamp: "30 giây trước",
      },
    ],
  },
  {
    id: 2,
    user: "Hứa Duy Anh",
    avatar: userAvatar,
    lastMessage: "Bạn khỏe không?",
    time: "5 phút trước",
    messages: [
      {
        sender: "me",
        content: "Mình khỏe, còn bạn?",
        timestamp: "5 phút trước",
      },
      {
        sender: "Trần Thị B",
        content: "Mình cũng khỏe.",
        timestamp: "4 phút trước",
      },
    ],
  },
  {
    id: 3,
    user: "Phan Văn Biên",
    avatar: userAvatar,
    lastMessage: "Ok, mình sẽ đến.",
    time: "10 phút trước",
    messages: [
      {
        sender: "Lê Công C",
        content: "Mai đi đá bóng nhé?",
        timestamp: "10 phút trước",
      },
      { sender: "me", content: "Ok, mấy giờ?", timestamp: "9 phút trước" },
    ],
  },
];

const Messager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(recentChats[0] || null);
  const [newMessage, setNewMessage] = useState("");

  const filteredChats = recentChats.filter((chat) =>
    chat.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (selectedChat && newMessage.trim()) {
      const newMessageObject = {
        sender: "me",
        content: newMessage,
        timestamp: "vài giây trước",
      };
      const updatedChats = recentChats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, messages: [...chat.messages, newMessageObject] }
          : chat
      );
      const updatedSelectedChat = updatedChats.find(
        (chat) => chat.id === selectedChat.id
      );
      setSelectedChat(updatedSelectedChat);
      setNewMessage("");
    }
  };

  return (
    <div className="message-container">
      <Header />
      <main className="message-content">
        <div className="chat-list-container">
          <div className="message-header">
            <h2>Tin nhắn</h2>
          </div>
          <div className="message-search">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="fa-search" />
          </div>
          <ul className="chat-list">
            {filteredChats.map((chat) => (
              <li
                key={chat.id}
                className={`chat-item ${
                  selectedChat?.id === chat.id ? "selected" : ""
                }`}
                onClick={() => handleSelectChat(chat)}
              >
                <img src={chat.avatar} alt={chat.user} className="avatar" />
                <div className="chat-info">
                  <span className="user-name">{chat.user}</span>
                  <p className="last-message">{chat.lastMessage}</p>
                </div>
                <span className="time">{chat.time}</span>
              </li>
            ))}
          </ul>
        </div>
        {selectedChat && (
          <div className="chat-window">
            <div className="chat-header">
              <h2>{selectedChat.user}</h2>
            </div>
            <div className="message-area">
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.sender === "me" ? "sent" : "received"
                  }`}
                >
                  <p className="content">{msg.content}</p>
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
              ))}
            </div>
            <div className="message-input-area">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button onClick={handleSendMessage}>Gửi</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messager;