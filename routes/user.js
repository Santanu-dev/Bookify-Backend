const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {userPurchaseList, getUserById, getUser, getAllUsers, updateUser } = require("../controllers/user");

router.param("userId" , getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.get("/user/allUsers/:userId", isSignedIn, isAuthenticated, isAdmin, getAllUsers);
router.get("/user/order/:userId", isSignedIn, isAuthenticated, userPurchaseList)

module.exports = router;