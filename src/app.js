const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const expenseRoutes = require('./routes/expense.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ success: true, message: 'Expense Management API is running' }));
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
