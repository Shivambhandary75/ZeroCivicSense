const { body, validationResult } = require("express-validator");

// Middleware to return validation errors as response
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors
        .array()
        .map((e) => e.msg)
        .join(", "),
    });
  }
  next();
};

// Register validators
const registerValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role")
    .optional()
    .isIn(["citizen", "authority", "contractor", "official"])
    .withMessage("Invalid role"),
];

// Login validators
const loginValidators = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Ticket validators
const ticketValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("lat")
    .notEmpty()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Valid latitude is required"),
  body("lng")
    .notEmpty()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Valid longitude is required"),
];

module.exports = {
  validate,
  registerValidators,
  loginValidators,
  ticketValidators,
};
