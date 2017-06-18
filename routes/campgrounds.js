var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require("geocoder");


//===================CAMPGROUNDS=============================

//INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            req.flash("error", "Error finding campgrounds!");
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds,
                page: 'campgrounds'
            });
        }
    });
});


//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var url = req.body.imageUrl;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function(err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {
            name: name,
            image: url,
            description: desc,
            author: author,
            price: price,
            location: location,
            lat: lat,
            lng: lng
        };
        Campground.create(newCampground, function(err, campground) {
            if (err) {
                req.flash("error", "Campground could not be created!");
                res.redirect("back");
            } else {
                req.flash("success", "Success! Created Campground!");
                res.redirect("/campgrounds");
            }
        });
    });
});


//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


//SHOW
router.get("/:id", function(req, res) {
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if (err) {
            req.flash("error", "Campground could not be found!");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {
                campground: campground
            });
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        res.render("campgrounds/edit", {
            campground: campground
        });
    });
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    geocoder.geocode(req.body.location, function(err, data) {
        if (err) {
            req.flash("error", "Something went wrong with the location!");
            return res.redirect("back");
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {
            name: req.body.name,
            image: req.body.imageUrl,
            description: req.body.description,
            cost: req.body.cost,
            location: location,
            lat: lat,
            lng: lng
        };
        Campground.findByIdAndUpdate(req.params.id, {
            $set: newData
        }, function(err, campground) {
            req.flash("success", "Successfully editted campground!");
            res.redirect("/campgrounds/" + req.params.id);
        });
    });
});

//DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        req.flash("success", "Successfully deleted campground!");
        res.redirect("/campgrounds");
    });
});




module.exports = router;





//RESTFUL API PATTERNS
//name          url                 verb                    desc
//==============================================================================================
//INDEX     /campgrounds            GET                     Display a list of all campgrounds
//NEW       /campgrounds/new        GET                     Display a form to make a new campground
//CREATE    /campgrounds            POST                    Add a new campground to the database
//SHOW      /campgrounds/:id        GET                     Show info about specific campground
//Edit      /campgrounds/:id/edit   GET                     Show edit form for specific campground
//Update    /campgrounds/:id        PUT                     Update a spcific campground, then redirect
//Destroy   /campgrounds/:id        DELETE                  Delete a specific campground, then redirect
