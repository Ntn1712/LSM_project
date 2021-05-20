var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

router.get("/blogs", function (req, res) {
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Blog.find({ title: regex })
      .populate("author")
      .then((blogs) => {
        if (blogs.length < 1) {
          noMatch = "No Blogs match that query, try something else.";
        }
        res.render("blogs/index", {
          blogs: blogs,
          noMatch: noMatch,
        });
      });
  } else {
    Blog.find({})
      .populate("author")
      .then((blogs) => {
        res.render("blogs/index", { blogs: blogs, noMatch: noMatch });
      });
  }
});

router.get("/blogs/new", middleware.isLoggedIn, function (req, res) {
  res.render("blogs/new");
});

router.post("/blogs", middleware.isLoggedIn, function (req, res) {
  const blogBody = req.body.blog;
  const newBlog = new Blog(blogBody);
  newBlog.author = req.session.user;
  newBlog
    .save()
    .then((blog) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/blogs/:id", function (req, res) {
  const id = req.params.id;
  Blog.findById(id)
    .populate([
      { path: "author", model: "User" },
      { path: "comments", populate: { path: "author", model: "User" } },
    ])
    .then((blog) => {
      res.render("blogs/show", { blog: blog });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get(
  "/blogs/:id/edit",
  middleware.checkBlogOwnership,
  function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
      if (err) {
        console.log(err);
      } else {
        res.render("blogs/edit", {
          foundBlog: foundBlog,
          currentUser: req.user,
        });
      }
    });
  }
);

router.put("/blogs/:id", middleware.checkBlogOwnership, (req, res) => {
  Blog.findByIdAndUpdate(
    req.params.id,
    req.body.blog,
    function (err, updatedBlog) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/blogs/" + req.params.id);
      }
    }
  );
});

router.delete("/blogs/:id", middleware.checkBlogOwnership, (req, res) => {
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
}

module.exports = router;
