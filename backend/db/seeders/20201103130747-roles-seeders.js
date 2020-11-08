"use strict";
const Role = require("../models").Role;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [{ type: "admin" }, { type: "staff" }];
    return await Role.bulkCreate(data);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
