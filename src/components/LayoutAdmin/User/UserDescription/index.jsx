import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment/moment";
function UserDescription({ userDescription, onClose, open }) {
  return (
    <Drawer
      title="Thông tin chi tiết"
      onClose={onClose}
      open={open}
      width={"50vw"}
    >
      <Descriptions title="Thông tin user" bordered column={2}>
        <Descriptions.Item label="ID">{userDescription._id}</Descriptions.Item>
        <Descriptions.Item label="Tên hiển thị">
          {userDescription.fullName}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {userDescription.email}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {userDescription.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Role" span={2}>
          <Badge status="processing" text={userDescription.role} />
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {moment(userDescription.createdAt).format('YYYY-MM-DD, HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="Update At">
          {moment(userDescription.updatedAt).format('YYYY-MM-DD, HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
}

export default UserDescription;
