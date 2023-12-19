import { Button, Divider, Form, Input, message, notification } from "antd";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { callLogin } from "../../services/api";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";
function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const isAuthor = useSelector((state) => state.account.isAuthor);
  const onFinish = async (values) => {
    setloading(true);
    const { email, password } = values;
    const res = await callLogin(email, password);
    setloading(false);
    if (res && res.statusCode === 201) {
      message.success({ content: "Đăng nhập thành công", duration: 4 });
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(doLoginAction(res.data));
      navigate("/");
    } else {
      notification.error({
        message: "Thông tin đăng nhập không chính xác",
        duration: 4,
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login_form">
      <h3>
        <b>Đăng Nhập</b>
      </h3>
      <Divider />
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600, margin: "0 auto" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="User name"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <div className="form_footer">
        Bạn chưa có tài khoản ? <Link to="/register">Đăng ký</Link>
      </div>
    </div>
  );
}

export default LoginPage;
