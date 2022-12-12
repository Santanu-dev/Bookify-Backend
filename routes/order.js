const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, addOrdersToPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product")
const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateOrderStatus, getMyOrderStatus, getOrderByTransactionId } = require("../controllers/order")

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);
router.param("transId", getOrderByTransactionId);

//routes
router.post("/order/placeOrder/:userId", isSignedIn, isAuthenticated, addOrdersToPurchaseList, updateStock, createOrder);
router.get("/order/allOrders/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus)
router.get("/order/status/:userId/:transId", isSignedIn, isAuthenticated, getMyOrderStatus)
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateOrderStatus)

module.exports = router;