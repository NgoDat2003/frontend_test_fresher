import { Button, Col, Modal, Row, Tabs } from "antd";
import UpdateInfo from "./updateInfo";
import UpdatePassword from "./updatePassword";

function ManageUser({ isModalOpen, setIsModalOpen }) {
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const modalFooter = [
    <Button key="cancel" style={{ display: "none" }}>
      Cancel
    </Button>,
    <Button key="ok" type="primary" style={{ display: "none" }}>
      OK
    </Button>,
  ];
  const items = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: <UpdateInfo isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />,
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: <UpdatePassword />,
    },
  ];
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <Modal
      title="Quản lý tài khoản"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={modalFooter}
      width={"50vw"}
    >
      <Row>
        <Col span={24}>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Col>
      </Row>
    </Modal>
  );
}

export default ManageUser;
