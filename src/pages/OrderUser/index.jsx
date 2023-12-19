import {
  Button,
  Col,
  Divider,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Radio,
  Result,
  Row,
  Steps,
  message,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./OrderUser.scss";
import { MdAutoDelete } from "react-icons/md";
import {
  doAddOrderAction,
  doDeleteOrderAction,
  doRefeshOrder,
  doUpdateOrderAction,
} from "../../redux/order/orderSlice";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { callCreateOrder } from "../../services/api";
import { useNavigate } from "react-router-dom";
function OrderUser() {
  const orderList = useSelector((state) => state.order.carts);
  const dispatch = useDispatch();
  const [tongTien, settongTien] = useState(0);
  const [current, setcurrent] = useState(1);
  const [form] = useForm();
  useEffect(() => {
    let tien = 0;
    orderList.map((item, index) => {
      return (tien += item.quantity * item.details.price);
    });
    settongTien(tien * 1.0);
  }, [orderList]);
  return (
    <div className="container" style={{ minHeight: "80vh" }}>
      <Row gutter={3}>
        <Col
          span={24}
          style={{
            backgroundColor: "#fff",
            marginBottom: "1rem",
            padding: "1rem",
          }}
        >
          <Steps
            current={current}
            items={[
              {
                title: "Đơn hàng",
              },
              {
                title: "Đặt hàng",
              },
              {
                title: "Thanh Toán",
              },
            ]}
          />
        </Col>
        {orderList.length > 0 ? (
          <Col
            sm={24}
            md={
              current === 1 ? 18 : current === 2 ? 16 : current === 3 ? 0 : 24
            }
          >
            <Row style={{ gap: "1rem" }} gutter={2}>
              {orderList &&
                orderList.length > 0 &&
                orderList.map((item, index) => {
                  return (
                    <Col
                      span={24}
                      style={{ backgroundColor: "#fff", padding: "8px" }}
                      key={"index-" + index}
                    >
                      <Row
                        style={{
                          alignItems: "center",
                          justifyContent: "space-around",
                        }}
                      >
                        <Col span={2} style={{ textAlign: "center" }}>
                          <Image
                            src={
                              import.meta.env.VITE_BASE_URL +
                              "/images/book/" +
                              item.details.thumbnail
                            }
                            style={{ width: "80px", height: "auto" }}
                          />
                        </Col>
                        <Col
                          span={8}
                          style={{
                            padding: "0 4px 0 16px",
                            textAlign: "center",
                          }}
                        >
                          {item.details.mainText}
                        </Col>
                        <Col span={4} style={{ textAlign: "center" }}>
                          {item.details.price.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Col>
                        <Col span={4} style={{ textAlign: "center" }}>
                          <InputNumber
                            min={1}
                            max={item.details.quantity}
                            value={item.quantity}
                            onChange={(value) =>
                              dispatch(
                                doUpdateOrderAction({
                                  quantity: value,
                                  id: item.id,
                                  details: item.details,
                                })
                              )
                            }
                          />
                        </Col>
                        <Col span={4} style={{ textAlign: "center" }}>
                          <p>
                            Tổng :
                            {(
                              item.quantity * item.details.price
                            ).toLocaleString("vi", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </p>
                        </Col>
                        <Col span={2} style={{ textAlign: "center" }}>
                          <MdAutoDelete
                            onClick={() =>
                              dispatch(doDeleteOrderAction({ id: item.id }))
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                  );
                })}
            </Row>
          </Col>
        ) : (
          <Col
            md={
              current === 1 ? 18 : current === 2 ? 16 : current === 3 ? 0 : 24
            }
            sm={24}
            style={{
              background: "#fff",
              height: "80vh",
              paddingTop: "20%",
              fontSize: "2rem",
            }}
          >
            <Empty description="Không có đơn hàng" />
          </Col>
        )}
        {current === 1 && (
          <Col
            offset={1}
            md={5}
            sm={24}
            style={{ backgroundColor: "#fff", padding: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p>Tạm Tính</p>
              <p>
                {tongTien.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
            <Divider />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p>Tổng Tiền</p>
              <p style={{ color: "#ee4d2d", fontSize: "1.2rem" }}>
                {tongTien.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
            <Divider />
            <button
              className="buy"
              onClick={() => {
                if (orderList.length !== 0) {
                  setcurrent(2);
                }
              }}
            >
              Mua ngay
            </button>
          </Col>
        )}
        {current === 2 && (
          <DatHang tongTien={tongTien} setcurrent={setcurrent} />
        )}
        {current === 3 && <ThanhToan />}
      </Row>
    </div>
  );
}
function DatHang({ tongTien, setcurrent }) {
  const [form] = useForm();
  const user = useSelector((state) => state.account.user);
  const carts = useSelector((state) => state.order.carts);
  const dispatch = useDispatch();
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  const onFinish = async (values) => {
    const details = carts.map((item) => {
      return {
        bookName: item.details.mainText,
        quantity: item.quantity*1.0,
        _id: item.id,
      };
    });
    let data = {
      name: values.ten,
      address: values.diachi,
      phone: values.sdt,
      totalPrice: tongTien,
      detail: details,
    };
    let res = await callCreateOrder(data);
    console.log(res);
    if (res && res.statusCode === 201) {
      setcurrent(3);
      message.success({ content: "Đặt hàng thành công", duration: 4 });
      dispatch(doRefeshOrder());
    } else {
      notification.error({
        message: res.data,
        duration: 4,
      });
    }
  };

  return (
    <Col
      offset={1}
      md={7}
      sm={24}
      style={{ backgroundColor: "#fff", padding: "1rem" }}
    >
      <Form {...layout} name="control-ref" 
      onFinish={onFinish} form={form}>
        <Form.Item
          name="ten"
          label="Tên Người Nhận"
          rules={[{ required: true }]}
          initialValue={user.fullName}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sdt"
          label="Số Điện Thoại"
          rules={[{ required: true }]}
          initialValue={user.phone}
        >
          <Input />
        </Form.Item>
        <Form.Item name="diachi" label="Địa Chỉ" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="payment" label="Hình Thức Thanh Toán">
          <Radio checked={true}>Thanh toán khi nhận hàng</Radio>
        </Form.Item>
        <Form.Item
          name="money"
          label="Tổng Tiền"
          rules={[{ required: true }]}
          initialValue={tongTien.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          })}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="buy"
          >
            Đặt hàng
          </Button>
        </Form.Item>
      </Form>
    </Col>
  );
}
function ThanhToan() {
  const navigate= useNavigate()
  return (
    <Col span={24}>
      <Result
        icon={<SmileOutlined />}
        title="Great, we have done all the operations!"
        extra={<Button type="primary" onClick={()=>navigate("/history")}>Next</Button>}
      />
    </Col>
  );
}
export default OrderUser;
