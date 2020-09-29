const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

router.post('/save', productController.save);

router.post('/getAll', productController.getAll);

router.post('/getActiveList', productController.getActiveProducts);

router.post('/getProduct/:id', productController.getProduct);

router.post('/update', productController.updateProduct);

router.post('/toggleStatus', productController.toggleStatus);

router.post('/setNextMonthStock', productController.setNextMonthStock);

module.exports = router;