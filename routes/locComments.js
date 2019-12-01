var express = require("express");
var router = express.Router();
var Location = require("../models/location");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

router.get("/locations/:loc_id/comments/new", middleware.isLoggedIn, function (req, res) {
    Location.findById(req.params.loc_id, function (err, foundLoc) {
        if (err) {
            console.log(err);
        } else {
            res.render("locationComments/new", { location: foundLoc });
        }
    })
});

router.post("/locations/:loc_id/comments", middleware.isLoggedIn, function (req, res) {
    Location.findById(req.params.loc_id, function (err, foundLoc) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    console.log(err)
                } else {
                    // passing id and username to the newComment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    // save new comment
                    newComment.save();
                    foundLoc.comments.push(newComment);
                    foundLoc.save();
                    res.redirect("/locations/" + req.params.loc_id);
                }
            });
        }
    });
});

router.get("/locations/:loc_id/comments/:comment_id/edit", middleware.checkLocCommentOwnership, function (req, res) {
    Location.findById(req.params.loc_id, function (err, foundLoc) {
        if (err) {
            console.log(err);
        } else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("locationComments/edit", { foundLoc: foundLoc, foundComment: foundComment });
                }
            })
        }
    })

});

router.put("/locations/:loc_id/comments/:comment_id", middleware.checkLocCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/locations/" + req.params.loc_id);
        }
    });
});

router.delete("/locations/:loc_id/comments/:comment_id", middleware.checkLocCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/locations/" + req.params.loc_id);
        }
    })
});

module.exports = router;