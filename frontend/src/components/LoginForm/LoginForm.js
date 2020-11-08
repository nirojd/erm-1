import { Button, Form, Input, Typography, Alert, Row, Col } from "antd";
import React, { useReducer } from "react";
import API from "../../services/Api";
import History from "../../services/History";
import "./LoginForm.css";

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

const LoginForm = () => {
  /**
   * Initialization
   */
  const { Title } = Typography;
  const initialState = {
    msg: "",
  };
  const merge = (oldState, newState) => ({ ...oldState, ...newState });
  const [state, setState] = useReducer(merge, initialState);

  const onFinish = async (values) => {
    const { username, password } = values;
    const res = await API.post(`/login`, {
      username,
      password,
    });
    if (res.data.response === "success") {
      sessionStorage.setItem("isLogged", true);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("userId", res.data.user.id);
      sessionStorage.setItem("role", res.data.user.UserRole.type);
      History.push("/dashboard");
    } else {
      setState({ msg: res.data.errors[0].msg });
    }
  };

  const handleClear = () => {
    setState({ msg: "" });
  };

  return (
    <div id="basic">
      <Row>
        <Col span={24}>
          <Title level={2}>Login</Title>
        </Col>
      </Row>
      {state.msg && (
        <Row gutter={[16, 16]}>
          <Col span={20} offset={4}>
            <Alert message={state.msg} type="error" showIcon />
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form {...layout} onFinish={onFinish}>
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
              <Input onChange={handleClear} />
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
              <Input.Password onChange={handleClear} />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default LoginForm;
