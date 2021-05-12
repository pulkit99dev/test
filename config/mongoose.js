const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test");

let db = mongoose.connection;

db.on("err", console.error.bind(console, "Failed to connect to db"));

db.once("open", function () {
  console.log("Connected to db");
});

module.exports = db;
