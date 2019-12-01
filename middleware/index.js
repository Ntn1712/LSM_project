var mongoose = require("mongoose");
var Blog = require("../models/blog");
var Location = require("../models/location");
var Comment = require("../models/comment");
var User = require("../models/user");


//===================================================
// middlewares
//===================================================

var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundBlog.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkLocationOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Location.findById(req.params.loc_id, function(err, foundLoc){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundLoc.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back")
    }
};

middlewareObj.checkBlogCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.com_id, function(err, foundBComment){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundBComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    console.log(err);
                    res.redirect("back");     
                }
            }
        })
    } else {
        console.log(err);
        res.redirect("back");
    }
};

middlewareObj.checkLocCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundLComment){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundLComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    console.log(err);
                    res.redirect("back");     
                }
            }
        })
    } else {
        console.log(err);
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
};

module.exports = middlewareObj;