require('dotenv').config()
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentRoute = require("./routes/payment");


const port = process.env.PORT || 8000;

//parse the response body so that we can use req.body 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/bookify", authRoutes);
app.use("/bookify", userRoutes);
app.use("/bookify", categoryRoutes);
app.use("/bookify", productRoutes);
app.use("/bookify", orderRoutes);
app.use("/bookify", paymentRoute);

//DB
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("DB CONNECTED")
})

app.listen(port, ()=>{
    console.log('RUNNING AT PORT: ', port);
})

 