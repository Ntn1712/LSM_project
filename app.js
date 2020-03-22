require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");
const Blog = require("./models/blog");
const Location = require("./models/location");
const Comment = require("./models/comment");
const User = require("./models/user");
const middleware = require("./middleware/index");

const blogRoutes = require("./routes/blogs");
const locationRoutes = require("./routes/locations");
const blogCommentRoutes = require("./routes/blogComments");
const locCommentRoutes = require("./routes/locComments");
const indexRoutes = require("./routes/index");
const profileRoutes = require("./routes/profile");


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lsm_blog", 
    {useNewUrlParser : true, useFindAndModify : false, useCreateIndex: true},
    err => {
        if(!err) console.log("Connection successfull");
    });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

//================================
//passport configuration
//================================
const expiryDate = new Date(5 * Date.now() + 60 * 60 * 1000);       //5 hours

app.use(require("express-session")({
    secret: "nitin is the best",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        expiryDate: expiryDate
    }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(blogRoutes);
app.use(locationRoutes);
app.use(blogCommentRoutes);
app.use(locCommentRoutes);
app.use(profileRoutes);


app.listen(process.env.PORT || 5000, function () {
    try {
        console.log("new blog app has started");
    } catch (err){
        return next(err);
    }
})