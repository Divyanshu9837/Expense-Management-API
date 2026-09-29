const router = require('express').Router();
const controller = require('../controllers/expense.controller');
const v = require('../validations/expense.validation');
const validate = require('../middleware/validate');

router.post('/', v.createExpense, validate, controller.createExpense);
router.get('/', v.listExpenses, validate, controller.getExpenses);
router.get('/summary', v.summary, validate, controller.getSummary); // must be before /:id
router.get('/:id', v.expenseId, validate, controller.getExpenseById);
router.put('/:id', v.updateExpense, validate, controller.updateExpense);
router.delete('/:id', v.expenseId, validate, controller.deleteExpense);

module.exports = router;
