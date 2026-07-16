const express = require("express"); //use kar rahe hai express 
const cors = require("cors");
const app = express(); 
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route")

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/",userRouter)


module.exports = app;
