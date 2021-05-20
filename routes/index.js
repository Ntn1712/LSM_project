const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Blog = require("../models/blog");
const passport = require("passport");
const nodemailer = require("nodemailer");
const async = require("async");
const crypto = require("crypto");

router.get("/", (req, res, next) => {
  res.render("landing");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect("/register");
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const newUser = new User({
        email: email,
        name: name,
        password: hashedPassword,
      });
      return newUser.save();
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((match) => {
        if (match) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return res.redirect("/");
        }
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    console.log(err);
    res.redirect("/");
  });
});

// router.get("/forgot", function (req, res) {
//   res.render("forgot");
// });

// router.post("/forgot", function (req, res, next) {
//   async.waterfall(
//     [
//       function (done) {
//         crypto.randomBytes(20, function (err, buf) {
//           var token = buf.toString("hex");
//           done(err, token);
//         });
//       },
//       function (token, done) {
//         User.findOne({ email: req.body.email }, function (err, user) {
//           if (!user) {
//             return res.redirect("/forgot");
//           }

//           user.resetPasswordToken = token;
//           user.resetPasswordExpires = Date.now() + 3600000;
//           user.save(function (err) {
//             done(err, token, user);
//           });
//         });
//       },
//       function (token, user, done) {
//         var smtpTransport = nodemailer.createTransport({
//           service: "Gmail",
//           auth: {
//             user: "testwebdevnode@gmail.com",
//             pass: process.env.GMAILPW,
//           },
//         });
//         var mailOptions = {
//           to: user.email,
//           from: "testwebdevnode@gmail.com",
//           subject: "BlogWeb Password Reset",
//           text:
//             "You are receiving this because you have requested the reset of the password for your account.\n\n" +
//             "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
//             "http://" +
//             req.headers.host +
//             "/reset/" +
//             token +
//             "\n\n" +
//             "If you did not request this, please ignore this email and your password will remain unchanged.\n",
//         };
//         smtpTransport.sendMail(mailOptions, function (err) {
//           console.log("mail sent");

//           done(err, "done");
//         });
//       },
//     ],
//     function (err) {
//       if (err) return next(err);
//       res.redirect("/forgot");
//     }
//   );
// });

// router.get("/reset/:token", function (req, res) {
//   User.findOne(
//     {
//       resetPasswordToken: req.params.token,
//       resetPasswordExpires: { $gt: Date.now() },
//     },
//     function (err, user) {
//       if (!user) {

//         return res.redirect("/forgot");
//       }
//       res.render("reset", { token: req.params.token });
//     }
//   );
// });

// router.post("/reset/:token", function (req, res) {
//   async.waterfall(
//     [
//       function (done) {
//         User.findOne(
//           {
//             resetPasswordToken: req.params.token,
//             resetPasswordExpires: { $gt: Date.now() },
//           },
//           function (err, user) {
//             if (!user) {

//               return res.redirect("back");
//             }
//             if (req.body.password === req.body.confirm) {
//               user.setPassword(req.body.password, function (err) {
//                 user.resetPasswordToken = undefined;
//                 user.resetPasswordExpires = undefined;

//                 user.save(function (err) {
//                   req.logIn(user, function (err) {
//                     done(err, user);
//                   });
//                 });
//               });
//             } else {

//               return res.redirect("back");
//             }
//           }
//         );
//       },
//       function (user, done) {
//         var smtpTransport = nodemailer.createTransport({
//           service: "Gmail",
//           auth: {
//             user: "testwebdevnode@gmail.com",
//             pass: process.env.GMAILPW,
//           },
//         });
//         var mailOptions = {
//           to: user.email,
//           from: "testwebdevnode@gmail.com",
//           subject: "Your password has been changed",
//           text:
//             "Hello,\n\n" +
//             "This is a confirmation that the password for your account " +
//             user.email +
//             " has just been changed.\n",
//         };
//         smtpTransport.sendMail(mailOptions, function (err) {

//           done(err);
//         });
//       },
//     ],
//     function (err) {
//       res.redirect("/");
//     }
//   );
// });

// router.get("/user/:id", function (req, res) {
//   User.findById(req.params.id, function (err, foundUser) {
//     if (err) {
//       return res.redirect("/");
//     }
//     Blog.find()
//       .where("author.id")
//       .equals(foundUser._id)
//       .exec(function (err, blogs) {
//         if (err) {
//           return res.redirect("/");
//         }
//         res.render("user/show", { user: foundUser, blogs: blogs });
//       });
//   });
// });

module.exports = router;
