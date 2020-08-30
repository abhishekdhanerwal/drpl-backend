const UserModel = require('../models/user.model');
const ConfigModel = require('../models/config.model');
const jwt = require('jsonwebtoken');
const smsApi = require('../utils/smsApi');
const config = require('../utils/config');
const CryptoJS = require('crypto-js');

exports.login = async (req, res, next) => {
    const userFromDb = await UserModel.findOne({ id: req.body.id}).exec();
    if (userFromDb) {
        try {
            const plainPasswordFromDb = CryptoJS.AES.decrypt(userFromDb.password, config.encryptionSecretKey).toString(CryptoJS.enc.Utf8);
            const plainPasswordFromUser = CryptoJS.AES.decrypt(req.body.password, config.encryptionSecretKey).toString(CryptoJS.enc.Utf8);
            
            if(plainPasswordFromDb === plainPasswordFromUser){
                let token = jwt.sign({
                    id: req.body.id,
                    city: userFromDb.city,
                    state: userFromDb.state
                }, config.jwtSecretKey, { expiresIn: '3d' });
                res.json({ userFromDb, token });
            } else {
                res.status(401).send('Invalid password');
            }
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(401).send('Invalid username');
    }
}

exports.getAll = async (req, res, next) => {
    jwt.verify(req.body.token, config.jwtSecretKey, async function (err, decoded) {
        if (err || (decoded.id !== req.body.id)) {
            res.status(401).json({ err: 'Token expired' });
        } else {
            try {
                const allUsers = await UserModel.find().exec();
                res.json(allUsers);
            } catch (err) {
                res.status(500).send(err);
            }
        }
    });
}

exports.getActiveUsers = async (req, res, next) => {
    try {
        const allUsers = await UserModel.find({ active: true }).exec();
        res.json(allUsers);
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.getActiveUsersSortedByMonthlySale = async (req, res, next) => {
    jwt.verify(req.body.token, config.jwtSecretKey, async function (err, decoded) {
        if (err || (decoded.id !== req.body.id)) {
            res.status(401).json({ err: 'Token expired' });
        } else {
            let today = new Date();
            try {
                const allUsers = await UserModel.find({ active: true, role: "seller" }).sort({ [`monthlySale.${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`]: -1 });
                res.json(allUsers);
            } catch (err) {
                res.status(500).send(err);
            }
        }
    });
}

exports.register = async (req, res, next) => {
    let request = { ...req.body.userDetailsRequest };
    let parentId = req.body.parentIdDetails.id;

    const isUserFound = await UserModel.findOne({ mobile: request.mobile });

    if (!isUserFound) {
        try {
            // request.password = CryptoJS.AES.decrypt(request.password, config.encryptionSecretKey).toString(CryptoJS.enc.Utf8);
            // request.accountNumber = CryptoJS.AES.decrypt(request.accountNumber, config.encryptionSecretKey).toString(CryptoJS.enc.Utf8);
            // request.ifscCode = CryptoJS.AES.decrypt(request.ifscCode, config.encryptionSecretKey).toString(CryptoJS.enc.Utf8);
            let plainPassword = CryptoJS.AES.decrypt(request.password, config.encryptionSecretKey).toString(CryptoJS.enc.Utf8);
            if (request.image[0]) {
                const split = request.image[0].dataURL.split(','); // or whatever is appropriate here. this will work for the example given
                const base64string = split[1];
                const buffer = Buffer.from(base64string, 'base64');

                request.image = buffer;
            } else {
                request.image = "";
            }

            let configuration = await ConfigModel.find().lean();

            const newID = Number(++configuration[0].userId);
            let leaderId = request.name.slice(0, 2).toLowerCase() + newID;

            await UserModel.update({ 'id': parentId }, { '$addToSet': { 'childrenId': leaderId } });

            const User = new UserModel({ ...request, createdOn: new Date(), parentId, id: leaderId, role: 'seller', active: true, totalSale: 0, totalSponsorIncome: 0 });
            const objectId = configuration[0]._id.toString();
            await ConfigModel.updateOne({ _id: objectId }, { userId: newID });
            const result = await User.save();
            let token = jwt.sign({
                id: result.id,
                city: result.city,
                state: result.state
            }, config.jwtSecretKey, { expiresIn: '3d' });
            
            smsApi.sendPartnerWelcomeMessage(result.id, plainPassword, result.mobile);

            res.json({ result, token });
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(550).json({ err: "User already registered" });
    }
}

exports.getUserNumber = async (req, res, next) => {
    try {
        const userFromDb = await UserModel.findOne({id: req.body.id});
        if(userFromDb)
            res.json({mobile : userFromDb.mobile});
        else
            res.status(500).send({err: 'Invalid login id'});
    } catch (err) {
        res.status(500).send(err);
    }
}

/* http://localhost:8080/user/8237hjsdb?edit=true */
exports.userDetails = async (req, res, next) => {
    jwt.verify(req.body.token, config.jwtSecretKey, async function (err, decoded) {
        if (err || (decoded.id !== req.body.id)) {
            res.status(401).json({ err: 'Token expired' });
        } else {
            try {
                let userFromDb = await UserModel.findOne({ id: req.params.id }).lean();
                const parentIdDetails = await UserModel.findOne({id: userFromDb.parentId}).lean();
                userFromDb.parentIdDetails = parentIdDetails;
                res.json(userFromDb);
            } catch (err) {
                res.status(500).send(err);
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
                const user = await UserModel.updateOne({ id: req.body.userId }, { active: req.body.status });
                res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
        }
    });
}