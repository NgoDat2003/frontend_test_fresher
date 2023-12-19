import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  notification,
  message,
} from "antd";
import "./register.scss";
import { callRegister } from "../../services/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Context = React.createContext({ name: "Default" });
function Register() {
  const navigate = useNavigate();

  const [loading, setloading] = useState(false);
  const onFinish = async (values) => {
    const { fullname, email, password, phone } = values;
    setloading(true);
    const res = await callRegister(fullname, email, password, phone);
    if (res && res.statusCode === 400) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 4,
      });
    } else {
      navigate("/login");

      message.success({
        content: "Đăng ký tài khoản thành công",
        duration: 4,
      });
    }
    setTimeout(() => {
      setloading(false);
    }, 2000);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="register_form">
      <h3>
        <b>Đăng ký người dùng mới</b>
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
          label="Fullname"
          name="fullname"
          rules={[{ required: true, message: "Please input your fullname!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
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
        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please input your phone!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
      <div className="form_footer">
        Bạn đã có tài khoản ?<Link to="/login">Đăng nhập</Link>
      </div>
    </div>
  );
}

export default Register;
