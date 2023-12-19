import {
  Divider,
  Drawer,
  Popconfirm,
  Popover,
  Table,
  notification,
  theme,
} from "antd";
import { Button, Form, Input, Radio } from "antd";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { callListUser, deleteUser } from "../../../services/api";
import "./User.scss";
import { CiImport } from "react-icons/ci";
import { PiExportBold, PiPencilLineBold } from "react-icons/pi";
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineFolderAdd } from "react-icons/ai";
import UserDescription from "./UserDescription";
import { DeleteTwoTone } from "@ant-design/icons";
import UserCreateLayout from "./UserCreateLayout";
import UserImport from "./UserImport";
import * as XLSX from "xlsx";
import UserUpdate from "./UserUpdate";
function User() {
  const [listUser, setlistUser] = useState([]);
  const [current, setcurrent] = useState(1);
  const [pageSize, setpageSize] = useState(2);
  const [total, settotal] = useState(0);
  const [query, setquery] = useState("");
  const [sort, setsort] = useState("");
  const [fieldName, setfieldName] = useState("");
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [userUpdate, setUserUpdate] = useState({});
  const [openUpdate, setOpenUpdate] = useState(false);
  const [userDescription, setuserDescription] = useState({});
  const handleListUser = async () => {
    let queryApi = `/api/v1/user?current=${current}&pageSize=${pageSize}`;
    if (query) {
      queryApi += query;
    }
    if (sort === "descend") {
      queryApi += `&sort=-${fieldName}`;
    }
    if (sort === "ascend") {
      queryApi += `&sort=${fieldName}`;
    }
    let res = await callListUser(queryApi);
    if (res && res.statusCode === 200) {
      setlistUser(res.data.result);
      settotal(res.data.meta.total);
    }
  };
  const handleDeleteUser = async (id) => {
    let res = await deleteUser(id);
    if (res && res.statusCode === 200) {
      notification.success({
        message: "Delete thành công",
      });
      handleListUser();
    } else {
      notification.error({
        message: "Delete thất bại",
      });
    }
  };
  useEffect(() => {
    handleListUser();
  }, [current, pageSize, sort, fieldName]);
  const handleReloadUser = () => {
    setquery("");
    setsort("");
    setfieldName("");
    setcurrent(1);
    setpageSize(2);
  };
  useEffect(() => {
    if (current === 1) {
      handleListUser();
    } else {
      setcurrent(1);
    }
  }, [query]);
  const columns = [
    {
      title: "id",
      dataIndex: "_id",
      render: function (text, record, index) {
        return (
          <a
            onClick={() => {
              setOpen(true);
              setuserDescription(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Actions",
      render: function (text, record, index) {
        return (
          <div style={{ display: "flex" }}>
            <Popconfirm
            placement="left"
              title="Delete the task"
              description="Are you sure to delete this task?"
              okText="Yes"
              cancelText="No"
              onConfirm={()=>handleDeleteUser(record._id)}
            >
              <DeleteTwoTone
                style={{
                  cursor: "pointer",
                  fontSize: 16,
                  textAlign: "center",
                  width: "100%",
                }}
              />
            </Popconfirm>

            <PiPencilLineBold
              onClick={() => {
                setOpenUpdate(true), setUserUpdate(record);
              }}
              style={{
                cursor: "pointer",
                fontSize: 16,
                textAlign: "center",
                width: "100%",
                color: "#1890ff",
              }}
            />
          </div>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.pageSize !== pageSize) {
      setpageSize(pagination.pageSize);
      setcurrent(1);
    }
    if (pagination && pagination.current !== current) {
      setcurrent(pagination.current);
    }
    if (sorter) {
      setfieldName(sorter.field);
      setsort(sorter.order);
    }
  };

  const onFinish = (values) => {
    let queryApi = ``;
    if (values.fullName) {
      queryApi += `&fullName=/${values.fullName}/i`;
    }
    if (values.email) {
      queryApi += `&email=/${values.email}/i`;
    }
    if (values.phone) {
      queryApi += `&phone=/${values.phone}/i`;
    }
    if (queryApi !== "") {
      setquery(queryApi);
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  const exportEcel = () => {
    if (listUser.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workbook, "DataSheet.xlsx");
    }
  };
  return (
    <>
      <Form layout="inline" onFinish={onFinish}>
        <Row style={{ width: "100%" }}>
          <Col span={8}>
            <Form.Item label="Name" name="fullName">
              <Input placeholder="input placeholder" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Email" name="email">
              <Input placeholder="input placeholder" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Số Điện thoại" name="phone">
              <Input placeholder="input placeholder" />
            </Form.Item>
          </Col>
          <Col className="form_btn-col" span={8} offset={16}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="form_btn-left"
              >
                Submit
              </Button>
              <Button htmlType="reset">Reset</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      <div className="table_user">
        <div className="table_header">
          <Row>
            <Col span={3}>
              <h3>Table list user</h3>
            </Col>
            <Col span={11} offset={10} className="table_header_button">
              <Button type="primary" onClick={() => setOpenImport(true)}>
                <CiImport />
                import
              </Button>
              <Button type="primary" onClick={() => exportEcel()}>
                <PiExportBold />
                export
              </Button>
              <Button type="primary" onClick={() => setOpenModal(true)}>
                <AiOutlineFolderAdd /> Thêm mới
              </Button>
              <Button
                style={{ border: "none" }}
                onClick={() => handleReloadUser()}
              >
                <GrPowerReset />
              </Button>
            </Col>
          </Row>
        </div>
        <Table
          columns={columns}
          dataSource={listUser}
          onChange={onChange}
          pagination={{
            current: current,
            showSizeChanger: true,
            total: total,
            pageSize: pageSize,
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]} - {range[1]} trên tổng số {total}
                </div>
              );
            },
          }}
        />
      </div>

      <UserDescription
        userDescription={userDescription}
        open={open}
        onClose={onClose}
      />
      <UserCreateLayout
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleListUser={handleListUser}
      />
      <UserImport
        openImport={openImport}
        setOpenImport={setOpenImport}
        handleListUser={handleListUser}
      />
      <UserUpdate
        openUpdate={openUpdate}
        setOpenUpdate={setOpenUpdate}
        dataUser={userUpdate}
        handleListUser={handleListUser}
      />
    </>
  );
}

export default User;
