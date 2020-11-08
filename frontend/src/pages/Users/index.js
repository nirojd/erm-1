import React, { useReducer, useEffect } from "react";
import { Table, Tag, Typography, Row, Col, Button, Modal } from "antd";
import UserAdd from "./add";
import API from "../../services/Api";

const { Title } = Typography;
const Users = () => {
  /**
   * Initialization
   */
  const initialState = {
    msg: "",
    users: [],
    visible: false,
  };
  const merge = (oldState, newState) => ({ ...oldState, ...newState });
  const [state, setState] = useReducer(merge, initialState);

  useEffect(async () => {
    const fetchData = async () => {
      const users = await API.get("users");
      setState({ dataSource: users.data });
    };

    fetchData();
  }, []);

  const handleModal = (visible) => {
    setState({ visible });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role - b.role,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status - b.status,
      render: (record) => {
        const color = record === "active" ? "green" : "red";
        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {record}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={2}>Manage User</Title>
        </Col>
      </Row>
      <Row gutter={[0, 10]}>
        <Col span={8}></Col>
        <Col span={8} offset={8} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={() => handleModal(true)}>
            ADD +
          </Button>
        </Col>
      </Row>
      <Row gutter={[0, 10]}>
        <Col span={24}>
          <Table dataSource={state.dataSource} columns={columns} />
        </Col>
      </Row>
      {/* Add Modal Start */}
      <Modal
        title="Create User"
        visible={state.visible}
        height={500}
        footer={null}
        onCancel={() => handleModal(false)}
      >
        <UserAdd />
      </Modal>
      {/* Add Modal End */}
    </>
  );
};

export default Users;
