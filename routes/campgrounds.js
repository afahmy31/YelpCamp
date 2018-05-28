var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");


//INDEX - Show all campgrounds (RESTFUL)
router.get("/campgrounds",function(req,res){
    // get all campgrounds from DB
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB (RESTFUL)
router.post("/campgrounds",middleware.isLoggedIn, function(req,res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,price:print, image: image, description:description, author:author};
    
    //CREATE NEW CAMPGROUND AND SAVE TO DB
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            
            //redirect to campgrounds page
            res.redirect("/campgrounds");
        }     
    });
});

//NEW - Show form to create new campground (RESTFUL)
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new") ;
});


//SHOW - Shows more info about one campground (RESTFUL)
router.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       } else{
           //RENDER SHOW TEMPLATE WITH THAT CAMPGROUND
           res.render("campgrounds/show",{campground:foundCampground});
       }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});


//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    //Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //redirect to SHOW page
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
    
});
    
//DESTROY CAMPGROUND ROUTE(DELETE)
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;