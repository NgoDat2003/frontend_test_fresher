import { Badge, Descriptions, Divider, Drawer } from "antd";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { v4 as uuidv4 } from "uuid";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
function BookDescription({ userDescription, onClose, open }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    let imgThumbnail = {},
      imgSlider = [];
    if (userDescription.thumbnail) {
      imgThumbnail = {
        uid: uuidv4(),
        name: userDescription.thumbnail,
        status: "done",
        url: import.meta.env.VITE_BASE_URL+'/images/book/'+userDescription.thumbnail,
      };
    }
    if (userDescription.slider) {
      userDescription.slider.map((item) => {
        imgSlider.push({
          uid: uuidv4(),
          name: item,
          status: "done",
          url: import.meta.env.VITE_BASE_URL+'/images/book/'+item,
        });
      });
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [userDescription]);
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <Drawer
      title="Thông tin chi tiết"
      onClose={onClose}
      open={open}
      width={"50vw"}
    >
      <Descriptions title="Thông tin user" bordered column={2}>
        <Descriptions.Item label="ID">{userDescription._id}</Descriptions.Item>
        <Descriptions.Item label="Tên sách">
          {userDescription.mainText}
        </Descriptions.Item>
        <Descriptions.Item label="Tác giả">
          {userDescription.author}
        </Descriptions.Item>
        <Descriptions.Item label="Giá tiển">
          {userDescription &&
            userDescription.price &&
            userDescription.price.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
        </Descriptions.Item>
        <Descriptions.Item label="Thể loại" span={2}>
          <Badge status="processing" text={userDescription.category} />
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {moment(userDescription.createdAt).format("YYYY-MM-DD, HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="Update At">
          {moment(userDescription.updatedAt).format("YYYY-MM-DD, HH:mm:ss")}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left">Ảnh books</Divider>
      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        showUploadList={{ showRemoveIcon: false }}
      ></Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Drawer>
  );
}

export default BookDescription;
