let mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true,
        unique: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('category', categorySchema)