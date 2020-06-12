var express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth')
const controller = require('../controllers/orders')
const orderSchema = require('../../models/order')
const productSchema = require('../../models/product')


router.get('/orders', auth, controller.orders_get_all)
router.post('/orders', auth, controller.orders_create);
router.delete('/orders', auth, controller.delete_All);
router.get('/orders/:orderId', auth, controller.get_One)
router.delete('/orders/:prodId', auth, controller.delete_One)




module.exports = router;