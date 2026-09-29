const expenseService = require('../services/expense.service');
const asyncHandler = require('../utils/asyncHandler');

exports.createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body);
  res.status(201).json({ success: true, data: expense });
});

exports.getExpenses = asyncHandler(async (req, res) => {
  const { data, pagination } = await expenseService.getExpenses(req.query);
  res.status(200).json({ success: true, data, pagination });
});

exports.getSummary = asyncHandler(async (req, res) => {
  const data = await expenseService.getSummary(req.query);
  res.status(200).json({ success: true, data });
});

exports.getExpenseById = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.id);
  res.status(200).json({ success: true, data: expense });
});

exports.updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.params.id, req.body);
  res.status(200).json({ success: true, data: expense });
});

exports.deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.params.id);
  res.status(200).json({ success: true, message: 'Expense deleted successfully' });
});
