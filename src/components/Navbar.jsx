import React from "react";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">PTIT Connect</div>
      <input className="search" type="text" placeholder="Tìm kiếm..." />
      <button className="logout">Đăng xuất</button>
    </div>
  );
};

export default Navbar;
