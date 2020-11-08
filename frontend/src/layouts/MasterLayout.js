import { Layout } from "antd";
import React from "react";
import FooterBar from "../components/FooterBar/FooterBar";
import NavBar from "../components/NavBar/NavBar";
import SideBar from "../components/SideBar/SideBar";
import "./MasterLayout.css";
const { Content } = Layout;

export default ({ children }) => (
  <>
    <Layout>
      <SideBar />
      <Layout>
        <NavBar />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 500 }}
          >
            {children}
          </div>
        </Content>
        <FooterBar />
      </Layout>
    </Layout>
  </>
);
