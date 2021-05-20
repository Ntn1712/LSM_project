var express = require("express");
var router = express.Router();
var Location = require("../models/location");
var middleware = require("../middleware/index");

var NodeGeocoder = require("node-geocoder");
var options = {
  provider: "opencage",
  httpAdapter: "https",
  apiKey: "d9f28733fc744653a4c7287078303fbd",
  formatter: null,
};

var geocoder = NodeGeocoder(options);

router.get("/locations", function (req, res) {
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Location.find({ name: regex }, function (err, allLocations) {
      if (err) {
        console.log(err);
      } else {
        if (allLocations.length < 1) {
          noMatch = "No Locations match that query, try something else.";
        }
        res.render("locations/index", {
          location: allLocations,
          currentUser: req.user,
          noMatch: noMatch,
        });
      }
    });
  } else {
    Location.find({}, function (err, allLocations) {
      if (err) {
        console.log(err);
      } else {
        res.render("locations/index", {
          location: allLocations,
          currentUser: req.user,
          noMatch: noMatch,
        });
      }
    });
  }
});

router.get("/locations/new", middleware.isLoggedIn, function (req, res) {
  res.render("locations/new");
});

router.post("/locations", middleware.isLoggedIn, function (req, res) {
  geocoder.geocode(req.body.location.location, function (err, data) {
    if (err || !data.length) {
      console.log(err);
      return res.redirect("back");
    }
    req.body.location.lat = data[0].latitude;
    req.body.location.lng = data[0].longitude;
    req.body.location.location = data[0].formattedAddress;
    Location.create(req.body.location, function (err, newLocation) {
      if (err) {
        console.log(err);
      } else {
        newLocation.author = req.session.user;
        newLocation.save();
        res.redirect("/locations");
      }
    });
  });
});

router.get("/locations/:loc_id", function (req, res) {
  const id = req.params.loc_id;
  Location.findById(id)
    .populate([
      { path: "author", model: "User" },
      { path: "comments", populate: { path: "author", model: "User" } },
    ])
    .then((location) => {
      res.render("locations/show", { foundLoc: location });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get(
  "/locations/:loc_id/edit",
  middleware.checkLocationOwnership,
  function (req, res) {
    Location.findById(req.params.loc_id, function (err, foundLoc) {
      if (err) {
        console.log(err);
      } else {
        res.render("locations/edit", { Loc: foundLoc, currentUser: req.user });
      }
    });
  }
);

router.put(
  "/locations/:loc_id",
  middleware.checkLocationOwnership,
  function (req, res) {
    geocoder.geocode(req.body.location.location, function (err, data) {
      if (err || !data.length) {
        return res.redirect("back");
      }
      req.body.location.lat = data[0].latitude;
      req.body.location.lng = data[0].longitude;
      req.body.location.location = data[0].formattedAddress;
      Location.findByIdAndUpdate(
        req.params.loc_id,
        req.body.location,
        function (err, updatedLoc) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/locations/" + req.params.loc_id);
          }
        }
      );
    });
  }
);

router.delete(
  "/locations/:loc_id",
  middleware.checkLocationOwnership,
  function (req, res) {
    Location.findByIdAndRemove(req.params.loc_id, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/locations");
      }
    });
  }
);

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
