import React, { useReducer } from "react";
import { Button, Form, Input, Select, Alert, Row, Col } from "antd";
import API from "../../services/Api";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const UserAdd = () => {
  /**
   * Initialization
   */
  const initialState = {
    msg: "",
  };
  const merge = (oldState, newState) => ({ ...oldState, ...newState });
  const [state, setState] = useReducer(merge, initialState);

  const onFinish = async (values) => {
    const { username, password, role_id, status } = values;
    const res = await API.post(`/users/register`, {
      username,
      password,
      role_id,
      status,
    });
    if (res.data.response === "success") {
      // You can either use session to hold the data or can refresh the page.
      // For now, refresh the page.
      window.location.reload(false);
    } else {
      setState({ msg: res.data.errors[0].msg });
    }
  };

  return (
    <>
      {state.msg && (
        <Row gutter={[16, 16]}>
          <Col span={20} offset={4}>
            <Alert message={state.msg} type="error" showIcon />
          </Col>
        </Row>
      )}
      <Row>
        <Col span={24}>
          <Form {...layout} name="userAdd" onFinish={onFinish}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Role"
              name="role_id"
              rules={[
                {
                  required: true,
                  message: "Please select role!",
                },
              ]}
            >
              <Select>
                <Select.Option value="1">Admin</Select.Option>
                <Select.Option value="2">staff</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Please select status!",
                },
              ]}
            >
              <Select>
                <Select.Option value="1">Active</Select.Option>
                <Select.Option value="0">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UserAdd;
