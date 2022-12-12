let mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema;

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 256,
        trim: true,
        },
    description: {
        type: String,
        trim: true,
        maxlength: 3200,
    },
    price: {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true,
    },
    category: {
        type: ObjectId,
        ref: "category",
        required: true
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, { timestamp: true })

module.exports = mongoose.model('product', productSchema)