import { Col, Row, Space, Table, Tag } from "antd";
import { useSelector } from "react-redux";
import { callHistoryOrder } from "../../services/api";
import { useEffect, useState } from "react";
import ReactJson from 'react-json-view'
import moment from "moment/moment";

function History() {
  const user = useSelector(state=>state.account.user)
  const [data, setdata] = useState([]);
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Tổng số tiền",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: () => <Tag color={"green"}>{"Thành công"}</Tag>,
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
      key: "description",
    },
  ];
  console.log(new Date('7/10/2013 20:12:34').toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"))
  const handleGetDes = async ()=>{
    console.log(1);
    if(user){
      let res = await callHistoryOrder()
      console.log(res);
      if(res && res.statusCode===200){
        let chiTiet = res.data.map((item,index)=>{
          return {
            stt:index,
            time: moment(new Date(item.createdAt)).format("DD-MM-YYYY HH:mm:ss A"),
            total:new Intl.NumberFormat().format(item.totalPrice)+ " đ",
            description:<ReactJson displayObjectSize={false} enableClipboard={false} displayDataTypes={false} src={item.detail} name="Chi Tiết Đơn Mua" />
          }
        })
        setdata(chiTiet)
      }
    }
  }
  useEffect(() => {
    handleGetDes()
  }, []);
  return (
    <div className="container">
      <Row gutter={1}>
        <Col span={24}>
          <h3>Lịch sử đặt hàng</h3>
          <Table columns={columns} dataSource={data} />;
        </Col>
        <Col span={24}></Col>
      </Row>
    </div>
  );
}

export default History;
