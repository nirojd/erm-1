"use strict";

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      type: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "roles",
    }
  );

  return Role;
};
