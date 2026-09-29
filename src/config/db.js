const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URL;
  if (!uri) throw new Error('MONGO_URL is not defined in environment');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

module.exports = connectDB;
