var mongoose = require("mongoose");

var locationSchema = new mongoose.Schema({
  name: String,
  location: String,
  lat: Number,
  lng: Number,
  image: String,
  area: Number,
  population: Number,
  tplace1: String,
  tplace2: String,
  tplace3: String,
  school1: String,
  school2: String,
  school3: String,
  bres1: String,
  bres2: String,
  bres3: String,
  desc: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Location", locationSchema);
