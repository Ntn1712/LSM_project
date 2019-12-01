var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

router.get("/blogs/:id/comments/new", middleware.isLoggedIn, function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render("blogComments/new", { blog: blog });
        }
    });
});

router.post("/blogs/:id/comments", middleware.isLoggedIn, function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    console.log(err);
                } else {
                    // save id and username of the user to the comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    // save new comment
                    newComment.save();
                    foundBlog.comments.push(newComment);
                    foundBlog.save();
                    res.redirect("/blogs/" + req.params.id);
                }
            });
        }
    });
});

router.get("/blogs/:id/comments/:com_id/edit", middleware.checkBlogCommentOwnership, function (req, res) {
    Blog.findById(req.params.id, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            Comment.findById(req.params.com_id, function (err, foundComment) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("blogComments/edit", { blogs: blogs, foundComment: foundComment });
                }
            })
        }
    })
});

router.put("/blogs/:id/comments/:com_id", middleware.checkBlogCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.com_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

router.delete("/blogs/:id/comments/:com_id", middleware.checkBlogCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.com_id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

module.exports = router;