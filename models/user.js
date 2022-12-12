const mongoose = require("mongoose");
let crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,

    role: {
        type: Number,
        //0 for normal users, 1 for admin
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    },
});
//for encrypting the password

userSchema.virtual("password")
    .set(function(intermediatePassword){
        this._password = intermediatePassword;
        this.salt = uuidv4();
        this.encry_password = this.securePassword(intermediatePassword);
    })
    .get(function(){
        return this._password;
    })

userSchema.methods = {

    authenticate: function(plainPassword){
        return this.securePassword(plainPassword) === this.encry_password;
    },

    securePassword: function(plainPassword){
        if(!plainPassword) return "";

        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainPassword)
                .digest('hex');
        }catch(error){
            return '';
        }
    }
}


module.exports = mongoose.model('user', userSchema);
