const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

exports.createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});
