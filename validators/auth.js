const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Must be a Valid Email"),
  check("password").isLength(6).withMessage("Must be a Valid Pass"),
];
