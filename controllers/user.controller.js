const UserModel = require('../models/user.model');
const ConfigModel = require('../models/config.model');

exports.login = async (req, res, next) => {
    const userFromDb = await UserModel.findOne({ id: req.body.id, password: req.body.password }).exec();
    if (userFromDb) {
        try {
            res.json(userFromDb);
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(401).send('Invalid username/password');
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const allUsers = await UserModel.find().exec();
        res.json(allUsers);
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.getActiveUsers = async (req, res, next) => {
    try {
        const allUsers = await UserModel.find({active: true}).exec();
        res.json(allUsers);
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.register = async (req, res, next) => {
    let request = {...req.body.userDetails};
    let parentId = req.body.parentIdDetails.id;

    const isUserFound = await UserModel.findOne({mobile: request.mobile});

    if(!isUserFound){
        try {
            if(request.image[0]){
                const split = request.image[0].dataURL.split(','); // or whatever is appropriate here. this will work for the example given
                const base64string = split[1];
                const buffer = Buffer.from(base64string, 'base64');
            
                request.image = buffer;
            } else {
                request.image = "";
            }
        
            let configuration = await ConfigModel.find().lean();
        
            const newID = Number(++configuration[0].userId);
            let leaderId = request.name.slice(0,2).toLowerCase() + newID;
            
            await UserModel.update({'id':parentId}, {'$addToSet': { 'childrenId': leaderId}});
            
            const User = new UserModel({...request, createdOn : new Date(), parentId, id: leaderId, role: 'seller', active: true});
            const objectId = configuration[0]._id.toString();
            await ConfigModel.updateOne({_id: objectId}, {userId : newID});
            const result = await User.save();
            res.json(result);
        } catch(err){
            res.status(500).json(err);
        }
    } else {
        res.status(550).json({err: "User already registered"});
    }
}

/* http://localhost:8080/user/8237hjsdb?edit=true */
exports.userDetails = (req, res, next) => {
    console.log(req.params);
    console.log(req.query);
    console.log(userModel);
    // const user = userModel('user A','Delhi');
    user.save().then(res => {
        console.log(res);
        res.json({
            title: 'user A',
            location: 'Delhi'
        })
    }).catch(err => {
        res.json(err)
    });

}

exports.toggleStatus = async(req, res, next) => {
    try{
        const user = await UserModel.updateOne({id:req.body.id}, {active: req.body.status});
        res.json(user);
    } catch(err){
        res.status(500).json(err);
    }
}