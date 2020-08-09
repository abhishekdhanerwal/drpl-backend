const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.post('/login', userController.login);

router.post('/getAll', userController.getAll);

router.post('/getActiveList', userController.getActiveUsers);

router.post('/register', userController.register);

router.get('/:id', userController.userDetails);

router.post('/toggleStatus', userController.toggleStatus)

module.exports = router;