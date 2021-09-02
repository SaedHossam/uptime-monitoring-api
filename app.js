const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

const userRoutes = require('./api/routes/user');

// configure enviroment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// CONNECTION EVENTS
mongoose.connection.once('connected', function () {
    console.log("Database connected to Mongo cloud")

})
mongoose.connection.on('error', function (err) {
    console.log("MongoDB connection error: " + err)
})
mongoose.connection.once('disconnected', function () {
    console.log("Database disconnected")
})

// If Node's process ends, close the MongoDB connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log("Database disconnected through app termination")
        process.exit(0);
    })
})

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/user", userRoutes);
// 404 not found
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
// any Error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
