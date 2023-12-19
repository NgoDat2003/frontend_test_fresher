import { Form, Input, Modal, message, notification } from "antd";
import { useState } from "react";
import { createUser } from "../../../../services/api";

function UserCreateLayout({ openModal, setOpenModal,handleListUser }) {
  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  //   const handleOk = () => {
  //     setConfirmLoading(true);
  //     setTimeout(() => {
  //       setOpenModal(false);
  //       setConfirmLoading(false);
  //     }, 2000);
  //   };
  const onFinish = async (values) => {
    const { fullname, email, password, phone } = values;
    setloading(true);
    const res = await createUser(fullname, email, password, phone);
    if (res && res.statusCode === 400) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 4,
      });
    } else {
    //   navigate("/login");

      message.success({
        content: "Tạo tài khoản thành công",
        duration: 4,
      });
      setOpenModal(false)
      form.resetFields()
      handleListUser()
    }
    setloading(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={openModal}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={()=>setOpenModal(false)}
      >
        <Form
          form={form}
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
        </Form>
      </Modal>
    </>
  );
}

export default UserCreateLayout;
