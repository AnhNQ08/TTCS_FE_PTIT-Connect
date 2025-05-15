import React from "react";
import "../styles/Notification.css";
import Header from "../components/Header";
const NotificationBox = () => {
  return (
    <div className="notification-box">
      <p>Đây là một thông báo.</p>
    </div>
  );
};

const NotificationPage = () => {
  return (
    <div className="notification-container">
      <Header />
      <h2 className="screen-name">Thông báo</h2>
      <NotificationBox />
    </div>
  );
};

export default NotificationPage;
