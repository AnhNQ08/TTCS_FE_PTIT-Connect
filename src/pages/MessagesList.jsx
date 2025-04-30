import React from "react";
import { Link } from "react-router-dom";
import "../styles/messagesList.css";

const MessagesList = () => {
  const users = [
    {
      id: 1,
      name: "Nguyễn Quang Anh",
      lastMessage: "Chào bạn!",
      time: "2 giờ trước",
    },
    {
      id: 2,
      name: "Hoàng Minh Tuấn",
      lastMessage: "Mình ổn, cảm ơn!",
      time: "1 giờ trước",
    },
    // Add more users as needed
  ];

  return (
    <div className="messages-list-container">
      <header className="messages-header">
        <h2>Tin Nhắn</h2>
      </header>

      <div className="messages-list">
        {users.map((user) => (
          <Link
            to={`/messages/${user.id}`}
            key={user.id}
            className="message-item"
          >
            <div className="message-avatar">
              <img
                src="src/assets/user.jpg" // Example image
                alt={user.name}
                className="avatar"
              />
            </div>
            <div className="message-content">
              <div className="message-sender">{user.name}</div>
              <div className="message-text">{user.lastMessage}</div>
              <div className="message-time">{user.time}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MessagesList;
