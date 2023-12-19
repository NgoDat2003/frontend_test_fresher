import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { callGetDashboard } from "../../services/api";
function AdminPages() {
  const [countOrder, setCountOrder] = useState(0);
  const [countUser, setCountUser] = useState(0);
  useEffect(()=>{
    handleDashboard()
  },[])
  const handleDashboard = async ()=>{
    let res = await callGetDashboard()
    console.log(res);
    if(res && res.statusCode===200){
      setCountOrder(res.data.countOrder)
      setCountUser(res.data.countUser)
    }
  }
  const formatter = (value) => <CountUp end={value} separator="," />;
  return (
    <div>
      <Row>
        <Col span={10}>
          <Card title="Tổng user" bordered={true}>
            <Statistic
              value={countOrder}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col offset={2} span={10}>
          <Card title="Tổng Đơn Hàng" bordered={false}>
            <Statistic
              value={countUser}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminPages;
