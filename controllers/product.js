const Product = require("../models/product")
const formidable = require('formidable');
const _ = require("lodash");
const fileSys = require('fs');
const product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "Product Not Found !"
            })
        }

        req.product = product;
        next();
    })
}

exports.createProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, (err, fields, file) =>{
        if(err){
            return res.status(400).json({
                error: "Some unexpected Errors occured !"
            })
        }

        //handle fields
        const {name, description, price, category, stock} = fields

        if( 
            !name ||
            !description || 
            !price || 
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "All Fields Mandatory !"
            })
        }

        let product = new Product(fields);

        //max photo size 3 MB , handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "Photo should be less than 3MB !"
                })
            }

            product.photo.data = fileSys.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    err: err,
                    error: "Failed to save to database !"
                })
            }

            res.json(product);
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.deleteProduct = (req, res) => {
    let product = req.product;

    product.remove((error, deletedProduct) => {
        if(error){
            return res.status(400).json({
                error: "Failed to delete!!"
            })
        }

        res.json({
            message: "Deletion success."
        })
    })
    
}

exports.updateProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, (err, fields, file) =>{
        if(err){
            return res.status(400).json({
                error: "Some unexpected Errors occured !"
            })
        }

        //lodash( _ ) will take the product and update with the fields
        let product = req.product;
        product = _.extend(product, fields)

        //max photo size 3 MB , handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "All field are required !"
                })
            }

            product.photo.data = fileSys.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save updated data to DB
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Failed to update the product !!"
                })
            }

            res.json(product);
        })
    })
}

exports.getAllProducts = (req, res) => {

    let pageNo = req.query.p || 0;

    const booksPerPage = 12;

    // let limitListing = req.query.limit ? parseInt(req.query.limit) : 50;
    
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .sort([[sortBy, "asc"]])
        .populate("category")
        .skip(pageNo * booksPerPage)
        .limit(booksPerPage)
        .exec((err, products) => {
            if(err){
                return res.status(400).json({
                    error: "No Products Found !!"
                })
            }

            res.json(products);
        })
}

exports.getAllProductsAtOnce = (req, res) => {

    // let limitListing = req.query.limit ? parseInt(req.query.limit) : 50;
    
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .sort([[sortBy, "asc"]])
        .populate("category")
        .exec((err, products) => {
            if(err){
                return res.status(400).json({
                    error: "No Products Found !!"
                })
            }

            res.json(products);
        })
}

exports.getSearchedProduct = (req, res) => {

    let searchedString = req.query.s || "";

    let limitListing = req.query.limit ? parseInt(req.query.limit) : 12;
    
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find({name:{'$regex' : `^${searchedString}`, '$options' : 'i'}})
        .select('-photo')
        .sort([[sortBy, "asc"]])
        .populate("category")
        .limit(limitListing)
        .exec((err, products) => {
            if(err){
                return res.status(400).json({
                    error: "No Products Found !!"
                })
            }

            res.json(products);
        })
}

exports.getAllProductsCount = (req, res) => {

    Product
        .countDocuments()
        .exec((err, countNo) => {
            if(err){
                return res.status(400).json({
                    error: "No Products Found !!"
                })
            }

            res.json(countNo);
        })
}

exports.updateStock = (req, res, next) => {
    let afterOrdersPlaced = req.body.orderData.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                //count will be sent from frontend as per quantity of order
                update: {$inc: {stock: - req.body.orderData.count, sold: + req.body.orderData.count}}
            }
        }
    })

    Product.bulkWrite(afterOrdersPlaced, {}, (err, results) => {
        if(err){
            return res.status(400).json({
                error: "Inventory updation Failed !!"
            })
        }
        next();
    })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No categories Found !!"
            })
        }

        res.json(categories);
    })
}