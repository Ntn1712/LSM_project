var express = require("express");
var router = express.Router();
var Location = require("../models/location");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

router.get(
  "/locations/:loc_id/comments/new",
  middleware.isLoggedIn,
  function (req, res) {
    Location.findById(req.params.loc_id, function (err, foundLoc) {
      if (err) {
        console.log(err);
      } else {
        res.render("locationComments/new", {
          location: foundLoc,
          currentUser: req.user,
        });
      }
    });
  }
);

router.post(
  "/locations/:loc_id/comments",
  middleware.isLoggedIn,
  (req, res) => {
    const id = req.params.loc_id;
    const comment = req.body.comment;
    Location.findById(id)
      .then((location) => {
        const newComment = new Comment({
          text: comment,
        });
        newComment.author = req.session.user;
        location.comments.push(newComment);
        location.save();
        return newComment.save();
      })
      .then((comment) => {
        res.redirect("/locations/" + id);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.get(
  "/locations/:loc_id/comments/:comment_id/edit",
  middleware.checkLocCommentOwnership,
  function (req, res) {
    Location.findById(req.params.loc_id, function (err, foundLoc) {
      if (err) {
        console.log(err);
      } else {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
          if (err) {
            console.log(err);
          } else {
            res.render("locationComments/edit", {
              foundLoc: foundLoc,
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
  "/locations/:loc_id/comments/:comment_id",
  middleware.checkLocCommentOwnership,
  function (req, res) {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      function (err, updatedComment) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/locations/" + req.params.loc_id);
        }
      }
    );
  }
);

router.delete(
  "/locations/:loc_id/comments/:comment_id",
  middleware.checkLocCommentOwnership,
  function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/locations/" + req.params.loc_id);
      }
    });
  }
);

module.exports = router;
