const userscontroller = require("./../controllers").users;
const employeescontroller = require("./../controllers").employees;
const multer = require("multer");
const passport = require("passport");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

require("../middleware/passport.middleware")(passport);

const middleware = function (req, res, next) {
  // requires auth
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    function (err, user, info) {
      req.authenticated = !!user;
      req.user = user;
      if (!user) {
        return res.send("authentication required for this call");
      }
      next();
    }
  )(req, res, next);
};

const omiddleware = function (req, res, next) {
  // middleware with optional auth
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    function (err, user, info) {
      req.authenticated = !!user;
      req.user = user;
      next();
    }
  )(req, res, next);
};

module.exports = (app) => {
  app.get("/api", (req, res) => {
    res.json({
      status: "success",
      message: "ERM API",
      data: { version_number: "v1.0.0" },
    });
  });

  // User
  app.post("/api/login", userscontroller.login);
  app.get("/api/users", middleware, userscontroller.index); // middleware
  app.post("/api/users/register", middleware, userscontroller.register); // middleware
  app.post("/api/users/delete", middleware, userscontroller.delete); // middleware

  // Employee
  app.get("/api/employees/:id?", middleware, employeescontroller.index); // middleware
  app.post(
    "/api/employees/addOREdit",
    middleware,
    employeescontroller.addOREdit
  ); // middleware
  app.post("/api/employees/delete", middleware, employeescontroller.delete); // middleware
  app.post(
    "/api/employees/bulkImportData",
    upload.single("file"),
    middleware,
    employeescontroller.bulkImportData
  ); // middleware
  app.post(
    "/api/employees/addPicture",
    upload.single("file"),
    middleware,
    employeescontroller.addPicture
  ); // middleware
};
