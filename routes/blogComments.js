var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

router.get(
  "/blogs/:id/comments/new",
  middleware.isLoggedIn,
  function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
      if (err) {
        console.log(err);
      } else {
        res.render("blogComments/new", { blog: blog, currentUser: req.user });
      }
    });
  }
);

router.post("/blogs/:id/comments", middleware.isLoggedIn, (req, res) => {
  const id = req.params.id;
  const comment = req.body.comment;
  Blog.findById(id)
    .then((blog) => {
      const newComment = new Comment({
        text: comment,
      });
      newComment.author = req.session.user;
      blog.comments.push(newComment);
      blog.save();
      return newComment.save();
    })
    .then((comment) => {
      res.redirect("/blogs/" + req.params.id);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get(
  "/blogs/:id/comments/:com_id/edit",
  middleware.checkBlogCommentOwnership,
  function (req, res) {
    Blog.findById(req.params.id, function (err, blogs) {
      if (err) {
        console.log(err);
      } else {
        Comment.findById(req.params.com_id, function (err, foundComment) {
          if (err) {
            console.log(err);
          } else {
            res.render("blogComments/edit", {
              blogs: blogs,
              foundComment: foundComment,
              currentUser: req.user,
            });
          }
        });
      }
    });
  }
);

router.put(
  "/blogs/:id/comments/:com_id",
  middleware.checkBlogCommentOwnership,
  function (req, res) {
    Comment.findByIdAndUpdate(
      req.params.com_id,
      req.body.comment,
      function (err, updatedComment) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/blogs/" + req.params.id);
        }
      }
    );
  }
);

router.delete(
  "/blogs/:id/comments/:com_id",
  middleware.checkBlogCommentOwnership,
  function (req, res) {
    Comment.findByIdAndRemove(req.params.com_id, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/blogs/" + req.params.id);
      }
    });
  }
);

module.exports = router;
