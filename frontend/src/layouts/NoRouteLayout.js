import { Layout } from "antd";
import React from "react";
const { Content } = Layout;

export default ({ children }) => (
  <>
    <Layout>
      <Layout>
        <Content className="content">{children}</Content>
      </Layout>
    </Layout>
  </>
);
