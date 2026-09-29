const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFilter = ({ userId, category, fromDate, toDate }) => {
  const filter = {};
  if (userId) filter.userId = new mongoose.Types.ObjectId(userId);
  if (category) filter.category = { $regex: `^${escapeRegex(category.trim())}$`, $options: 'i' };
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate) {
      const end = new Date(toDate);
      // date-only value => include the whole day
      if (/^\d{4}-\d{2}-\d{2}$/.test(toDate)) end.setUTCHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }
  return filter;
};

const findOrFail = async (id) => {
  const expense = await Expense.findById(id);
  if (!expense) throw new AppError('Expense not found', 404);
  return expense;
};

exports.createExpense = async ({ userId, title, amount, category, description }) => {
  if (!(await User.exists({ _id: userId }))) throw new AppError('User not found', 404);
  return Expense.create({ userId, title, amount, category, description });
};

exports.getExpenses = async (q) => {
  const page = parseInt(q.page, 10) || 1;
  const limit = parseInt(q.limit, 10) || 10;
  const filter = buildFilter(q);

  const [data, total] = await Promise.all([
    Expense.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Expense.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

exports.getExpenseById = findOrFail;

exports.updateExpense = async (id, body) => {
  const expense = await findOrFail(id);
  ['title', 'amount', 'category', 'description'].forEach((k) => {
    if (body[k] !== undefined) expense[k] = body[k];
  });
  return expense.save();
};

exports.deleteExpense = async (id) => {
  const expense = await Expense.findByIdAndDelete(id);
  if (!expense) throw new AppError('Expense not found', 404);
};

exports.getSummary = async (q) => {
  const [result] = await Expense.aggregate([
    { $match: buildFilter(q) },
    {
      $facet: {
        overall: [{ $group: { _id: null, totalAmount: { $sum: '$amount' }, totalCount: { $sum: 1 } } }],
        byCategory: [
          { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
          { $sort: { total: -1 } },
        ],
      },
    },
  ]);

  const overall = result.overall[0] || { totalAmount: 0, totalCount: 0 };
  return {
    totalAmount: overall.totalAmount,
    totalCount: overall.totalCount,
    byCategory: result.byCategory.map((c) => ({ category: c._id, total: c.total, count: c.count })),
  };
};
