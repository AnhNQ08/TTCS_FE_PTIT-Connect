import { useState } from "react";
import { login } from "../services/authentication";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/userAPI";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Vui lòng nhập đúng định dạng email!");
      return;
    }

    try {
      const response = await login(email, password);

      if (response.message === "User not found!") {
        setError("Tài khoản không tồn tại. Vui lòng kiểm tra lại!");
      } else if (response.message === "Wrong password!") {
        setError("Sai mật khẩu. Vui lòng kiểm tra lại!");
      } else if (response.message === "User login successfully!") {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        const dataCurrentUser = await getCurrentUser();
        localStorage.setItem("myID", dataCurrentUser.id.toString());
        localStorage.setItem(
          "dataCurrentUser",
          JSON.stringify(dataCurrentUser)
        );

        setError("");
        alert("Đăng nhập thành công!");
        navigate("/home");
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
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
            type="text"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
}

export default Login;
