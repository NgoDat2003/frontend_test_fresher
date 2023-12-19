import { useSearchParams } from "react-router-dom";
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from "react-image-gallery";
import { Col, InputNumber, Rate, Row, Skeleton } from "antd";
import "./Book.scss";
import { useEffect, useRef, useState } from "react";
import ModalGallery from "./ModalGallery";
import { callGetBookByID } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { doAddOrderAction } from "../../redux/order/orderSlice";
function Book() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [openModal, setopenModal] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [checkSkeleton, setCheckSkeleton] = useState(false);
  const [book, setBook] = useState({});
  const [images, setImages] = useState([]);
  const [number, setNumber] = useState(1);
  const refGallery = useRef();
  const dispatch = useDispatch();
  const handleClickImage = () => {
    setcurrentIndex(refGallery.current.getCurrentIndex() ?? 0);
    setopenModal(true);
  };
  const cart = useSelector((state) => state.order.carts);
  useEffect(() => {
    handleGetBook();
    setTimeout(() => setCheckSkeleton(true), 2000);
  }, []);
  const handleGetBook = async () => {
    let res = await callGetBookByID(id);
    if (res && res.statusCode === 200) {
      setBook(res.data);
      let a = res.data.slider.map((item) => {
        return {
          original: import.meta.env.VITE_BASE_URL + "/images/book/" + item,
          thumbnail: import.meta.env.VITE_BASE_URL + "/images/book/" + item,
        };
      });
      setImages([
        {
          original:
            import.meta.env.VITE_BASE_URL +
            "/images/book/" +
            res.data.thumbnail,
          thumbnail:
            import.meta.env.VITE_BASE_URL +
            "/images/book/" +
            res.data.thumbnail,
        },
        ...a,
      ]);
    }
  };
  const handleChangeNumber = (e) => {
    if (!isNaN(e)) {
      if (e <= 1) {
        e = 1;
      }
      if (e >= book.quantity) {
        e = book.quantity;
      }
      setNumber(e);
    }
  };
  const handleAddOrder = () => {
    dispatch(
      doAddOrderAction({ quantity: number, id: book._id, details: book })
    );
  };
  return (
    <>
      <div className="container" style={{minHeight:"80vh"}}>
        {checkSkeleton === true ? (
          <Row>
            <Col md={10} sm={24}>
              <ImageGallery
                items={images}
                onClick={() => handleClickImage()}
                showPlayButton={false}
                ref={refGallery}
                showFullscreenButton={false}
                renderLeftNav={() => <></>}
                renderRightNav={() => <></>}
              />
            </Col>
            <Col md={14} sm={24}>
              <Row className="container-right">
                <Col span={24}>
                  Tác Giả :{" "}
                  <span style={{ color: "#4783e6", fontWeight: "bold" }}>
                    {book.author}
                  </span>
                </Col>
                <Col span={24}>
                  <div className="mainText">{book.mainText}</div>
                </Col>
                <Col span={24}>
                  <div className="price">
                    {new Intl.NumberFormat().format(book.price)}
                  </div>
                </Col>
                <Col
                  span={24}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Rate value={5} style={{ fontSize: "12px" }} />
                  <span style={{ fontSize: "12px" }}>Đã bán {book.sold}</span>
                </Col>
                <Col span={24} className="van-chuyen">
                  <h3>Vận Chuyển</h3>
                  <p>Miễn phí vận chuyển</p>
                </Col>
                <Col span={24} className="so-luong">
                  <h3>Số lượng</h3>
                  <div className="number">
                    <button
                      className="giam"
                      onClick={() => {
                        number <= 1
                          ? setNumber(1)
                          : setNumber((prev) => prev - 1);
                      }}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      name=""
                      id=""
                      value={number}
                      onChange={(e) => handleChangeNumber(e.target.value)}
                    />
                    <button
                      className="tang"
                      onClick={() => {
                        number >= book.quantity
                          ? setNumber(book.quantity)
                          : setNumber((prev) => prev + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </Col>
                <Col span={24} className="action">
                  <button className="add" onClick={() => handleAddOrder()}>
                    Thêm vào giỏ hàng
                  </button>
                  <button className="buy">Mua ngay</button>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={10} sm={24}>
              <Skeleton.Button
                active={true}
                className="skeleton-left"
                block={true}
              />
              <div className="skeleton-img">
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
                <Skeleton.Image active={true} />
              </div>
            </Col>
            <Col md={14} sm={24}>
              <Row className="container-right">
                <Col span={24}>
                  <Skeleton.Input active={true} block={true} />
                </Col>
                <Col span={24}>
                  <Skeleton.Input active={true} block={true} />
                </Col>
                <Col span={24}>
                  <Skeleton.Input active={true} block={true} />
                </Col>
                <Col
                  span={24}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Skeleton.Input active={true} block={true} />
                </Col>
                <Col span={24} className="van-chuyen">
                  <Skeleton.Input active={true} block={true} />
                </Col>
                <Col span={24} className="so-luong">
                  <Skeleton.Input active={true} block={true} />
                </Col>
                <Col span={24} className="action">
                  <Skeleton.Button active={true} block={true} />
                  <Skeleton.Button active={true} block={true} />
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </div>
      <ModalGallery
        openModal={openModal}
        setopenModal={setopenModal}
        currentIndex={currentIndex}
        items={images}
        setcurrentIndex={setcurrentIndex}
        refGallery={refGallery}
      />
    </>
  );
}

export default Book;
