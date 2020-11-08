import { Layout } from "antd";
import React from "react";
import "./NavBar.css";
const { Header } = Layout;

const NavBar = () => {
  return (
    <>
      <Header
        className="site-layout-sub-header-background"
        style={{ padding: 0 }}
      />
    </>
  );
};

export default NavBar;
