const { body, validationResult } = require("express-validator");

async function validatehandle(req, res, next) {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  next();
}

const validateUser = [
  body("username")
    .isString()
    .withMessage("Username must be String")
    .isLength({ min: 3, max: 25 })
    .withMessage("Username must be between min 3 and max 25 Character"),

  body("email").isEmail().withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be min 6 character"),

  validatehandle,
];

module.exports = { validateUser };
