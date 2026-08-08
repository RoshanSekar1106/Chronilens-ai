const { body } = require("express-validator");

exports.symptomValidation = [
  body("symptomName")
    .notEmpty()
    .withMessage("Symptom is required"),

  body("severity")
    .isInt({ min: 1, max: 10 })
    .withMessage("Severity must be between 1 and 10")
];