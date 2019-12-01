var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    avatar: String,
    name: String,
    age: Number,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default:false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);