"use strict";
const Employee = require("../models").Employee;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [
      {
        fullname: "Alan Rai",
        dob: "2000-11-03",
        gender: 1,
        salary: 120000.2,
        designation: "HR Manager",
        createdBy: 1,
      },
      {
        fullname: "Hare Oman",
        dob: "1999-11-03",
        gender: 1,
        salary: 121000,
        designation: "Software Developer",
        createdBy: 1,
      },
      {
        fullname: "Alicia Clerk",
        dob: "1999-11-03",
        gender: 0,
        salary: 11000.12,
        designation: "Electrician",
        createdBy: 1,
      },
    ];
    return await Employee.bulkCreate(data);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("employees", null, {});
  },
};
