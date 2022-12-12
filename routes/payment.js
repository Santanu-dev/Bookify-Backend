const express = require('express');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getToken, processPayment } = require('../controllers/payment');
const { getUserById } = require('../controllers/user');
const router = express.Router();

router.param("userId", getUserById);

router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);
router.post("/make/payment/:userId", isSignedIn, isAuthenticated, processPayment);

module.exports = router;