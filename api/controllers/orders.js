const orderSchema = require('../../models/order');
const productSchema = require('../../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res) => {
    orderSchema.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(foundOrders => {
            if (foundOrders.length > 0) {
                res.status(200).json({
                    count: foundOrders.length,
                    success: "true",
                    message: "Orders Found Successfully",

                    orders: foundOrders.map(foundOrder => {
                        return {
                            _id: foundOrder._id,
                            product: foundOrder.product,
                            quantity: foundOrder.quantity,
                            request: {
                                type: 'Get',
                                url: 'http://localhost:3000/orders/' + foundOrder._id
                            }
                        }
                    })
                })

            } else {
                res.status(404).json({
                    count: foundOrders.length,
                    success: "true",
                    message: "Orders  NotFound ",
                    orders: foundOrders
                })
            }
        }).catch(err => res.status(500).json({
            success: "false",
            message: "No Orders Found",
            error: err
        }))
}

exports.orders_create = (req, res) => {
    console.log(req.file)
    productSchema.findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    success: "false",
                    message: 'No Products found'
                })
            }
            const order = new orderSchema({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            return order.save()

        }).then(orders => {
            res.status(200).json({
                success: 'true',
                message: 'Order Created And Stored'
                , createdOrder: {
                    _id: orders._id,
                    product: orders.productId,
                    quantity: orders.quantity
                }, request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + orders._id
                }
            })
        }).catch(err => res.status(500).json({
            error: err,
            message: 'unable To Add Product',
            success: "false"
        }))

}
exports.delete_All = (req, res) => {
    orderSchema.remove({})
        .exec().then(result => {
            res.status(200).json({
                success: "true",
                message: "Deleted All Orders",
                request: {
                    type: 'Post',
                    url: 'http://localhost:3000/orders',
                    body: { productId: "Id", quantity: "Number" }
                }
            })
        }).catch(err => res.status(500).json({ error: err, success: "false", message: "unable to delete" }))
}
exports.get_One = (req, res) => {
    orderSchema.findById({ _id: req.params.orderId })
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({ success: "true", message: "not Found", foundOrder: order })
            }

            res.status(200).json({ success: "true", message: "Order Found", foundOrder: order })
        })
        .catch(err => res.status(200).json({ success: "false", message: "Error Occured", error: err }))

}

exports.delete_One = (req, res) => {
    orderSchema.remove({ _id: req.params.prodId })
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({ success: "true", message: "nothing to Delete" })
            }

            res.status(200).json({
                success: "true", message: "Successfully Deleted", request: {
                    type: 'Post',
                    url: 'http://localhost:3000/orders',
                    body: { productId: "Id", quantity: "Number" }
                }
            })
        })
        .catch(err => res.status(200).json({ success: "false", message: "Error Occured", error: err }))

}