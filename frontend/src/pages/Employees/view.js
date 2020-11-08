import { Avatar, Col, Row } from "antd";
import moment from "moment";
import React from "react";

const EmployeeView = (props) => {
  return (
    <>
      <Row>
        <Col span={10}>
          <label>Full Name:</label>
        </Col>
        <Col span={12} offset={2}>
          {props.viewRecord.fullname}
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <label>DOB:</label>
        </Col>
        <Col span={12} offset={2}>
          {moment(props.viewRecord.dob).format("MMM Do YYYY")}
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <label>Gender:</label>
        </Col>
        <Col span={12} offset={2}>
          {props.viewRecord.gender === 1 ? "M" : "F"}
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <label>Salary:</label>
        </Col>
        <Col span={12} offset={2}>
          $ {props.viewRecord.salary}
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <label>Designation:</label>
        </Col>
        <Col span={12} offset={2}>
          {props.viewRecord.designation}
        </Col>
      </Row>
      {props.viewRecord.picture && (
        <Row>
          <Col span={10}>
            <label>Picture:</label>
          </Col>
          <Col span={12} offset={2}>
            <Avatar
              size={64}
              src={process.env.REACT_APP_FILE_URL + props.viewRecord.picture}
              shape="square"
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default EmployeeView;
