
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

        let user = await UserModel.findOne({id : req.body.leaderId});
        let parentUser = await UserModel.findOne({id: user.parentId});
        
        const income = new IncomeModel(Object.assign( {}, 
            {
                date: `${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`,
                leaderId: req.body.leaderId,
                purchasedAmount: ( Math.floor(req.body.totalSaleCost * 100) / 100 )
            }, incomeGenerated)
        );

        const income2 = new IncomeModel({
            date: `${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`,
            leaderId: user.parentId,
            childrenId: req.body.leaderId,
            sponsoredIncome: ( Math.floor((Number(req.body.totalSaleCost)*0.10) * 100) / 100 )
        });

        user.totalSale = Number(user.totalSale) + Number(req.body.totalSaleCost);
        user.totalSale = ( Math.floor(user.totalSale * 100) / 100 );
        if(user.monthlySale){
            let newMonthlySale = {...user.monthlySale};
            newMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] = newMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] ? (Number(newMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`]) + Number(req.body.totalSaleCost)) : Number(req.body.totalSaleCost);
            newMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] = (Math.floor(newMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] * 100) / 100);
            user.monthlySale = newMonthlySale;

        } else {
            user.monthlySale = {};
            user.monthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] = ( Math.floor(req.body.totalSaleCost * 100) / 100 );
        }

        parentUser.totalSponsorIncome = Number(parentUser.totalSponsorIncome) + (Number(req.body.totalSaleCost)*0.10);
        parentUser.totalSponsorIncome = ( Math.floor(parentUser.totalSponsorIncome * 100) / 100 );
        if(parentUser.monthlySponsorIncome) {
            let newSponsorMonthlySale = {...parentUser.monthlySponsorIncome};
            newSponsorMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] = newSponsorMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] ? (Number(newSponsorMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`]) + (Number(req.body.totalSaleCost)*0.10)) : (Number(req.body.totalSaleCost)*0.10);
            newSponsorMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] = ( Math.floor(newSponsorMonthlySale[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] * 100) / 100 ); 
            parentUser.monthlySponsorIncome = newSponsorMonthlySale;
        } else {
            parentUser.monthlySponsorIncome = {};
            parentUser.monthlySponsorIncome[`${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`] = ( Math.floor((req.body.totalSaleCost*0.10) * 100) / 100 );
        }

        await income.save();
        await income2.save();
        await user.save();
        await parentUser.save();

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
    console.log('asd')
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