"use strict";
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, Role } = require("../db/models");

const getUniqueKeyFromBody = function (body) {
  let unique_key = body.username;
  if (typeof unique_key === "undefined") {
    if (typeof body.username != "undefined") {
      unique_key = body.username;
    } else {
      unique_key = null;
    }
  }

  return unique_key;
};
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const authUser = async function (userInfo, callback) {
  //returns token
  let unique_key;
  let auth_info = {};
  auth_info.status = "login";

  unique_key = getUniqueKeyFromBody(userInfo);
  if (!unique_key)
    return callback(new Error("Please enter an username to login"));

  if (!userInfo.password)
    return callback(new Error("Please enter a password to login"));

  let user;

  await User.findOne({
    where: {
      username: unique_key,
      status: 1,
    },
    include: [
      {
        model: Role,
        as: "UserRole",
      },
    ],
  })
    .then((user) => {
      if (user === null) {
        return callback("Not registered");
      } else {
        const result = user.correctPassword(userInfo.password);
        if (result) {
          user
            .update({
              verifyToken: null,
            })
            .then((data) => {
              const { token, expiration } = issueToken(user.id);
              callback(null, { response: "success", token, expiration, user });
            });
        } else {
          return callback(null, { response: "errors" });
        }
      }
    })
    .catch((err) => console.log("Error: " + err));
};
module.exports.authUser = authUser;

function issueToken(userId) {
  const expiration = parseInt(process.env.JWT_EXPIRATION);
  const token =
    "Bearer: " +
    jwt.sign({ user_id: userId }, process.env.JWT_ENCRYPTION, {
      expiresIn: expiration,
    });
  return { token, expiration };
}
