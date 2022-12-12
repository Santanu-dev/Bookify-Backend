const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                msg: "User not found!"
            })
        }

        req.profile = user;
        next();
    })
}

exports.getUser = (req, res) => {
    req.profile.encry_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);    
}

exports.getAllUsers = (req, res) => {
    let usersArray = [];

    User.find().exec((err, users) => {
        if(err || !users){
            return res.status(400).json({
                msg: "No Users found!"
            })
        }

        users.map((user)=>{
            const {name, email} = user;
            usersArray.push({name, email});
        })

        return res.json(usersArray);
    })
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error: "Updation Failed!"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            return res.json(user);
        }
    )
}


exports.userPurchaseList = (req, res) => {
    User.find({_id: req.profile._id})
        .populate("orders", "_id purchases")
        .exec((err, order) => {
            if(err){
                return res.status(400).json({
                    error: "Orders Not Found!"
                })
            }

            return res.json(order);
        })
}

// add to puchase List middleware
exports.addOrdersToPurchaseList = (req, res, next) => {
    let purchases = [];
    //req.body.order.products comes from front-end
    // console.log(req.body)
    req.body.orderData.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            desc: product.description,
            category: product.category,
            quantity: req.body.orderData.count,
            amount: req.body.orderData.amount,
            transaction_id: req.body.orderData.trasaction_id
        })
    })

    //push to DB
    User.findOneAndUpdate(
        { _id: req.profile._id },
        {$push: {purchases: purchases}},
        //new: true modify the current obj
        {new: true},
        (err, purchase) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save order to purchase List"
                })
            }
            next();
        }
    )
}