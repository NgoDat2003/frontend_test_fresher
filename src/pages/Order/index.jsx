import { Table } from "antd";
import { useEffect, useState } from "react";
import { callListOrder } from "../../services/api";
import moment from "moment";

function Order() {
  const [current, setcurrent] = useState(1);
  const [listOrder, setListOrder] = useState([]);
  const [pageSize, setpageSize] = useState(2);
  const [total, settotal] = useState(0);
  const [query, setquery] = useState("");
  const [sort, setsort] = useState("&sort=-updatedAt");
  const handleListOrder = async () => {
    let queryApi = `/api/v1/order?current=${current}&pageSize=${pageSize}${sort}`;
    if (query) {
      queryApi += query;
    }

    let res = await callListOrder(queryApi);
    console.log(res);
    if (res && res.statusCode === 200) {
      setListOrder(res.data.result);
      settotal(res.data.meta.total);
    }
  };
  useEffect(() => {
    handleListOrder();
  }, [current, pageSize, sort]);
  const columns = [
    {
      title: "id",
      dataIndex: "_id",
      render: function (text, record, index) {
        return (
          <a
          // onClick={() => {
          //   setOpen(true);
          //   setuserDescription(record);
          // }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
      sorter: true,
      render: function (text, record, index) {
        return (
          <div>
            {text.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: true,
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      render: function (text, record, index) {
        return <div>{moment(text).format("YYYY-MM-DD, HH:mm:ss")}</div>;
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
  return (
    <>
      <h3 style={{textAlign:"left",marginBottom:"1rem"}}>Table List Order</h3>
      <Table
        columns={columns}
        dataSource={listOrder}
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
    </>
  );
}

export default Order;
