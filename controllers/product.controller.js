const ProductModel = require('../models/product.model');
const StockModel = require('../models/stock.model');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

exports.save = async (req, res, next) => {
    jwt.verify(req.body.token, config.jwtSecretKey, async function (err, decoded) {
        if (err || (decoded.id !== req.body.id)) {
            res.status(401).json({ err: 'Token expired' });
        } else {
            let request = { ...req.body.productInfo };

            if (request.image[0]) {
                const split = request.image[0].dataURL.split(','); // or whatever is appropriate here. this will work for the example given
                const base64string = split[1];
                const buffer = Buffer.from(base64string, 'base64');
        
                request.image = buffer;
            } else {
                request.image = "";
            }
        
            const Product = new ProductModel({ ...request, productId: request.name.slice(0, 2).toLowerCase() + new Date().getTime(), creationDate: new Date(), updatedDate: new Date(), active: true })
        
            try {
                const result = await Product.save();
                let stockResult;
                if (req.body.stock.purchasedStock) {
                    const Stock = new StockModel({ ...req.body.stock, productId: result.productId });
                    stockResult = await Stock.save();
                }
                res.json({ result, stockResult });
            } catch (err) {
                res.status(500).json(err);
            }
        }
    }); 
}

/* http://localhost:8080/shop/8237hjsdb?edit=true */
exports.getAll = (req, res, next) => {

    jwt.verify(req.body.token, config.jwtSecretKey, async function (err, decoded) {
        if (err || (decoded.id !== req.body.id)) {
            res.status(401).json({ err: 'Token expired' });
        } else {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const currentDate = new Date().getDate();

            try {
                let result = await ProductModel.find();
                let stockList = await StockModel.find({ 'date': { '$gte': new Date(currentYear, currentMonth, 1), '$lt': new Date(currentYear, (currentMonth + 1), 0) } });
                let stock = stockList.reduce((accumulator, currentValue) => {
                    accumulator[currentValue.productId] = currentValue.purchasedStock || currentValue.openingStock ? (accumulator[currentValue.productId] ? accumulator[currentValue.productId] : 0) + Number(currentValue.purchasedStock || currentValue.openingStock) : (accumulator[currentValue.productId] ? accumulator[currentValue.productId] : 0) - Number(currentValue.productSale);
                    return accumulator;
                }, {});
                res.json({ result, stock });
            } catch (err) {
                res.status(500).json(err);
            }
        }
    });
}

exports.getActiveProducts = async (req, res, next) => {
    jwt.verify(req.body.token, config.jwtSecretKey, async function (err, decoded) {
        if (err || (decoded.id !== req.body.id)) {
            res.status(401).json({ err: 'Token expired' });
        } else {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const currentDate = new Date().getDate();

            try {
                let result = await ProductModel.find({ active: true });
                let stockList = await StockModel.find({ 'date': { '$gte': new Date(currentYear, currentMonth, 1), '$lt': new Date(currentYear, (currentMonth + 1), 0) } });
                let stock = stockList.reduce((accumulator, currentValue) => {
                    accumulator[currentValue.productId] = currentValue.purchasedStock || currentValue.openingStock ? (accumulator[currentValue.productId] ? accumulator[currentValue.productId] : 0) + Number(currentValue.purchasedStock || currentValue.openingStock) : (accumulator[currentValue.productId] ? accumulator[currentValue.productId] : 0) - Number(currentValue.productSale);
                    return accumulator;
                }, {});
                res.json({ result, stock });
            } catch (err) {
                res.status(500).json(err);
            }
        }
    });
}

exports.getProduct = async (req, res, next) => {
    jwt.verify(req.body.token, config.jwtSecretKey, async function (err, decoded) {
        if (err || (decoded.id !== req.body.id)) {
            res.status(401).json({ err: 'Token expired' });
        } else {
            try {
                const product = await ProductModel.findOne({ productId: req.params.id });
                let stock = await StockModel.find({ productId: req.params.id }).lean();
                stock.sort((a, b) => new Date(a.date) - new Date(b.date));
                res.json({ product, stock });
            } catch (err) {
                res.status(500).json(err);
            }
        }
    });
}

exports.updateProduct = async (req, res, next) => {
    jwt.verify(req.body.token, config.jwtSecretKey, async function (err, decoded) {
        if (err || (decoded.id !== req.body.id)) {
            res.status(401).json({ err: 'Token expired' });
        } else {
            try {
                let request = { ...req.body.productInfo };
                if (request.image[0]) {
                    const split = request.image[0].dataURL.split(','); // or whatever is appropriate here. this will work for the example given
                    const base64string = split[1];
                    const buffer = Buffer.from(base64string, 'base64');

                    request.image = buffer;
                } else {
                    request.image = "";
                }
                let stockResult = {};
                request.updatedDate = new Date();
                const result = await ProductModel.updateOne({ productId: request.productId }, request);
                if (req.body.stock.purchasedStock) {
                    const Stock = new StockModel({ ...req.body.stock, productId: request.productId });
                    stockResult = await Stock.save();
                }
                res.json({ result, stockResult });
            } catch (err) {
                console.log('err', err);
                res.status(500).json(err);
            }
        }
    });
}

exports.toggleStatus = async (req, res, next) => {
    jwt.verify(req.body.token, config.jwtSecretKey, async function (err, decoded) {
        if (err || (decoded.id !== req.body.id)) {
            res.status(401).json({ err: 'Token expired' });
        } else {
            try {
                const product = await ProductModel.updateOne({ productId: req.body.productId }, { active: req.body.status });
                res.json(product);
            } catch (err) {
                res.status(500).json(err);
            }
        }
    });
}