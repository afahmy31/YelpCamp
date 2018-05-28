var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//==================================================
//COMMENTS ROUTES
//==================================================

//NEW - Show form to create new comment on campgrounds (RESTFUL)
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn,function(req, res) {
    Campground.findById(req.params.id , function(err,campground){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new",{campground:campground});
       }
    });
});

//CREATE - add new comment to campground (RESTFUL)
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
    //Lookup campground using ID
    Campground.findById(req.params.id,function(err, campground) {
       if(err){
           console.log(err);
       } else{
           //Create new comment
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   console.log(err);
               } else {
                   //Add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //Save comment
                   comment.save();
                   //Connect new comment to campground
                   campground.comments.push(comment._id);
                   campground.save();
                   req.flash("success","Successfully added comment");
                   //Redirect to camground show page
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
    
});

//EDIT COMMENT ROUTE FORM 
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success","Successfully edited comment");
            res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
        }
    });
});

//UPDATE COMMENT ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY COMMENT ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });
});

module.exports = router;