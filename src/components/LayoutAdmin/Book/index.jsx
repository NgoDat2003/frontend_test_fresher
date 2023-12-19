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
import { callDeleteBook, callListBook, callListUser, deleteUser } from "../../../services/api";
import { CiImport } from "react-icons/ci";
import { PiExportBold, PiPencilLineBold } from "react-icons/pi";
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { DeleteTwoTone } from "@ant-design/icons";
import * as XLSX from "xlsx";
import moment from "moment";
import BookDescription from "./BookDescription";
import BookCreate from "./BookCreate";
import BookUpdate from "./BookUpdate";
function BookPages() {
  const [ListBook, setListBook] = useState([]);
  const [current, setcurrent] = useState(1);
  const [pageSize, setpageSize] = useState(2);
  const [total, settotal] = useState(0);
  const [query, setquery] = useState("");
  const [sort, setsort] = useState("&sort=-updatedAt");
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [bookUpdate, setBookUpdate] = useState({});
  const [openUpdate, setOpenUpdate] = useState(false);
  const [userDescription, setuserDescription] = useState({});
  const handleListBook = async () => {
    let queryApi = `/api/v1/book?current=${current}&pageSize=${pageSize}${sort}`;
    if (query) {
      queryApi += query;
    }

    let res = await callListBook(queryApi);
    if (res && res.statusCode === 200) {
      setListBook(res.data.result);
      settotal(res.data.meta.total);
    }
  };
  const handleDeleteBook = async (id) => {
    let res = await callDeleteBook(id);
    if (res && res.statusCode === 200) {
      notification.success({
        message: "Delete thành công",
      });
      handleListBook();
    } else {
      notification.error({
        message: "Delete thất bại",
      });
    }
  };
  useEffect(() => {
    handleListBook();
  }, [current, pageSize, sort]);
  const handleReloadUser = () => {
    setquery("");
    setsort("sort=-updatedAt");
    setcurrent(1);
    setpageSize(2);
  };
  useEffect(() => {
    if (current === 1) {
      handleListBook();
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
      title: "Tên Sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể Loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
      render: function (text, record, index) {
        return (
          <div>
            {record.price.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        );
      },
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      render: function (text, record, index) {
        return (
          <div>
            {moment(userDescription.createdAt).format("YYYY-MM-DD, HH:mm:ss")}
          </div>
        );
      },
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
              onConfirm={() => handleDeleteBook(record._id)}
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
                setOpenUpdate(true), setBookUpdate(record);
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
    if (sorter && sorter.order === "descend") {
      setsort(`&sort=-${sorter.field}`);
    }
    if (sorter && sorter.order === "ascend") {
      setsort(`&sort=${sorter.field}`);
    }
  };

  //   lọc filter
  const onFinish = (values) => {
    let queryApi = ``;
    if (values.mainText && values.mainText !== "") {
      queryApi += `&mainText=/${values.mainText}/i`;
    }
    if (values.author) {
      queryApi += `&author=/${values.author}/i`;
    }
    if (values.category) {
      queryApi += `&category=/${values.category}/i`;
    }
    if (queryApi !== "") {
      setquery(queryApi);
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  const exportEcel = () => {
    if (ListBook.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(ListBook);
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
            <Form.Item label="Tên sách" name="mainText">
              <Input placeholder="input placeholder" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Tác giả" name="author">
              <Input placeholder="input placeholder" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Thể loại" name="category">
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
          dataSource={ListBook}
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

      <BookDescription
        userDescription={userDescription}
        open={open}
        onClose={onClose}
      />
      <BookCreate
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleListBook={handleListBook}
      />

      <BookUpdate
        openUpdate={openUpdate}
        setOpenUpdate={setOpenUpdate}
        dataBook={bookUpdate}
        handleListBook={handleListBook}
      />
    </>
  );
}
export default BookPages;
