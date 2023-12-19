import {
  Divider,
  Form,
  Input,
  Modal,
  Table,
  Upload,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { importUser } from "../../../../services/api";
import template from "./template.xlsx?url";
function UserImport({ openImport, setOpenImport, handleListUser }) {
  const [loading, setLoading] = useState(false);
  const { Dragger } = Upload;
  const [json, setJson] = useState([]);
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  const columns = [
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
  ];

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    // action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        const file = info.fileList[0].originFileObj;
        message.success(`${info.file.name} file uploaded successfully.`);
        let reader = new FileReader();

        reader.onload = function (e) {
          let data = new Uint8Array(e.target.result);
          let workbook = XLSX.read(data, { type: "array" });
          // find the name of your sheet in the workbook first
          let worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // convert to json format
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: ["fullName", "email", "phone"],
            range: 1,
          });
          if (jsonData && jsonData.length > 0) {
            setJson(jsonData);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const onImport = async () => {
    const data = json.map((item) => {
      item.password = "123456";
      return item;
    });
    console.log(data);
    let res = await importUser(data);
    console.log(res);
    if (res && res.data) {
      notification.success({
        description: `Success: ${res.data.countSuccess}, Error:${res.data.countError}`,
        message: "Upload thành công",
      });
      setJson([]);
      handleListUser();
      setOpenImport(false);
    } else {
      notification.success({
        description: res.message,
        message: "Upload thất bại",
      });
    }
  };
  return (
    <Modal
      title="Import data user"
      open={openImport}
      onOk={onImport}
      confirmLoading={loading}
      onCancel={() => {
        setOpenImport(false);
        setJson([]);
      }}
      okText="Import Data"
      style={{ width: "50vw" }}
      okButtonProps={{ disabled: json.length < 1 }}
      maskClosable={false}
    >
      <Dragger {...propsUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
          <a href={template} download onClick={(e) => e.stopPropagation()}>
            Download example file
          </a>
        </p>
      </Dragger>
      <Divider />
      <div>Dữ liệu upload:</div>
      <Table columns={columns} dataSource={json} />
    </Modal>
  );
}

export default UserImport;
