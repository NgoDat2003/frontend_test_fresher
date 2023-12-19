import { Button, Col, Form, Input, Row, message, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callUpdatePassword } from "../../services/api";

function UpdatePassword() {
  const user = useSelector((state) => state.account.user);
  const onFinish = (values) => {
    handleUpdatePassword(values.email,values.oldPass,values.newPass)
  };
  const handleUpdatePassword = async (email,oldPass,newPass)=>{
    let res = await callUpdatePassword(email,oldPass,newPass)
    console.log(res);
    if(res && res.statusCode===201){
        message.success("Cập nhật mật khẩu thành công")
        form.setFieldValue("odlPass","")
        form.setFieldValue("newPass","")
    }else{
        notification.error({
            message:"Cập nhật mật khẩu thất bại",
            description:res.message
        })
    }
  }
  const [form] = useForm();
  useEffect(() => {
    form.setFieldValue("email",user.email)
  }, []);
  return (
    <Row>
      <Col span={24}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPass"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPass"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => form.submit()}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default UpdatePassword;
