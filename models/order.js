let mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

let ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "product"
    },
    name: String,
    count: Number,
    price: Number,
    deliveryDate: Date
})

const productCart = mongoose.model("productCart", ProductCartSchema);

let userCurrent = new mongoose.Schema({
    user: {
        type: ObjectId,
         ref: "user"
    },
    name: String,
    email: String
})

const userCurr = mongoose.model("userCurr", userCurrent);

let orderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    trasaction_id: {},
    amount: {type: Number},
    address: String,
    updated: Date,
    count: Number,
    orderStatus: {
        type: String,
        default: "Placed",
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Placed"]
    },
    user: [userCurrent]
    },
    { timestamp: true }
)

const order = mongoose.model('order', orderSchema);

module.exports = { order, productCart, userCurr };