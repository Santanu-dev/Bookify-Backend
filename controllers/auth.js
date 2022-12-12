const User = require("../models/user"); 
const { validationResult } = require("express-validator");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
   const user = new User(req.body);

    //validation results
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

   user.save((err, user) => {
    if(err){
        return res.status(400).json({
            err: "Not able to save user to DB!",
        })
    }

    res.json({
        name: user.name,
        email: user.email,
        id: user._id
    });
   })
}

exports.signin = (req, res) => {
    const {email, password} = req.body;

    const user = new User(req.body);

    //validation results
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    User.findOne({email}, (err, user) => {
        if(!user){
            return res.status(400).json({
                error: "user not found!"
            })
        }

        if(err){
            return res.status(400).json({
                error: "Something went wrong!!"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Invalid credentials!"
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.SECRET) 
        
        res.cookie("token", token, {expire: new Date() + 60});

        //send to front-end
        const {_id, name, email, role} = user;
        
        return res.json({token, user: {_id, email, name, role}});
    })

}

exports.signout = (req, res) => {
    res.clearCookie("token");

    res.json({
        msg: "user signed out successfully. Thank you!"
    });
}

//protectd routes checks access if only token is present
//express-jwt already has next 
//userProperty: auth hold the _id of user
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    /* 
        profile will be sent from front-end
    */
    let checks = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checks){
        return res.status(403).json({
            msg: "Access Denied!!!!" + checks
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            msg: "You Don't have admin access!"
        })
    }
    next();
}

