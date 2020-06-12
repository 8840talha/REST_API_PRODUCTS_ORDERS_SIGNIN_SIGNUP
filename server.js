require('dotenv').config();
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
// require('dotenv').config();
const mongoose = require('mongoose');
var productRoutes = require('./api/routes/products')
var orderRoutes = require('./api/routes/orders')
var userRoutes = require('./api/routes/users')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('uploads'))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Acces-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods',
            'PUT,PATCH,POST,DELETE,GET'
        )
        return res.status(200).json({});
    }
    next();

})

const url = 'mongodb+srv://REST:RESTFUL@cluster0-gakn1.mongodb.net/RESTDB';
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, () => {
    console.log('connected')
});




app.use(morgan('dev'));
app.use(productRoutes);
app.use(orderRoutes);
app.use(userRoutes);

app.use((req, res, next) => {
    const error = new error('Not Found');
    error.status(404);
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});




app.listen(3000, () => {
    console.log('server runnig 0n 3000')
})