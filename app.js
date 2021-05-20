require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

const blogRoutes = require("./routes/blogs");
const locationRoutes = require("./routes/locations");
const blogCommentRoutes = require("./routes/blogComments");
const locCommentRoutes = require("./routes/locComments");
const indexRoutes = require("./routes/index");
const profileRoutes = require("./routes/profile");

// process.env.MONGODB_URI ||

const MONGODB_URI = "mongodb://localhost/blogApp";

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true },
  (err) => {
    if (!err) console.log("Connection successfull");
  }
);

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "userSessions",
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "qwertyuiopasdfghjklzxcvbnm",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
    store: store,
  })
);

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  next();
});

app.use(indexRoutes);
app.use(blogRoutes);
app.use(locationRoutes);
app.use(blogCommentRoutes);
app.use(locCommentRoutes);
app.use(profileRoutes);

app.listen(process.env.PORT || 3000, function () {
  try {
    console.log("new blog app has started");
  } catch (err) {
    return next(err);
  }
});
