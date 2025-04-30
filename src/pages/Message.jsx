import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/message.css";

const Message = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "Nguyễn Quang Anh",
      content: "Chào bạn, bạn khỏe không?",
      timestamp: "2 giờ trước",
    },
    {
      sender: "Hoàng Minh Tuấn",
      content: "Mình ổn, cảm ơn!",
      timestamp: "1 giờ trước",
    },
    // Thêm các tin nhắn mẫu tại đây
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: "Bạn", // giả sử người gửi là "Bạn"
        content: message,
        timestamp: "Vừa xong", // Cập nhật thời gian gửi tin nhắn
      };
      setMessages([...messages, newMessage]);
      setMessage(""); // Reset message input after sending
    }
  };

  return (
    <div className="message-container">
      <header className="message-header">
        <h2>Nhắn tin với người {userId}</h2> {/* Hiển thị tên người nhắn */}
      </header>

      <div className="message-box">
        <div className="message-list">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-item ${
                msg.sender === "Bạn" ? "sent" : "received"
              }`}
            >
              <div className="message-avatar">
                <img
                  src="src/assets/user.jpg"
                  alt={msg.sender}
                  className="avatar"
                />
              </div>
              <div className="message-content">
                <div className="message-sender">{msg.sender}</div>
                <div className="message-text">{msg.content}</div>
                <div className="message-time">{msg.timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="message-input">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            rows="3"
          />
          <button className="send-btn" onClick={handleSendMessage}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
