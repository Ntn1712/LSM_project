var mongoose = require("mongoose");
var Blog = require("../models/blog");
var Location = require("../models/location");
var Comment = require("../models/comment");
var User = require("../models/user");

//===================================================
// middlewares
//===================================================

var middlewareObj = {};

middlewareObj.checkBlogOwnership = (req, res, next) => {
  if (req.session.user || req.session.isLoggedIn) {
    Blog.findById(req.params.id)
      .populate("author")
      .then((blog) => {
        if (
          blog.author._id.equals(req.session.user._id) ||
          req.session.user.isAdmin
        ) {
          return next();
        }
        res.redirect("back");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkLocationOwnership = function (req, res, next) {
  if (req.session.user || req.session.isLoggedIn) {
    Location.findById(req.params.loc_id, function (err, foundLoc) {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        if (
          foundLoc.author._id.equals(req.session.user._id) ||
          req.session.user.isAdmin
        ) {
          next();
        } else {
          console.log("err aya hai");
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkBlogCommentOwnership = function (req, res, next) {
  if (req.session.user || req.session.isLoggedIn) {
    Comment.findById(req.params.com_id)
      .populate("author")
      .then((comment) => {
        if (
          (comment.author._id.equals(req.session.user._id) &&
            req.session.isLoggedIn) ||
          (req.session.user.isAdmin && req.session.isLoggedIn)
        ) {
          return next();
        }
        res.redirect("back");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log(err);
    res.redirect("back");
  }
};

middlewareObj.checkLocCommentOwnership = function (req, res, next) {
  if (req.session.user || req.session.isLoggedIn) {
    Comment.findById(req.params.comment_id)
      .populate("author")
      .then((comment) => {
        if (
          (comment.author._id.equals(req.session.user._id) &&
            req.session.isLoggedIn) ||
          (req.session.user.isAdmin && req.session.isLoggedIn)
        ) {
          return next();
        }
        res.redirect("back");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log(err);
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (!req.session.user || !req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

module.exports = middlewareObj;
