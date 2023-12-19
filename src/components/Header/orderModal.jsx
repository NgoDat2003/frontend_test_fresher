import { Col, Image, Row } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function OrderModal() {
  const orderList = useSelector((state) => state.order.carts);
  const navigate = useNavigate()
  return (
    <Row style={{ width: "20vw", gap: "1rem" }}>
      {orderList &&
        orderList.length > 0 &&
        orderList.map((item, index) => {
          return (
            <Col span={24} style={{ height: "60px" }} key={"index-" + index}>
              <Row
                style={{ alignItems: "start", justifyContent: "space-around" }}
              >
                <Col span={4}>
                  <Image
                    src={
                      import.meta.env.VITE_BASE_URL +
                      "/images/book/" +
                      item.details.thumbnail
                    }
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col span={14} style={{ padding: "0 4px 0 16px" }}>
                  {item.details.mainText}
                </Col>
                <Col span={6}>
                  {item.details.price.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Col>
              </Row>
            </Col>
          );
        })}
      <Col offset={14}>
        <button
          style={{
            color: "#fff",
            position: "relative",
            overflow: "visible",
            outline: "0",
            background: "#ee4d2d",
            height: "40px",
            padding: "0 20px",
            cursor: "pointer",
            outline: "none",
            border: "none",
            width: "140px",
            cursor: "pointer",
          }}
          onClick={()=>navigate('/order')}
        >
          Xem Giỏ Hàng
        </button>
      </Col>
    </Row>
  );
}

export default OrderModal;
