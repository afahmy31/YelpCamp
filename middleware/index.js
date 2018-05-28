var Campground = require("../models/campground");
var Comment = require("../models/comment");
//ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                //DOES USER OWN CAMPGROUND?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();  
                } else {
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
        //IF NOT, REDIRECT
        } else{
            //send user back to last page
            req.flash("error","You need to be logged in to do this!")
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","Campground not found!");
                console.log(err);
                res.redirect("back");
            } else {
                //DOES USER OWN COMMENT?
                if(foundComment.author.id.equals(req.user._id)){
                    next();  
                } else {
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
        //IF NOT, REDIRECT
        } else{
            //send user back to last page
            req.flash("error","You need to be logged in to do this!")
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do this!");
    res.redirect("/login");
}

module.exports = middlewareObj;