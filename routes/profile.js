var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/profile/:prof_id", function (req, res) {
  User.findById(req.params.prof_id, function (err, foundProf) {
    if (err) {
      console.log(err);
    } else {
      res.render("profile/show", {
        foundProf: foundProf,
        currentUser: req.user,
      });
    }
  });
});

router.get("/profile/:prof_id/edit", function (req, res) {
  User.findById(req.params.prof_id, function (err, foundProf) {
    if (err) {
      console.log(err);
    } else {
      res.render("profile/edit", {
        foundProf: foundProf,
        currentUser: req.user,
      });
    }
  });
});

router.put("/profile/:prof_id", function (req, res) {
  User.findByIdAndUpdate(
    req.params.prof_id,
    req.body.user,
    function (err, updated) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/profile/" + req.params.prof_id);
      }
    }
  );
});

router.delete("/profile/:prof_id", function (req, res) {
  User.findByIdAndRemove(req.params.prof_id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

router.get("/profile/:prof_id/editPass", function (req, res) {
  User.findById(req.params.prof_id, function (err, foundProf) {
    if (err) {
      console.log(err);
    } else {
      res.render("profile/editPass", {
        foundProf: foundProf,
        currentUser: req.user,
      });
    }
  });
});

router.post("/profile/:prof_id", function (req, res) {
  User.findById(req.params.prof_id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      if (!user) {
        console.log(err);
      } else {
        user.setPassword(req.body.newPassword, function (err) {
          if (err) {
            console.log(err);
          } else {
            user.save();
            res.redirect("/profile/" + req.params.prof_id);
          }
        });
      }
    }
  });
});

module.exports = router;
