import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Tabs,
} from "antd";
import "./Main.scss";
import { AiFillFilter } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { callListBook, callListCategory } from "../../services/api";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Main() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [listBook, setListBook] = useState([]);
  const [sort, setsort] = useState("&sort=-sold");
  const [filter, setFilter] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const onChangeTabs = (key) => {
    setsort(key);
  };

  const items = [
    {
      key: "&sort=-sold",
      label: "Phổ Biến",
    },
    {
      key: "&sort=-updateAt",
      label: "Hàng Mới",
    },
    {
      key: "&sort=price",
      label: "Giá Thấp Đến Cao",
    },
    {
      key: "&sort=-price",
      label: "Giá Cao Đến Thấp",
    },
  ];
  const handleGetListCategory = async () => {
    let res = await callListCategory();
    console.log(res);
    if (res && res.statusCode === 200) {
      let d = res.data.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
      setCategoryList(d);
    }
  };
  const handleGetListBook = async () => {
    let query = `/api/v1/book?current=${current}&pageSize=${pageSize}`;
    if (sort && sort !== "") {
      query += sort;
    }
    if (filter && filter !== "") {
      query += filter;
    }
    if (filterCategory && filterCategory !== "") {
      query += filterCategory;
    } else {
    }
    let res = await callListBook(query);
    // console.log(res);
    if (res && res.statusCode === 200) {
      const d = res.data.result.map((item) => {
        return {
          _id: item._id,
          thumbnail: item.thumbnail,
          slider: item.slider,
          mainText: item.mainText,
          author: item.author,
          price: item.price,
          sold: item.sold,
          quantity: item.quantity,
          category: item.category,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          __v: item.__v,
        };
      });
      setListBook(d);
      setTotal(res.data.meta.total);
    }
  };
  useEffect(() => {
    handleGetListCategory();
  }, []);
  useEffect(() => {
    handleGetListBook();
  }, [pageSize, current, sort, filter, filterCategory]);
  const handleChangeFilter = (changedValues, values) => {
    console.log("checked = ", changedValues, values);
    if (changedValues.category) {
      if (values.category && values.category.length > 0) {
        let a = changedValues.category.join(",");
        setFilterCategory("&category=" + a);
      } else {
        setFilterCategory("");
      }
    }
  };
  const handleChangePagination = (values) => {
    if (values.current !== current) {
      setCurrent(values.current);
    }
    if (values.pageSize !== pageSize) {
      setPageSize(values.pageSize);
    }
  };
  const onFinish = (values) => {
    console.log(values);
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let query =
        "&price>=" + values?.range?.from + "&price<=" + values?.range?.to;
      console.log(query);
      setFilter(query);
    }
  };
  function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    return str;
  }
  var slug = function (str) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };
  const handleBook = (id, mainText) => {
    let str = removeVietnameseTones(mainText);
    str = slug(str);
    let path = "/book/" + str + "?id=" + id;
    navigate(path)
  };
  return (
    <div className="container">
      <Row gutter={16}>
        <Col
          className="gutter-row"
          span={5}
          md={4}
          sm={0}
          style={{ border: "1px solid #000" }}
        >
          <div className="header_main">
            <div className="header">
              <div>
                <AiFillFilter style={{ color: "#1677ff", cursor: "pointer" }} />{" "}
                Bộ lọc tìm kiếm
              </div>
              <div>
                <BiRefresh
                  style={{ color: "#1677ff", cursor: "pointer" }}
                  onClick={() => (
                    form.resetFields(), setFilterCategory(""), setFilter("")
                  )}
                />
              </div>
            </div>
            <Form
              style={{ width: "100%" }}
              // onFinish={(values) => {
              //   console.log("Biểu mẫu đã hoàn thành:", values);
              //   // Thực hiện các hành động khác khi gửi biểu mẫu nếu cần
              // }}
              form={form}
              onValuesChange={(changedValues, values) =>
                handleChangeFilter(changedValues, values)
              }
              onFinish={onFinish}
            >
              <Form.Item
                name="category"
                label="Danh mục sản phẩm"
                labelCol={{ span: 24 }}
              >
                <Checkbox.Group
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Row>
                    {categoryList &&
                      categoryList.map((item, index) => {
                        return (
                          <Col key={`key-${index}`} span={24}>
                            <Checkbox value={item.value}>{item.label}</Checkbox>
                          </Col>
                        );
                      })}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                <Row>
                  {/* <div className="price_main"> */}
                  <Col span={5}>
                    <Form.Item name={["range", "from"]}>
                      <InputNumber
                        style={{ maxWidth: "80px" }}
                        name="from"
                        formatter={(value) =>
                          new Intl.NumberFormat().format(value)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>-</Col>
                  <Col span={5}>
                    <Form.Item name={["range", "to"]}>
                      <InputNumber
                        style={{ maxWidth: "80px" }}
                        name="to"
                        formatter={(value) =>
                          new Intl.NumberFormat().format(value)
                        }
                      />
                    </Form.Item>
                  </Col>
                  {/* </div> */}
                </Row>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={(values) => form.submit()}
                >
                  Áp dụng{" "}
                </Button>
              </Form.Item>
            </Form>
          </div>

          <Divider />
          <div className="rate_main">
            <div>Đánh giá</div>
            <Rate value={1} />
            <Rate value={2} />
            <Rate value={3} />
            <Rate value={4} />
            <Rate value={5} />
          </div>
        </Col>
        <Col className="gutter-row" span={19} md={19} sm={24}>
          <div>
            <div className="tabs_container">
              <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={onChangeTabs}
              />
            </div>
            <div className="product_list">
              <Row gutter={16}>
                {listBook &&
                  listBook.length > 0 &&
                  listBook.map((item) => (
                    <Col
                      md={6}
                      sm={12}
                      onClick={() => handleBook(item._id, item.mainText)}
                    >
                      <div className="produc_item">
                        <img
                          src={
                            import.meta.env.VITE_BASE_URL +
                            "/images/book/" +
                            item.thumbnail
                          }
                          alt=""
                          style={{ width: "100%", height: "auto" }}
                        />
                        <div className="product_description">
                          <h3>{item.mainText}</h3>
                          <p>
                            {item.price.toLocaleString("vi", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </p>
                          <div className="footer_item">
                            <Rate disabled defaultValue={2} className="rate" />
                            <span>Đã Bán {item.sold}</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}

                <Col span={12} offset={6}>
                  <Pagination
                    // defaultCurrent={6}
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    style={{ margin: "20px 0" }}
                    responsive
                    onChange={(p, s) =>
                      handleChangePagination({ current: p, pageSize: s })
                    }
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Main;
