// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// const mongoose = require('mongoose');

// let _db;

// const url = 'mongodb://localhost:27017/drpl';

// mongoose.connect(url, { useNewUrlParser: true }).then()

// const mongoConnect = (callback) => {
//     MongoClient.connect(url)
//         .then(result => {
//             console.log('connected');
//             _db = result.db();
//             callback();
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };

// const getDb = () => {
//     if(_db){
//         return _db;
//     } else {
//         throw 'No DB Founds'
//     }
// }

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;
