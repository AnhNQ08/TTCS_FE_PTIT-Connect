import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";
import userAvatar from "../assets/user.jpg";

const HomePage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Nguyễn Quang Anh",
      content: "Đây là bài viết đầu tiên của tôi trên PTIT CONNECT!",
      time: "2 giờ trước",
      avatar: userAvatar,
    },
    {
      id: 2,
      user: "Phan Văn Biên",
      content: "Chúc mọi người ngày mới vui vẻ!",
      time: "4 giờ trước",
      avatar: userAvatar,
    },
    {
      id: 3,
      user: "Hứa Duy Anh",
      content: "Hôm nay mình đã học được rất nhiều điều mới!",
      time: "1 ngày trước",
      avatar: userAvatar,
    },
  ]);

  return (
    <div className="homepage-container">
      <header className="header">
        <div className="header-left">
          <Link to="/">PTIT CONNECT</Link>
        </div>

        <div className="header-center">
          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
        </div>

        <div className="header-right">
          <nav className="header-nav">
            <ul>
              <li>
                <Link to="/">
                  <i className="fa fa-home"></i>
                </Link>
              </li>
              <li>
                <Link to="/friends">
                  <i className="fa fa-users"></i>
                </Link>
              </li>
              <li>
                <Link to="/message">
                  <i className="fa fa-envelope"></i>
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <i className="fa fa-user"></i>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="news-feed">
          <div className="post-box">
            <textarea placeholder="Bạn đang nghĩ gì?" rows="4"></textarea>
            <button>Đăng</button>
          </div>

          {posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <div className="user-info">
                  <img src={post.avatar} alt={post.user} className="avatar" />
                  <span className="user-name">{post.user}</span>
                </div>
                <span className="post-time">{post.time}</span>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
              </div>

              <div className="post-actions">
                <button>
                  <i className="fa fa-thumbs-up"></i> Thích
                </button>
                <button>
                  <i className="fa fa-comment"></i> Bình luận
                </button>
                <button>
                  <i className="fa fa-share"></i> Chia sẻ
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 PTIT CONNECT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
