const AppError = require('../utils/AppError');

const notFound = (req, res, next) =>
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON body';
  } else if (!err.isOperational) {
    console.error(err);
    statusCode = 500;
    message = /^Mongo|^Mongoose/.test(err.name || '') ? 'Database error' : 'Internal server error';
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
