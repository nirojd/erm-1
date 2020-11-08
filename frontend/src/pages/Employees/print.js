import React, { useEffect, useReducer, useRef } from "react";
import History from "../../services/History";
import ReactToPdf from "react-to-pdf";
import { Row, Col, Typography, Button, Space } from "antd";
import "./print.css";
import ReactToPrint from "react-to-print";

const EmployeePrint = (props) => {
  /**
   * Initial State
   */
  const initialState = {
    data: [],
  };

  const merge = (oldState, newState) => ({ ...oldState, ...newState });
  const [state, setState] = useReducer(merge, initialState);
  const ref = useRef(null);
  const { Title } = Typography;

  useEffect(() => {
    const employees = props?.history?.location?.employees;
    if (!employees || employees.length < 0) History.push("/employees");
    setState({ data: employees });
  }, [props?.history?.location?.employees]);

  return (
    <>
      {state.data.length > 0 && (
        <>
          <Row>
            <Col span={24}>
              <Title level={2}>Preview</Title>
            </Col>
          </Row>

          <Row gutter={[0, 10]}>
            <Col span={6}></Col>
            <Col span={16} offset={2} style={{ textAlign: "right" }}>
              <Space size="middle">
                <ReactToPdf targetRef={ref} filename="employees.pdf">
                  {({ toPdf }) => (
                    <Button type="primary" onClick={toPdf}>
                      To PDF
                    </Button>
                  )}
                </ReactToPdf>
                <ReactToPrint
                  trigger={() => {
                    return <Button type="primary">PRINT</Button>;
                  }}
                  content={() => ref.current}
                />
              </Space>
            </Col>
          </Row>

          <Row gutter={[0, 10]} justify="space-around" align="middle">
            <Col span={16} offset={8}>
              <table ref={ref} className="empTable">
                <tr>
                  <th>Full Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Salary</th>
                  <th>Designation</th>
                </tr>
                {state.data.map((res, key) => {
                  return (
                    <tr key={key}>
                      <td>{res["Full Name"]}</td>
                      <td>{res["Date of Birth"]}</td>
                      <td>{res["Gender"]}</td>
                      <td>{res["Salary"]}</td>
                      <td>{res["Designation"]}</td>
                    </tr>
                  );
                })}
              </table>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default EmployeePrint;
