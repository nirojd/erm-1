import { Layout, Menu } from "antd";
import React, { useState, useEffect } from "react";
import "./SideBar.css";
import { useLocation, useHistory } from "react-router-dom";

const { Sider } = Layout;

const SideBar = () => {
  /**
   * Initialization
   */
  const [menu, setMenu] = useState("");
  const location = useLocation();
  const History = useHistory();

  useEffect(() => {
    const currentPath = location.pathname;
    const path = currentPath.split("/");
    const menuName = path[1] === "dashboard" ? "employees" : path[1];
    setMenu(menuName);
  }, [location]);

  const handleClick = (e) => {
    switch (e.key) {
      case "logout":
        sessionStorage.clear();
        History.push("/");
        break;
      default:
        History.push(`/${e.key}`);
    }
  };

  return (
    <>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" />
        {menu && (
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[menu]}
            onClick={handleClick}
          >
            <Menu.Item key="employees">Employees</Menu.Item>
            {sessionStorage.getItem("role") === "admin" && (
              <Menu.Item key="users">Users</Menu.Item>
            )}
            <Menu.Item key="logout">Logout</Menu.Item>
          </Menu>
        )}
      </Sider>
    </>
  );
};

export default SideBar;
