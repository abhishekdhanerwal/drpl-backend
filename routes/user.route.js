const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.post('/login', userController.login);
router.post('/getAll', userController.getAll);
router.post('/getActiveList', userController.getActiveUsers);
router.post('/dashboard', userController.getActiveUsersSortedByMonthlySale);
router.post('/register', userController.register);
router.post('/toggleActive', userController.toggleStatus);
router.post('/getUserNumber', userController.getUserNumber);
router.post('/:id', userController.userDetails);

module.exports = router;