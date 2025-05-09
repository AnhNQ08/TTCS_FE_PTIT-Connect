import React, { useState } from "react";
import "../styles/SignUp.css"; // Import CSS for styling

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async () => {
    try {
      //  Logic đăng ký (cần được điều chỉnh cho phù hợp với ReactJS và API của bạn)
      console.log("Đăng ký với:", { username, password, name });
      alert("Vui lòng hoàn thành logic đăng ký để kết nối với backend");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
    }
  };

  return (
    <div className="container">
      {/* Logo  */}
      <img src="/logo.png" alt="Logo" className="logo" />{" "}
      {/* giả sử bạn có logo.png trong thư mục public */}
      <h1 className="title">Tạo tài khoản mới</h1>
      <input
        type="text"
        placeholder="Tên người dùng"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        secureTextEntry={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <button onClick={handleSignUp} className="button">
        Đăng ký
      </button>
    </div>
  );
};

export default SignUpPage;
