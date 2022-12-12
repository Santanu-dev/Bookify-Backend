const express = require('express');
const router = express.Router();

const {getCategoryById, createCategory, getCategory, getAllCategories, updateCategory, removeCategory} = require("../controllers/category");
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

/* 
    when there is :userId or :categorId
    it automatically fire up the router params 
*/
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory)

module.exports = router;