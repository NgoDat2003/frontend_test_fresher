import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Button, Menu, Dropdown, Space, message, Avatar } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import "./admin.scss";
import { MdOutlineDashboard } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { BiNotepad } from "react-icons/bi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Content } from "antd/es/layout/layout";
import { Link, Outlet, useNavigate } from "react-router-dom";
import LoadingPages from "../../pages/Loading";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";
function LayoutAdmin() {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const fullName = user.fullName;
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    let res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };
  const items_dropdown = [
    {
      key: "Dashboard",
      icon: <MdOutlineDashboard />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "Manager User",
      icon: <BsPeople />,
      label: "Manager User",
      children: [
        {
          key: "CRUD Users",
          icon: <BsPeople />,
          label: <Link to="/admin/user">CRUD Users</Link>,
        },
        {
          key: "Files 1",
          icon: <BsPeople />,
          label: <Link to="/admin/user">Files 1</Link>,
        },
      ],
    },
    {
      key: "Manager book",
      icon: <BiNotepad />,
      label: <Link to="/admin/book">Manager book</Link>,
    },
    {
      key: "Manager Orders",
      icon: <AiOutlineDollarCircle />,
      label: <Link to="/admin/order">Manager Orders</Link>,
    },
  ];
  const items = [
    { label: <Link to="/admin">Trang quản trị</Link>, key: "2" },
    {
      label: "Quản lý sản phẩm",
      key: "0",
    },
    {
      label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
      key: "1",
    },
  ];

  if (user && user.role !== "ADMIN") {
    return <LoadingPages />;
  }
  return (
    <div className="main__container">
      <Layout className="layout__container">
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
          <div className="demo-logo-vertical" />
          <div>
            <h3>Admin</h3>
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={items_dropdown}
          />
        </Sider>
        <Layout>
          <header className="header__container-admin">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            {isAuthenticated ? (
              <>
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  className="header__right-drop"
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar src={import.meta.env.VITE_BASE_URL+'/images/avatar/'+user.avatar} />
                      {fullName}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </>
            ) : (
              <span className="header__right-drop">Tài khoản</span>
            )}
          </header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: "#fff",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default LayoutAdmin;
