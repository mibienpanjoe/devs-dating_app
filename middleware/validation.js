const { body, validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  handleValidationErrors
]

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  handleValidationErrors
]

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors
}