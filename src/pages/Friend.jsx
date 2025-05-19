import React, { useState } from "react";
import "../styles/friends.css";
import userAvatar from "../assets/user.jpg";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const suggestedFriends = [
  { id: 1, name: "Lê Thị Hoa", avatar: userAvatar, mutual: 5 },
  {
    id: 2,
    name: "Phạm Minh Đức",
    avatar: userAvatar,
    mutual: 3,
    description: "Làm việc tại FPT Software",
  },
];

const friendRequests = [
  { id: 3, name: "Trần Văn Nam", avatar: userAvatar, mutual: 2 },
];

const currentFriends = [
  { id: 4, name: "Nguyễn Quang Anh", avatar: userAvatar },
  { id: 5, name: "Hoàng Minh Tuấn", avatar: userAvatar },
];

const Friend = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = currentFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="friends-container">
      <Header />
      <main className="friends-content">
        <h2>Bạn bè</h2>

        <div className="friend-search">
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="fa-search" />
        </div>

        <section className="friend-section">
          <h3>Danh sách bạn bè</h3>
          <ul className="friend-list">
            {filteredFriends.map((friend) => (
              <li key={friend.id} className="friend-item">
                <img src={friend.avatar} alt={friend.name} />
                <div className="friend-info">
                  <span>{friend.name}</span>
                </div>
                <div className="friend-actions">
                  <button className="message-btn">Nhắn tin</button>
                  <button className="cancel-btn">Hủy kết bạn</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="friend-section">
          <h3>Lời mời kết bạn</h3>
          <ul className="friend-list">
            {friendRequests.map((user) => (
              <li key={user.id} className="friend-item">
                <img src={user.avatar} alt={user.name} />
                <div className="friend-info">
                  <span>{user.name}</span>
                  {user.mutual && <p>{user.mutual} bạn chung</p>}
                </div>
                <div className="friend-actions">
                  <button className="accept-btn">Chấp nhận</button>
                  <button className="decline-btn">Xóa</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="friend-section">
          <h3>Gợi ý kết bạn</h3>
          <ul className="friend-list">
            {suggestedFriends.map((user) => (
              <li key={user.id} className="friend-item">
                <img src={user.avatar} alt={user.name} />
                <div className="friend-info">
                  <span>{user.name}</span>
                  {user.mutual && <p>{user.mutual} bạn chung</p>}
                  {user.description && <p>{user.description}</p>}
                </div>
                <div className="friend-actions">
                  <button className="add-btn">Thêm bạn bè</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Friend;
