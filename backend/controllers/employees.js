const Employee = require("../db/models").Employee;
const validator = require("validator");
const moment = require("moment");
const XLSX = require("xlsx");
const fs = require("fs");

module.exports = {
  /**
   * List Employees
   */
  async index(req, res, next) {
    let result = {};
    if (req.params.id > 0) {
      const { id } = req.params;
      try {
        const employees = await Employee.findOne({
          where: {
            id,
          },
        });
        result.response = "success";
        result.data = employees;
        res.status(200).send(result);
      } catch (err) {
        next(err);
      }
    } else {
      try {
        const employees = await Employee.findAll({
          order: [["id", "DESC"]],
        });
        result.response = "success";
        result.data = employees;
        res.status(200).send(result);
      } catch (err) {
        next(err);
      }
    }
  },
  /**
   * Add OR Edit
   */
  async addOREdit(req, res, next) {
    let result = {};
    let errors = [];
    if (!req.is("application/json")) {
      errors.push({ msg: "Expects application/json" });
      return res.status(200).send(errors);
    }

    const {
      id,
      fullname,
      dob,
      gender,
      salary,
      designation,
      createdBy,
      updatedBy,
    } = req.body;

    if (validator.isEmpty(fullname)) {
      errors.push({
        msg: "Please enter a valid fullname.",
      });
    }

    if (!moment(dob).isValid()) {
      errors.push({
        msg: "Please enter a valid date of birth.",
      });
    }

    if (gender === "") {
      errors.push({
        msg: "Please enter a gender.",
      });
    }

    if (salary <= 0) {
      errors.push({
        msg: "Please enter a valid salary.",
      });
    }

    if (validator.isEmpty(designation)) {
      errors.push({
        msg: "Please enter a valid designation.",
      });
    }

    if (errors.length > 0) {
      result.success = "error";
      result.error = errors;
      return res.status(200).send(result);
    }

    try {
      if (id === undefined) {
        // Add
        await Employee.build(req.body)
          .save()
          .then((inserted) => {
            if (inserted) {
              result.response = "success";
              result.id = inserted.id;
              res.status(200).send(result);
            }
          })
          .catch((error) => {
            result.response = "error";
            errors.push({ msg: error });
            result.errors = errors;
            return res.status(200).send(error);
          });
      } else {
        // Edit
        const employee = await Employee.findOne({
          where: {
            id,
          },
        });
        if (employee) {
          await Employee.update(req.body, { where: { id } })
            .then((updateData) => {
              if (updateData[0] === 1) {
                result.response = "success";
                res.status(200).send(result);
              } else {
                result.response = "error";
                res.status(200).send(result);
              }
            })
            .catch((error) => {
              result.response = "error";
              errors.push({ msg: error });
              result.errors = errors;
              return res.status(200).send(result);
            });
        }
      }
    } catch (err) {
      next(err);
    }
  },
  /**
   * Delete Employee
   */
  async delete(req, res, next) {
    let result = {};
    let errors = [];

    if (!req.is("application/json")) {
      errors.push({ msg: "Expects application/json" });
      return res.status(200).send(errors);
    }
    if (!req.body.id) {
      errors.push({ msg: "Id can not be null." });
    }

    if (errors.length > 0) {
      result.response = "error";
      result.error = errors;
      res.status(200).send(result);
    }

    const { id } = req.body;
    try {
      const employee = await Employee.findOne({
        where: { id },
      });
      if (employee) {
        await Employee.destroy({
          where: { id },
        })
          .then((isDelete) => {
            if (isDelete === 1) {
              result.response = "success";
              res.status(200).send(result);
            }
          })
          .catch((error) => {
            result.response = "error";
            errors.push({ msg: error });
            result.errors = errors;
            return res.status(200).send(result);
          });
      } else {
        result.response = "error";
        errors.push({ msg: "ID not found." });
        result.error = errors;
        res.status(200).send(result);
      }
    } catch (err) {
      next(err);
    }
  },
  /**
   * Bulk Import Excel sheet data
   */
  async bulkImportData(req, res, next) {
    if (req?.file?.filename) {
      const workbook = XLSX.readFile(
        __basedir + "/public/" + req.file.filename,
        {
          cellDates: true,
          cellText: false,
        }
      );
      const sheetNameList = workbook.SheetNames;
      try {
        const empData = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetNameList[0]],
          {
            range: 0,
            header: 0,
            dateNF: "YYYY-MM-DD",
          }
        );
        if (empData.length > 0) {
          const excelData = await empData.map(async (excelDatas, index) => {
            //SET up data
            const empDataRecord = {
              fullname: excelDatas["Full Name"],
              dob: excelDatas["Date of Birth"],
              gender: excelDatas["Gender"],
              salary: excelDatas["Salary"],
              designation: excelDatas["Designation"],
              createdBy: 1,
              updatedBy: 1,
            };
            return await Employee.build(empDataRecord)
              .save()
              .then(() => {
                return {
                  response: "success",
                };
              })
              .catch((error) => {
                console.log("========Error========");
                let rowNo = index + 2;
                return {
                  response: "error",
                  rowNo,
                  errorMSG: `X row ${rowNo} were skipped since they did not have data`,
                };
              });
          });
          const response = await Promise.all(excelData);
          fs.unlinkSync(__basedir + "/public/" + req.file.filename);
          res.status(200).send(response);
        }
      } catch (err) {
        next(err);
      }
    }
  },
  /**
   * Add Picture
   */
  async addPicture(req, res, next) {
    let result = {};
    if (req?.file?.filename) {
      const filename = req.file.filename;
      const id = req.body.id;
      try {
        const employee = await Employee.findOne({
          where: {
            id,
          },
        });
        const pic = employee.picture;
        if (fs.existsSync(__basedir + "/public/" + pic)) {
          fs.unlinkSync(__basedir + "/public/" + pic);
        }
        await Employee.update({ picture: filename }, { where: { id } })
          .then((updateData) => {
            console.log("Update", updateData);
            if (updateData[0] === 1) {
              result.response = "success";
              result.filename = filename;
              res.status(200).send(result);
            } else {
              result.response = "error";
              res.status(200).send(result);
            }
          })
          .catch((error) => {
            result.response = "error";
            errors.push({ msg: error });
            result.errors = errors;
            return res.status(200).send(result);
          });
      } catch (err) {
        next(err);
      }
    }
  },
};
