const User = require('../models/User');

exports.createUser = async ({ name, email }) => User.create({ name, email });
