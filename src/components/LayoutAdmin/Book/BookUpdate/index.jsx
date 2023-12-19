import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  callCreateBook,
  callListBookCategory,
  callUpdateBook,
  callUploadBookImg,
} from "../../../../services/api";
import { v4 as uuidv4 } from "uuid";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function BookCreate({ openUpdate, setOpenUpdate, dataBook, handleListBook }) {
  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [loadingThum, setLoadingThum] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [thumbNail, setThumbNail] = useState([]);
  const [slider, setSlider] = useState([]);
  const [initForm, setInitForm] = useState({});

  useEffect(() => {
    console.log("initForm", initForm);
    const imgThumbnail = [
      {
        uid: uuidv4(),
        name: dataBook.thumbnail,
        status: "done",
        url:
          import.meta.env.VITE_BASE_URL + "/images/book/" + dataBook.thumbnail,
      },
    ];
    const imgSlider = [];
    dataBook?.slider?.map((item) => {
      imgSlider.push({
        uid: uuidv4(),
        name: item,
        status: "done",
        url: import.meta.env.VITE_BASE_URL + "/images/book/" + item,
      });
    });
    const init = {
      author: dataBook.author,
      category: dataBook.category,
      createdAt: dataBook.createdAt,
      mainText: dataBook.mainText,
      price: dataBook.price,
      quantity: dataBook.quantity,
      sold: dataBook.sold,
      updatedAt: dataBook.updatedAt,
      __v: dataBook.__v,
      _id: dataBook._id,
      thumbnail: { fileList: imgThumbnail },
      slider: { fileList: imgSlider },
    };
    setThumbNail(imgThumbnail);
    setSlider(imgSlider);
    setInitForm(init);
    handleGetCategoryList();
    form.setFieldsValue(init);

    return () => {
      form.resetFields();
    };
  }, [dataBook]);
  const onFinish = async (values) => {
    const { _id, mainText, author, price, sold, quantity, category } = values;
    let thumb = thumbNail[0].name;
    let sliderCall = slider.map((item) => item.name);
    setloading(true);
    const res = await callUpdateBook(
      _id,
      thumb,
      sliderCall,
      mainText,
      author,
      price,
      sold,
      quantity,
      category
    );
    if (res && res.statusCode === 400) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 4,
      });
    } else {
      message.success({
        content: "Cập nhật sách thành công",
        duration: 4,
      });
      setOpenUpdate(false);
      handleReset();
      handleListBook();
    }
    setloading(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoadingThum(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoadingThum(false);
        setImageUrl(url);
      });
    }
  };
  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    let res = await callUploadBookImg(file);
    if (res && res.statusCode === 201) {
      setThumbNail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("Thành công");
    } else {
      onError("Thất bại");
    }
  };
  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    let res = await callUploadBookImg(file);
    if (res && res.statusCode === 201) {
      setSlider((prev) => [
        ...prev,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("Thành công");
    } else {
      onError("Thất bại");
    }
  };
  const handleGetCategoryList = async () => {
    let res = await callListBookCategory();
    if (res && res.statusCode === 200) {
      const list = [];
      res.data.map((item) => {
        list.push({ value: item, lable: item });
      });
      setCategory(list);
    }
  };
  const handlePreview = async (file) => {
    console.log(file.url);
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };
  const hanleRemoviFile = (file, type) => {
    if (type === "thumnail") {
      setThumbNail([]);
    }
    if (type === "slider") {
      const value = slider.filter((item) => item.uid !== file.uid);
      setSlider(value);
    }
  };
  const handleCancel = () => setPreviewOpen(false);
  const handleReset = () => {
    form.resetFields();
    setThumbNail([]);
    setSlider([]);
  };
  return (
    <>
      <Modal
        title="Cập nhật sách"
        open={openUpdate}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => {
          setOpenUpdate(false), handleReset();
        }}
        width={"40vw"}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Form.Item hidden label="id" name="_id">
              <Input />
            </Form.Item>
            <Col span={12}>
              <Form.Item
                label="Tên sách"
                name="mainText"
                rules={[
                  { required: true, message: "Không được để trống tên sách" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tác giả"
                name="author"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tên tác giả",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Giá tiền"
                name="price"
                rules={[
                  { required: true, message: "Không được để trống giá tiền" },
                ]}
              >
                <InputNumber
                  addonAfter="VND"
                  formatter={(value) => new Intl.NumberFormat().format(value)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Thể loại"
                name="category"
                rules={[
                  { required: true, message: "Không được để trống giá tiền" },
                ]}
              >
                <Select
                  initialValues="lucy"
                  showSearch
                  style={{ width: "100%" }}
                  // onChange={handleChange}
                  options={category}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[
                  { required: true, message: "Không được để trống số lượng" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Đã bán"
                name="sold"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống số lượng đã bán",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="thumbnail"
                label="Ảnh Thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống",
                  },
                ]}
              >
                <Upload
                  multiple={false}
                  maxCount={1}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  customRequest={handleUploadFileThumbnail}
                  onPreview={handlePreview}
                  onRemove={(file) => hanleRemoviFile(file, "thumbnail")}
                  defaultFileList={initForm?.thumbnail?.fileList ?? []}
                >
                  <div>
                    {loadingThum ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slider"
                label="Ảnh Slider"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống",
                  },
                ]}
              >
                <Upload
                  multiple
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  customRequest={handleUploadFileSlider}
                  onChange={(info) => handleChange(info, "slider")}
                  onPreview={handlePreview}
                  onRemove={(file) => hanleRemoviFile(file, "slider")}
                  defaultFileList={initForm?.slider?.fileList ?? []}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Form>
      </Modal>
    </>
  );
}

export default BookCreate;
