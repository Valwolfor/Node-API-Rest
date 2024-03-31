const Order = require("../models/order");
const mongoose = require("mongoose");

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .then(result => {

            res.status(200).json({
                message: 'Orders retrieved successfully',
                description: 'Get all orders',
                count: result.length,
                orders: result.map(doc => {
                    return {
                        order: {
                            _id: doc._id,
                            quantity: doc.quantity,
                            product: doc.product
                        },
                        request: {
                            type: 'GET',
                            url: 'https://localhost:3000/orders/' + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            console.error('Fail getting orders:', err);
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_create = (req, res, next) => {
    //validation
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order(
                {
                    _id: new mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: product._id
                }
            );
            return order

                .save()
                .then(result => {
                    res.status(201).json({
                        message: 'Order created.',
                        description: 'Create a order with the product and quantity.',
                        order: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: 'GET',
                            url: 'https://localhost:3000/orders/' + result._id,
                        }
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        });
}

exports.orders_get_by_id = (req, res, next) => {

    const id = req.params.orderId;

    Order.findById(id)
        .select('product quantity _id')
        .populate('product', 'name')
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'Order retrieved.',
                    description: 'Get one order by id of order.',
                    data: result,
                    request: {
                        type: 'GET',
                        url: 'https://localhost:3000/orders/'
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for that id"
                });
            }

        })
        .catch(err => {

            res.status(500).json({
                error: err
            });
        });
}

exports.orders_delete_by_id = (req, res, next) => {
    const id = req.params.orderId;
    Order.findByIdAndDelete(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Order not found.'
                });
            }

            res.status(200).json({
                message: 'Order deleted.',
                description: 'Delete order by id',
                data: result,
                request: {
                    type: 'POST',
                    url: 'https://localhost:3000/orders/',
                    body: {productId: "ID", quantity: "Number"},
                    warning: 'The field productId must be a valid id of a existing product'
                }
            })
        })
        .catch(err => {
            console.error('Fail to delete order with id:', err);
            res.status(500).json({
                error: err
            })
        });
}

