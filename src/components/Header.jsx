import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css"; // Tạo file CSS riêng cho Header

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/home">PTIT CONNECT</Link>
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
              <Link to="/home">
                <i className="fa fa-home"></i>
              </Link>
            </li>
            <li>
              <Link to="/friends">
                <i className="fa fa-users"></i>
              </Link>
            </li>
            <li>
              <Link to="/messenger">
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
  );
};

export default Header;
