var express = require("express");
var authRouter = require("./auth");
var carRouter= require("./car");
var app = express();

app.use("/auth/", authRouter);
app.use("/car/", carRouter);
module.exports = app;