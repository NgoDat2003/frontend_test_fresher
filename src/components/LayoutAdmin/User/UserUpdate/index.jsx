import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { updateUser } from "../../../../services/api";

function UserUpdate({ openUpdate, setOpenUpdate, dataUser,handleListUser }) {
  const [form] = useForm();
  const handleCancel = () => {
    setOpenUpdate(false);
  };
  const onFinish = async ({_id,fullName,phone}) => {
    let res = await updateUser(_id,fullName,phone)
    console.log(res);
    if(res && res.statusCode===200){
      notification.success({
        message:"Update thành công",
      })
      handleCancel()
      handleListUser()
    }else{
      notification.error({
        message:"Update thất bại"
      })
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    form.setFieldsValue(dataUser);
  }, [dataUser]);
  console.log(dataUser);
  return (
    <>
      <Modal
        title="Cập nhật người dùng"
        open={openUpdate}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item hidden label="_id" name="_id">
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên Hiển Thị"
            name="fullName"
            rules={[{ required: true, message: "Please input your fullname!" }]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Số Điện Thoại"
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

export default UserUpdate;
