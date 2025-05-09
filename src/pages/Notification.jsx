import React from "react";
import "../styles/Notification.css"; // Import file CSS
import Header from "../components/Header"; // Đảm bảo đường dẫn chính xác
// import NotificationBox from '../components/NotificationBox'; // Bạn cần tạo component này

// Giả sử bạn cần tạo component NotificationBox
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
      {/* thêm các NotificationBox khác */}
    </div>
  );
};

export default NotificationPage;
