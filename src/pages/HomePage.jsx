import React from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";

const HomePage = () => {
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
          <div className="post">
            <div className="post-header">
              <div className="user-info">
                <img src="src/assets/user.jpg" alt="User" className="avatar" />
                <span className="user-name">Nguyễn Quang Anh</span>
              </div>
              <span className="post-time">2 giờ trước</span>
            </div>
            <div className="post-content">
              <p>Đây là bài viết của tôi!</p>
              <textarea name="" id=""></textarea>
            </div>
            <div className="post-actions">
              <button>Thích</button>
              <button>Bình luận</button>
              <button>Chia sẻ</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 PTIT CONNECT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
