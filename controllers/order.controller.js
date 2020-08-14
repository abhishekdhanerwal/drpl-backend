
const OrderModel = require('../models/order.model');
const StockModel = require('../models/stock.model');
const UserModel = require('../models/user.model');
const IncomeModel = require('../models/income.model');
const ConfigModel = require('../models/config.model');

exports.create = async(req, res, next) => {
    let incomeGenerated = {};

    try {

        let configuration = await ConfigModel.find().lean();
        const newID = Number(++configuration[0].invoiceId);
        const Order = new OrderModel({
            date: new Date(),
            leaderId: req.body.leaderId,
            products: req.body.items,
            totalSaleCost: req.body.totalSaleCost,
            totalCgst: req.body.totalCgst,
            totalSgst: req.body.totalSgst,
            totalIgst: req.body.totalIgst,
            totalCost: req.body.totalCost,
            orderId: `INV${newID}`
        });

        req.body.items.forEach(async (element) => {
            const Stock = new StockModel({
                date: new Date(),
                productId: element.productId,
                productSale: element.qty
            });
            if(incomeGenerated[element.category])
                incomeGenerated[element.category] += Number(element.qty);
            else
                incomeGenerated[element.category] = Number(element.qty);
            await Stock.save();
        });

        const result = await Order.save();

        const objectId = configuration[0]._id.toString();
        await ConfigModel.updateOne({_id: objectId}, {invoiceId : newID});

        let today = new Date();

        const user = await UserModel.findOne({id : req.body.leaderId}).lean();
        
        const income = new IncomeModel(Object.assign( {}, 
            {
                date: `${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`,
                leaderId: req.body.leaderId,
                purchasedAmount: req.body.totalSaleCost
            }, incomeGenerated)
        );

        const income2 = new IncomeModel({
            date: `${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`,
            leaderId: user.parentId,
            childrenId: req.body.leaderId,
            sponsoredIncome: (Number(req.body.totalSaleCost)*0.10)
        });

        await income.save();
        await income2.save();

        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }

}

exports.getDetail = async(req, res, next) => {

    try {
        const order = await OrderModel.findOne({orderId : req.params.id});
        const user = await UserModel.findOne({id : order.leaderId});
        res.json({order, user});
    } catch (err) {
        res.status(500).json(err);
    }

}

exports.getAll = async(req, res, next) => {

    try{
        const result = await OrderModel.find();
        res.json(result);
    } catch(err){
        res.status(500).json(err);
    }

}

exports.getUserBills = async(req, res, next) => {

    try{
        const result = await OrderModel.find({leaderId : req.body.id});
        res.json(result);
    } catch(err){
        res.status(500).json(err);
    }

}