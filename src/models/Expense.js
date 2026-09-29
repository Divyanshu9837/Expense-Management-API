const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    title: { type: String, required: [true, 'title is required'], trim: true },
    amount: {
      type: Number,
      required: [true, 'amount is required'],
      validate: {
        validator: (v) => v > 0,
        message: 'amount must be greater than 0',
      },
    },
    category: { type: String, required: [true, 'category is required'], trim: true, index: true },
    description: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

expenseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
