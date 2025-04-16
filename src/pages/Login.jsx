import LoginBox from "../components/form/LoginBox";

function Login() {
  return (
    <div className="wrap">
      <div className="box">
        <h2 className="title">Đăng nhập</h2>
        <LoginBox />
        <p className="link">
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
