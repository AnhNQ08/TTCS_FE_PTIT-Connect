import { useState } from "react";
import "../styles/forgotpassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setMessage("Email không hợp lệ!");
    } else {
      setMessage("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1 className="fb-logo">PTIT CONNECT</h1>
        <p>Chúng tôi sẽ giúp bạn lấy lại quyền truy cập tài khoản.</p>
      </div>

      <div className="login-right">
        <form className="login-box" onSubmit={handleReset}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Quên mật khẩu
          </h2>
          <input
            type="email"
            placeholder="Nhập email bạn đã đăng ký"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Gửi liên kết đặt lại
          </button>
          {message && <p className="error">{message}</p>}
          <a href="/login" className="forgot">
            Quay lại trang đăng nhập
          </a>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
