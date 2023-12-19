import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row, Upload, message,Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callUpdateInfo, callUploadAvatar } from "../../services/api";
import { useForm } from "antd/es/form/Form";
import { doUpdateAction } from "../../redux/account/accountSlice";
function UpdateInfo({isModalOpen, setIsModalOpen}) {
  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch()
  const onFinish = (values) => {
    handleUpdateInfo(values.fullName,values.phone)
  };
  
  const [form] = useForm();
  const [imageUrl, setImageUrl] = useState("");
  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
    }
    if (info.file.status === "done") {
      message.success("Upload thành công");
    }
    if (info.file.status === "error") {
      message.error("Upload thất bại");
    }
  };
  useEffect(() => {
    setImageUrl(user.avatar);
    const info = {
        email:user.email,
        fullName:user.fullName,
        phone:user.phone
    }
    form.setFieldsValue(info)
  }, []);
  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    let res = await callUploadAvatar(file);
    console.log(res);
    if (res && res.statusCode === 201) {
      setImageUrl(res.data.fileUploaded);
      onSuccess("Thành công");
    } else {
      onError("Thất bại");
    }
  };
  const handleUpdateInfo = async (name,phone)=>{
    let res = await callUpdateInfo(user.id,name,phone,imageUrl)
    console.log(res);
    let info = {...user,fullName:name,phone:phone,avatar:imageUrl}

    
    if(res && res.statusCode===200){
        dispatch(doUpdateAction(info))
    }
  }
  return (
    <Row>
      <Col span={12} style={{display:"flex",flexDirection:"column", alignItems:"center",justifyContent:"center"}}>
        <Avatar
          size={200}
          icon={<UserOutlined />}
          src={
            imageUrl
              ? import.meta.env.VITE_BASE_URL + "/images/avatar/" + imageUrl
              : ""
          }
        />
        <Upload
          maxCount={1}
          multiple={false}
          showUploadList={false}
          onChange={handleChange}
          customRequest={handleUploadAvatar}
        >
          <Button icon={<UploadOutlined />} style={{ marginTop: "10px" }}>
            Upload Avatar
          </Button>
        </Upload>
      </Col>
      <Col span={12}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Tên Hiển Thị"
            name="fullName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số Điện Thoại"
            name="phone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={()=>form.submit()}>Cập nhật</Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default UpdateInfo;
