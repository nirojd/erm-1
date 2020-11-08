import React, { useReducer, useRef } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
} from "antd";
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

const EmployeeAdd = () => {
  /**
   * Initialization
   */
  const initialState = {
    msg: "",
    imageUrl: "https://via.placeholder.com/150?text=NO IMAGE",
    imageFile: "",
  };
  const merge = (oldState, newState) => ({ ...oldState, ...newState });
  const [state, setState] = useReducer(merge, initialState);
  const ref = useRef(null);

  const onFinish = async (values) => {
    const { fullname, dob, gender, salary, designation } = values;
    if (!state.imageFile) {
      message.error(`Please upload valid image.`);
      return false;
    }
    const res = await API.post(`/employees/addOREdit`, {
      fullname,
      dob,
      gender,
      salary,
      designation,
      createdBy: sessionStorage.getItem("userId"),
      updatedBy: sessionStorage.getItem("userId"),
    });
    if (res.data.response === "success") {
      // insert image
      let uploadFormData = new FormData();
      uploadFormData.append("file", state.imageFile);
      uploadFormData.append("id", res.data.id);
      let config = {
        header: {
          "Content-Type": "multipart/form-data",
        },
      };
      await API.post(`/employees/addPicture`, uploadFormData, config);
      // You can either use session to hold the data or can refresh the page.
      // For now, refresh the page.
      window.location.reload(false);
    } else {
      console.log(res);
      // setState({ msg: res.data.errors[0].msg });
    }
  };

  const handlePicture = (e) => {
    let imageFile = e.target.files[0];
    const size = (imageFile.size / 1024 / 1024).toFixed(2);
    if (size > 4) {
      setState({ imageFile: "", imageUrl: "" });
      ref.current.value = "";
      message.error(`Maximum size allowed upto 4MB.`);
      return false;
    }
    setState({ imageFile });
    const reader = new FileReader();
    reader.onload = (e) => {
      imageFile = e.target.result;
      setState({ imageUrl: imageFile });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Form {...layout} name="employeeAdd" onFinish={onFinish}>
      <Form.Item
        label="Full Name"
        name="fullname"
        rules={[
          {
            required: true,
            message: "Please input employee fullname!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="DOB"
        name="dob"
        rules={[
          {
            required: true,
            message: "Please input employee dob!",
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        label="Gender"
        name="gender"
        rules={[
          {
            required: true,
            message: "Please select gender!",
          },
        ]}
      >
        <Select>
          <Select.Option value="1">Male</Select.Option>
          <Select.Option value="0">Female</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Salary"
        name="salary"
        rules={[
          {
            required: true,
            message: "Please input employee salary!",
          },
          {
            type: "number",
            message: "Please input valid salary!",
          },
        ]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        label="Designation"
        name="designation"
        rules={[
          {
            required: true,
            message: "Please input employee designation!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Image" name="picture">
        <Input
          accept="image/png, image/jpeg"
          type="file"
          name="file"
          required="true"
          ref={ref}
          onChange={handlePicture}
        />
        <img
          alt="Employee"
          src={state.imageUrl}
          width="80"
          height="80"
          style={{ marginTop: "10px" }}
        />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeAdd;
