import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
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
              <Link to="/profile">
                <i className="fas fa-user"></i>
              </Link>
            </li>
            <li>
              <Link to="/messages">
                <i className="fas fa-envelope"></i>
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <i className="fas fa-cog"></i>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
