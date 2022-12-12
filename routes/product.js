const express = require('express');
const router = express.Router();

const {getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories, getAllProductsCount, getAllProductsAtOnce, getSearchedProduct} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);
router.param("productId", getProductById);

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);
router.get("/product/:productId", getProduct);
//photo of the product loads separately
router.get("/product/photo/:productId", photo);

router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);

router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//all products listing
router.get("/products", getAllProducts)
router.get("/all/products", getAllProductsAtOnce)
router.get("/products/count", getAllProductsCount)

//get Search product
router.get("/search/results/products", getSearchedProduct)

router.get("/products/categories", getAllUniqueCategories)

module.exports = router;