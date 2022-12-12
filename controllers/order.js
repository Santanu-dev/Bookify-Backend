const { order, productCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
    order.findById(id)
        .populate("products.product", "name price")
        .exec((error, order) => {
            if(error){
                return res.status(400).json({
                    message: "Order Not Found !",
                })
            }

            req.order = order;
            next();
        })
}

exports.getOrderByTransactionId = (req, res, next, id) => {
    order.find({trasaction_id : id})
        .populate("products.product", "name price")
        .exec((error, order) => {
            if(error){
                return res.status(400).json({
                    message: "Order Not Found of the transaction!",
                })
            }

            req.orderByTransaction = order;
            next();
        })
}


exports.createOrder = (req, res) => {
    //req,profile gets populated by getUserById
    console.log(req.profile)
    req.body.orderData.user = req.profile; 

    const orderData = new order(req.body.orderData);
    orderData.save((err, order) => {
        if(err){
            return res.status(400).json({
                message: "Failed to place the order !"
            })
        }

        res.json(order);
    })
}

exports.getAllOrders = (req, res) => {
    order.find()
        .populate("user", "_id name")
        .exec((err, orders) => {
            if(err){
                return res.status(400).json({
                    message: "Failed to fetch all orders !"
                })
            }

            res.json(orders);
        })
}

exports.updateOrderStatus = (req, res) => {
    console.log(req.body.status)
    order.updateOne(
        {_id: req.order["_id"]},
        {$set: {orderStatus: req.body.status}}, 
        (err, order) => {
            if(err){
                return res.status(400).json({
                    message: "Order status updation failed !"
                })
            }

            res.json(order);
        }
    )
}

exports.getOrderStatus = (req, res) => {
    res.json(order.schema.path("status").enumValues);
}

exports.getMyOrderStatus = (req, res) => {
    res.json(req.orderByTransaction);
}
