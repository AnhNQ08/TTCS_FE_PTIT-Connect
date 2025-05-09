import { useState } from "react";
import { login } from "../api/authentication";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = document.getElementById("username-input").value;
      const password = document.getElementById("password-input").value;
      const res = await login(username, password);
      alert("Đăng nhập thành công!\nToken: " + res.data.token);
      setError("");

      navigate("/home");
    } catch (err) {
      setError(err);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1 className="fb-logo">PTIT CONNECT</h1>
        <p>
          PTIT CONNECT giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống
          của bạn.
        </p>
      </div>

      <div className="login-right">
        <form className="login-box" onSubmit={handleSubmit}>
          <input
            id="username-input"
            type="text"
            name="username"
            placeholder="Email hoặc số điện thoại"
            required
          />
          <input
            id="password-input"
            type="password"
            name="password"
            placeholder="Mật khẩu"
            required
          />
          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
          {error && <p className="error">{error}</p>}
          <a href="#" className="forgot" onClick={handleForgotPassword}>
            Quên mật khẩu?
          </a>
          <hr />
          <button
            type="button"
            className="register-btn"
            onClick={handleRegister}
          >
            Tạo tài khoản mới
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;