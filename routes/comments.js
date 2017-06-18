var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//=====================================================================================
//COMMENTS ROUTES

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", "Error getting the create comment page!");
            res.redirect("back");
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });
});


//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    //find by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Could not create comment!");
                    res.redirect("/campgrounds/" + req.params.id + "/comments");
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Success! Added comment!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});


//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        res.render("comments/edit", {
            campground_id: req.params.id,
            comment: comment
        });
    });
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        req.flash("success", "Successfully editted comment!");
        res.redirect("/campgrounds/" + req.params.id);
    });
});


//DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        req.flash("success", "Successfully deleted comment!");
        res.redirect("/campgrounds/" + req.params.id);
    });
});


module.exports = router;


//RESTFUL API PATTERNS
//Note: urls appended to campgrounds/:id
//name          url                 verb                    desc
//==============================================================================================
//INDEX     /                       GET                     Display a list of all comment
//NEW       /new                    GET                     Display a form to make a new comment
//CREATE    /                       POST                    Add a new comment to the database
//SHOW      /                       GET                     Show info about specific comment - DOES NOT EXIST FOR COMMENT/SAME AS CAMPGROUND SHOW PAGE
//Edit      /:comment_id/edit       GET                     Show edit form for specific comment
//Update    /                       PUT                     Update a spcific comment, then redirect
//Destroy   /                       DELETE                  Delete a specific comment, then redirect
