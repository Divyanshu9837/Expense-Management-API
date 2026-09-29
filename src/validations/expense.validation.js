const { body, param, query } = require('express-validator');

const idParam = param('id').isMongoId().withMessage('Invalid expense id');

const amountRule = (optional) => {
  const chain = body('amount');
  if (optional) chain.optional();
  else chain.exists({ values: 'undefined' }).withMessage('amount is required').bail();
  return chain.isFloat({ gt: 0 }).withMessage('amount must be a number greater than 0').toFloat();
};

const textRule = (field, optional) => {
  const chain = body(field);
  if (optional) chain.optional();
  return chain
    .isString().withMessage(`${field} is required`).bail()
    .trim().notEmpty().withMessage(`${field} is required`);
};

const filterRules = [
  query('fromDate').optional().isISO8601().withMessage('fromDate must be a valid date (YYYY-MM-DD)'),
  query('toDate').optional().isISO8601().withMessage('toDate must be a valid date (YYYY-MM-DD)'),
  query('toDate').custom((toDate, { req }) => {
    const { fromDate } = req.query;
    if (toDate && fromDate && new Date(fromDate) > new Date(toDate)) {
      throw new Error('fromDate cannot be after toDate');
    }
    return true;
  }),
  query('userId').optional().isMongoId().withMessage('Invalid userId'),
  query('category').optional().isString().withMessage('category must be a string'),
];

exports.createExpense = [
  body('userId').exists({ values: 'undefined' }).withMessage('userId is required').bail()
    .isMongoId().withMessage('Invalid userId'),
  textRule('title', false),
  amountRule(false),
  textRule('category', false),
  body('description').optional({ nullable: true }).isString().withMessage('description must be a string'),
];

exports.updateExpense = [
  idParam,
  textRule('title', true),
  amountRule(true),
  textRule('category', true),
  body('description').optional({ nullable: true }).isString().withMessage('description must be a string'),
  body().custom((b) => {
    if (!['title', 'amount', 'category', 'description'].some((k) => b[k] !== undefined)) {
      throw new Error('Provide at least one field to update');
    }
    return true;
  }),
];

exports.expenseId = [idParam];

exports.listExpenses = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be an integer between 1 and 100'),
  ...filterRules,
];

exports.summary = filterRules;
