const express = require('express');
const router = express.Router();
const e = require("express");
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

// Handle incomin GET requests to /oders
router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create);

router.get('/:orderId', checkAuth, OrdersController.orders_get_by_id);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_by_id);

module.exports = router;