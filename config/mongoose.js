const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://pulkit:<123@fool>@test.chjp1.mongodb.net/test?retryWrites=true&w=majority");

let db = mongoose.connection;

db.on("err", console.error.bind(console, "Failed to connect to db"));

db.once("open", function () {
  console.log("Connected to db");
});

module.exports = db;
