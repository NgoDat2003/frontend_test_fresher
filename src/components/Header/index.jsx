import { FaReact } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { AiOutlineShoppingCart, AiOutlineMenu } from "react-icons/ai";
import {
  Avatar,
  Badge,
  Divider,
  Drawer,
  Dropdown,
  Popover,
  Space,
  message,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";
import OrderModal from "./orderModal";
import ManageUser from "../ManageUser";

function Header() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const fullName = useSelector((state) => state.account.user.fullName);
  const role = useSelector((state) => state.account.user.role);
  const avatar = useSelector((state) => state.account.user.avatar);
  const order = useSelector((state) => state.order.carts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const navigate = useNavigate();
  const handleLogout = async () => {
    let res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
    }
  };

  const items = [
    {
      label: "Quản lý sản phẩm",
      key: "0",
    },
    {
      label: (
        <Link to="/" onClick={() => handleLogout()}>
          Đăng xuất
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <Link to="/history" >
          Lịch sử mua hàng
        </Link>
      ),
      key: "2",
    },
    {
      label: (
        <div onClick={showModal}>Quản lý tài khoản</div>
      ),
      key: "2",
    },
  ];
  if (role && role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "3",
    });
  }
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="header__container">
      <div className="header__left menu">
        <div onClick={()=>navigate("/")}>
          <FaReact />
          H2O Shop
        </div>
        <AiOutlineMenu className="menu__mobile" onClick={showDrawer} />
      </div>
      <div className="header__center">
        <BsSearch className="header__center-icon" />
        <input
          placeholder="Bạn tìm gì hôm nay"
          className="header__center-input"
        />
      </div>
      <div className="header__right">
        <Popover placement="bottomRight" title={"Sản phẩm mới thêm"}className="a" content={<OrderModal />}>
          <Badge count={order.length}>
            <AiOutlineShoppingCart className="header__right-cart" />
          </Badge>
        </Popover>
        {isAuthenticated ? (
          <>
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              className="header__right-drop"
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar
                    src={
                      import.meta.env.VITE_BASE_URL + "/images/avatar/" + avatar
                    }
                  />
                  {fullName}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </>
        ) : (
          <Link className="header__right-drop" to="/login">
            Tài khoản
          </Link>
        )}
      </div>
      <Drawer
        title={" H2O Shop"}
        // placement={placement}
        className="menu__box"
        closable={false}
        onClose={onClose}
        open={open}
        // key={placement}
      >
        {isAuthenticated ? (
          <>
            <div>Quản lý sản phẩm</div>
            <Divider />
            <div>Đăng xuất</div>
          </>
        ) : (
          <span className="header__right-drop menu__box">Tài khoản</span>
        )}
      </Drawer>
      {isModalOpen && <ManageUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}

export default Header;
