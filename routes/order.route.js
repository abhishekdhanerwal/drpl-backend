const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');

router.post('/create', orderController.create);
router.post('/getDetail/:id', orderController.getDetail);
router.post('/getAll', orderController.getAll);
router.post('/getbyId', orderController.getUserBills);
router.post('/dashboard', orderController.getCurrentOrdersById);

module.exports = router;