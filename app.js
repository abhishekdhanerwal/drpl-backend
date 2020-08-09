const chalk = require('chalk');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const url = 'mongodb+srv://drpl-admin-3607:ZeMSIaif67GMROvI@cluster0.ohfnm.mongodb.net/<dbname>?retryWrites=true&w=majority';
// 'mongodb://localhost:27017/drpl';
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: false}));

const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route');
const orderRoute = require('./routes/order.route');

/* Application middleware - this always run on each request to out server */
app.use('/', (req, res, next) => {
    console.log(chalk.red('In Application middleware'));
    next();
});

app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/order', orderRoute);

app.get('/', (req, res, next) => {
    res.send('Express server is up and running !!!!')
});

mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true  })
.then(result => {
    app.listen(port, () => {
        console.log(chalk.blue(`Express app listening at http://localhost:${port}`));
    });
})
.catch(err => {
        console.log(chalk.red(err));
});