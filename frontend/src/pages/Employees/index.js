import {
  Button,
  Col,
  DatePicker,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useReducer, useRef } from "react";
import { CSVLink } from "react-csv";
import API from "../../services/Api";
import History from "../../services/History";
import EmployeeAdd from "./add";
import EmployeeEdit from "./edit";
import EmployeeView from "./view";

const { Title } = Typography;
const Employees = () => {
  /**
   * Initial State
   */
  const initialState = {
    addVisible: false,
    editVisible: false,
    editRecord: null,
    viewVisible: false,
    viewRecord: null,
    selectedRowKeys: [],
    selectedData: [],
    dataSource: [],
    filterData: [],
    searchBox: "",
    dobFrom: "",
    dobTo: "",
  };

  const merge = (oldState, newState) => ({ ...oldState, ...newState });
  const [state, setState] = useReducer(merge, initialState);
  const salaryFrom = useRef(0);
  const salaryTo = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      const employees = await API.get("employees");
      const dataSource = employees.data.data.map((res) => {
        return { ...res, key: res.id };
      });
      setState({ dataSource: dataSource, filterData: dataSource });
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      sorter: (a, b) => a.fullname.length - b.fullname.length,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      sorter: (a, b) => new Date(a.dob) - new Date(b.dob),
      render: (record) => {
        return moment(record).format("MMM Do YYYY");
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      sorter: (a, b) => a.gender - b.gender,
      render: (record) => {
        return record === 0 ? "F" : "M";
      },
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      sorter: (a, b) => a.salary - b.salary,
      render: (record) => {
        return `$ ${record}`;
      },
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      sorter: (a, b) => a.designation.length - b.designation.length,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (record) => {
        return (
          <Space size="middle">
            <a onClick={() => handleAction("edit", record)}>Edit</a>
            <a onClick={() => handleAction("view", record)}>View</a>
            <Popconfirm
              title="Are you sure delete this employee?"
              onConfirm={() => handleAction("delete", record)}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const handleAction = async (action, record) => {
    if (action === "delete") {
      await API.post("employees/delete", { id: record.id });
      window.location.reload(false);
    } else if (action === "edit") {
      setState({ editVisible: true, editRecord: record });
    } else if (action === "view") {
      setState({ viewVisible: true, viewRecord: record });
    }
  };

  // triggers when checkbox clicked
  const onSelectChange = (selectedRowKeys) => {
    setState({ selectedRowKeys });
    const selectedData = state.dataSource
      .filter((res) => {
        return selectedRowKeys.includes(res.id);
      })
      .map((data) => {
        return {
          "Full Name": data.fullname,
          "Date of Birth": data.dob,
          Gender: data.gender,
          Salary: data.salary,
          Designation: data.designation,
        };
      });
    setState({ selectedData });
  };

  // table row selection
  const { selectedRowKeys } = state;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // handling button or modal
  const handleModal = (modal, visible = true) => {
    if (modal === "add") {
      setState({ addVisible: visible });
    }
    if (modal === "edit") {
      setState({ editVisible: visible });
      if (visible === false) {
        setState({ editRecord: null });
      }
    }

    if (modal === "view") {
      setState({ viewVisible: visible });
      if (visible === false) {
        setState({ viewRecord: null });
      }
    }

    if (modal === "print") {
      const employees = state.dataSource.map((data) => {
        return {
          "Full Name": data.fullname,
          "Date of Birth": data.dob,
          Gender: data.gender,
          Salary: data.salary,
          Designation: data.designation,
        };
      });

      History.push({
        pathname: "/employees/generateFile",
        employees: employees,
      });
    }
  };

  // Export to csv
  const handleBulkImport = async (e) => {
    const csv = e.target.files[0];
    let formData = new FormData();
    formData.append("file", csv);

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const res = await API.post("employees/bulkImportData", formData, config);
    if (res.data.length > 0) {
      const err = [];
      res.data.map((data) => {
        if (data.response === "error") err.push(data.rowNo);
      });
      if (err.length > 0)
        message.error(
          `X row [${err}] were skipped since they did not have data.`
        );
      else message.success(`file uploaded successfully`);
      setTimeout(() => {
        window.location.reload(false);
      }, 2000);
    }
  };

  const handleExport = (name) => {
    if (name === "pdf") {
      History.push({
        pathname: "/employees/generateFile",
        employees: state.selectedData,
      });
    }
  };

  // Filtering by csv imported date
  const handleImportedDate = (hid) => {
    if (hid?._d) {
      const importedDate = moment(hid._d).format("YYYY-MM-DD");
      const filterData = state.dataSource.filter((res) => {
        return moment(res.createdAt).format("YYYY-MM-DD") === importedDate;
      });
      setState({ filterData });
    } else {
      setState({ filterData: state.dataSource });
    }
  };

  // state management for which search has been selected
  const handleSelectSearch = (name) => {
    setState({ searchBox: name });
    if (name === "") setState({ filterData: state.dataSource });
  };

  // handling the search
  // handles fullname, dob, gender, salary, designation
  const handleSearch = (value, value1) => {
    if (value1 < value && state.searchBox === "salary") {
      message.error(`Salary From must be less than Salary To.`);
      return;
    }
    if (state.searchBox === "dob") {
      if (
        moment(value1).format("YYYY-MM-DD") < moment(value).format("YYYY-MM-DD")
      ) {
        message.error(`Please check date range.`);
        return;
      }
    }
    const filterData = state.dataSource.filter((res) => {
      if (state.searchBox === "fullname") {
        return res.fullname.toLowerCase().includes(value);
      } else if (state.searchBox === "designation") {
        return res.designation.toLowerCase().includes(value);
      } else if (state.searchBox === "gender") {
        return res.gender.toString() === value;
      } else if (state.searchBox === "salary") {
        return res.salary >= value && res.salary <= value1;
      } else if (state.searchBox === "dob") {
        return (
          res.dob >= moment(value).format("YYYY-MM-DD") &&
          res.dob <= moment(value1).format("YYYY-MM-DD")
        );
      }
    });

    setState({ filterData });
  };

  const handleSetDOB = (name, value) => {
    if (name === "dobFrom") setState({ dobFrom: value });
    else if (name === "dobTo") setState({ dobTo: value });
  };

  const handleGetSearchBox = () => {
    switch (state.searchBox) {
      case "fullname":
        return (
          <Input
            placeholder="Full Name"
            onChange={(e) => handleSearch(e.target.value)}
          ></Input>
        );
      case "dob":
        return (
          <Space size="middle">
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Dob From"
              onChange={(e) => handleSetDOB("dobFrom", e._d)}
            />
            <span>to</span>
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Dob To"
              onChange={(e) => handleSetDOB("dobTo", e._d)}
            />
            <Button
              type="primary"
              onClick={() => handleSearch(state.dobFrom, state.dobTo)}
            >
              Search
            </Button>
          </Space>
        );
      case "gender":
        return (
          <Select onChange={handleSearch}>
            <Select.Option value="1">Male</Select.Option>
            <Select.Option value="0">Female</Select.Option>
          </Select>
        );
      case "salary":
        return (
          <>
            <Space size="middle">
              <InputNumber placeholder="Salary From" ref={salaryFrom} min={1} />{" "}
              <span>to</span>
              <InputNumber placeholder="Salary To" ref={salaryTo} min={1} />
              <Button
                type="primary"
                onClick={() =>
                  handleSearch(
                    salaryFrom.current.state.value,
                    salaryTo.current.state.value
                  )
                }
              >
                Search
              </Button>
            </Space>
          </>
        );
      case "designation":
        return (
          <Input
            placeholder="Search by designation"
            onChange={(e) => handleSearch(e.target.value)}
          ></Input>
        );
      default:
        return;
    }
  };

  const handleReset = () => {
    setState({ filterData: state.dataSource });
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={2}>Manage Employee</Title>
        </Col>
      </Row>

      <Row gutter={[0, 10]}>
        <Col span={6}>
          <Space size="middle">
            <label>Filter by Imported</label>
            <DatePicker
              format="YYYY-MM-DD"
              onChange={(e) => handleImportedDate(e)}
            />
          </Space>
        </Col>
        <Col span={16} offset={2} style={{ textAlign: "right" }}>
          <Space size="middle">
            <Input
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              type="file"
              name="file"
              icon="file text outline"
              iconPosition="left"
              label="Upload CSV"
              labelPosition="right"
              placeholder="UploadCSV..."
              onChange={handleBulkImport}
            />
          </Space>
        </Col>
      </Row>

      <Row gutter={[0, 10]}>
        <Col span={8}>
          <Space size="middle">
            <label>Search By</label>
            <Select
              onChange={handleSelectSearch}
              placeholder="Select"
              style={{ width: "120px" }}
              defaultValue=""
            >
              <Select.Option value="">--Select--</Select.Option>
              <Select.Option value="fullname">Full Name</Select.Option>
              <Select.Option value="dob">DOB</Select.Option>
              <Select.Option value="gender">Gender</Select.Option>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="designation">Designation</Select.Option>
            </Select>
            {handleGetSearchBox()}
          </Space>
        </Col>
        <Col span={12} offset={4} style={{ textAlign: "right" }}>
          <Space size="middle">
            <Button type="primary" onClick={() => handleModal("add", true)}>
              ADD +
            </Button>
            <Button type="primary" onClick={handleReset}>
              RELOAD
            </Button>
            <Button type="primary" onClick={() => handleModal("print", true)}>
              PRINT ALL
            </Button>
            {selectedRowKeys.length > 0 && (
              <>
                <label>Export</label>
                <Select style={{ width: "100px" }} onChange={handleExport}>
                  <Select.Option value="excel">
                    <CSVLink
                      data={state.selectedData}
                      filename="Employee Record"
                    >
                      EXCEL
                    </CSVLink>
                  </Select.Option>
                  <Select.Option value="pdf">PDF</Select.Option>
                </Select>
              </>
            )}
          </Space>
        </Col>
      </Row>
      <Row gutter={[0, 10]}>
        <Col span={24}>
          <Table
            rowSelection={rowSelection}
            dataSource={state.filterData}
            columns={columns}
            showSorterTooltip={false}
          />
        </Col>
      </Row>

      {/* Add Modal Start */}
      {state.addVisible && (
        <Modal
          title="Create Employee"
          visible={state.addVisible}
          height={500}
          onCancel={() => handleModal("add", false)}
          footer={null}
        >
          <EmployeeAdd />
        </Modal>
      )}
      {/* Add Modal End */}

      {/* Edit Modal Start */}
      {state.editVisible && (
        <Modal
          title="Edit Employee"
          visible={state.editVisible}
          height={500}
          onCancel={() => handleModal("edit", false)}
          footer={null}
        >
          <EmployeeEdit editRecord={state.editRecord} />
        </Modal>
      )}
      {/* Edit Modal End */}

      {/* View Modal Start */}
      {state.viewVisible && (
        <Modal
          title="Employee Details"
          visible={state.viewVisible}
          height={500}
          onCancel={() => handleModal("view", false)}
          footer={null}
        >
          <EmployeeView viewRecord={state.viewRecord} />
        </Modal>
      )}
      {/* View Modal End */}
    </>
  );
};

export default Employees;
