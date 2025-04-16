import RegBox from "../components/form/RegBox";

function Register() {
  return (
    <div className="wrap">
      <div className="box">
        <h2 className="title">Đăng ký</h2>
        <RegBox />
        <p className="link">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
