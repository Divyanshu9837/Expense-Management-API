const router = require('express').Router();
const controller = require('../controllers/user.controller');
const validations = require('../validations/user.validation');
const validate = require('../middleware/validate');

router.post('/', validations.createUser, validate, controller.createUser);

module.exports = router;
