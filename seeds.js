var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807_960_720.jpg",
        description: "Test Description"
    },
    {
        name: "Granite Hill",
        image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807_960_720.jpg",
        description: "Second Test Description"
    },
    {
        name: "Turkey Run",
        image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807_960_720.jpg",
        description: "Third Test Description"
    }
];


function seedDb() {

    //REMOVE CAMPGROUNDS
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds");
            Comment.remove({}, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("removed comments");
                    /*data.forEach(function(seed) {
                        Campground.create(seed, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("added campgrounds");
                                //Create a comment
                            }
                        });
                    });*/
                }
            });
        }
    });

}

module.exports = seedDb;
