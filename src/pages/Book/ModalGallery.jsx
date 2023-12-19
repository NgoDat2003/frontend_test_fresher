import { Col, Image, Modal, Row } from "antd";
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from "react-image-gallery";
import { useState } from "react";
import "./Book.scss"
function ModalGallery({
  openModal,
  setopenModal,
  currentIndex,
  items,
  setcurrentIndex,
  refGallery,
}) {
    const [activeIndex, setactiveIndex] = useState(currentIndex);
  const showModal = () => {
    setopenModal(true);
  };

  const handleOk = () => {
    setopenModal(false);
  };

  const handleCancel = () => {
    setopenModal(false);
  };
  return (
    <Modal
      title="Basic Modal"
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      width={"800px"}
      height={"800px"}
    >
      <Row>
        <Col span={14}>
          <ImageGallery
            items={items}
            showPlayButton={false}
            showFullscreenButton={false}
            showThumbnails={false}
            ref={refGallery}
            startIndex={currentIndex}
            onSlide={(i)=>setactiveIndex(i)}
          />
        </Col>
        <Col span={8} style={{ margin: "10px 30px" }}>
          <Row>
            {items &&
              items.length > 0 &&
              items.map((item, index) => {
                return (
                  <Col
                    span={10}
                    offset={2}
                    style={{ marginTop: "10px", cursor: "pointer" }}
                    key={"key-" + index}
                    className={activeIndex===index && "activeModal"}
                  >
                    <Image
                      refGallery
                      width={"100%"}
                      height={"auto"}
                      src={item.original}
                      preview={false}
                      onClick={() => {
                        refGallery.current.slideToIndex(index);
                      }}
                      active
                    />
                  </Col>
                );
              })}
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

export default ModalGallery;
