"use strict";
const User = require("../models").User;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [
      { username: "admin", password: "admin", role_id: 1, status: 1 },
      { username: "demo", password: "demo", role_id: 2, status: 1 },
    ];
    return await User.bulkCreate(data);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
