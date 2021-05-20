var mongoose = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: { type: Boolean, default: false },
});

// userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
