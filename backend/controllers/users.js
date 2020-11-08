const { User, Role } = require("./../db/models");
const validator = require("validator");
const authService = require("./../services/auth.services");

module.exports = {
  /**
   * List of Users
   */
  async index(req, res, next) {
    try {
      const data = await User.findAll({
        include: [
          {
            model: Role,
            as: "UserRole",
          },
        ],
      });
      const users = data.map((user) => {
        return {
          id: user.id,
          username: user.username,
          status: user.status ? "active" : "inactive",
          role: user.UserRole.type,
        };
      });
      res.status(200).send(users);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Login User
   */
  async login(req, res, next) {
    let result = {};
    let errors = [];

    if (!req.is("application/json")) {
      errors.push({ msg: "Expects 'application/json'" });
      return res.status(200).send(errors);
    }

    /** username and Password Validation */
    if (validator.isEmpty(req.body.username)) {
      errors.push({ msg: "Please enter a valid username." });
    }

    if (validator.isEmpty(req.body.password)) {
      errors.push({ msg: "Please enter a password." });
    }

    if (errors.length > 0) {
      result.response = "error";
      result.errors = errors;
      return res.status(200).send(result);
    }

    try {
      await authService.authUser(req.body, (err, data) => {
        if (err) {
          errors.push({ msg: err });
          result.response = "errors";
          result.errors = errors;
          return res.status(200).send(result);
        }
        // no user
        if (data.response === "errors") {
          errors.push({ msg: "Please check username/password" });
          result.response = "errors";
          result.errors = errors;
          return res.status(200).send(result);
        }
        res.status(200).send(data);
      });
    } catch (err) {
      next(err);
    }
  },
  /**
   * Register User
   */
  async register(req, res, next) {
    let result = {};
    let errors = [];

    if (!req.is("application/json")) {
      errors.push({ msg: "Expects 'application/json'" });
      return res.status(200).send(errors);
    }

    /** Validation for username and password */
    const { username, password, role_id, status } = req.body;

    if (validator.isEmpty(username)) {
      errors.push({
        msg: "Please enter a valid username.",
      });
    }

    if (validator.isEmpty(password)) {
      errors.push({
        msg: "Please enter a password.",
      });
    }

    if (errors.length > 0) {
      result.response = "error";
      result.errors = errors;
      return res.status(200).send(result);
    }

    try {
      await User.create({ username, password, status, role_id })
        .then((newUser) => {
          result.response = "success";
          result.userId = newUser.id;
          res.status(201).send(result);
        })
        .catch((error) => {
          let sequelizeError = {};
          if (error.name === "SequelizeUniqueConstraintError") {
            sequelizeError = error.errors[0].message;
          }
          result.response = "error";
          errors.push({
            msg: sequelizeError,
          });
          result.errors = errors;
          return res.status(200).send(result);
        });
    } catch (err) {
      next(err);
    }
  },
  /**
   * Delete User
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
      const user = await User.findOne({
        where: { id },
      });
      if (user) {
        await User.destroy({
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
};
