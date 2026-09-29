const { body } = require('express-validator');

exports.createUser = [
  body('name').isString().withMessage('name is required').bail().trim().notEmpty().withMessage('name is required'),
  body('email')
    .isString().withMessage('email is required').bail()
    .trim().notEmpty().withMessage('email is required').bail()
    .isEmail().withMessage('email is invalid'),
];
