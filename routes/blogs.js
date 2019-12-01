var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

router.get("/blogs", function (req, res) {
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Blog.find({title: regex}, function (err, allBlogs) {
            if (err) {
                console.log(err)
            } else {
                if(allBlogs.length < 1){
                    noMatch = "No Blogs match that query, try something else.";
                }
                res.render("blogs/index", { blogs: allBlogs, currentUser: req.user, noMatch: noMatch });
            }
        })
    } else {
        Blog.find({}, function (err, allBlogs) {
            if (err) {
                console.log(err)
            } else {
                res.render("blogs/index", { blogs: allBlogs, currentUser: req.user, noMatch: noMatch });
            }
        })
    }
}); 

router.get("/blogs/new", middleware.isLoggedIn, function (req, res) {
    res.render("blogs/new");
});

router.post("/blogs", middleware.isLoggedIn, function (req, res) {
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            console.log(err);
        } else {
            // passing id and username to the blog
            newBlog.author.id = req.user._id,
            newBlog.author.username = req.user.username;
            //save the blog
            newBlog.save();
            res.redirect("/blogs");
        }
    });
});

router.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id).populate("comments").exec(function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("blogs/show", { blog: foundBlog })
        }
    })
});

router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("blogs/edit", { foundBlog: foundBlog });
        }
    })
});

router.put("/blogs/:id", middleware.checkBlogOwnership, function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

router.delete("/blogs/:id", middleware.checkBlogOwnership, function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;