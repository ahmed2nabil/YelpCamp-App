var Campground = require("../models/campground"),
    Comment = require("../models/comments");
var middlewareObj = {};
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
       return next();
        }
        req.flash("error","You need to be logged in");
        res.redirect("/login");
}


 middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            req.flash("error","Oops!! something went wrong");
            res.redirect("/campground")
        }else {
            if(foundCamp.author.id.equals(req.user._id)){
                next();
            }else {
                req.flash("error","You don't have permession to do that");
                res.redirect("back");
            }    
        }
    })
    }else {
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
}

    middlewareObj.checkCommentOwnership = function (req,res,next){
    if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash("error","Oops!! something went wrong");
            res.redirect("/campground")
        }else {
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else {
                req.flash("error","You don't have permession to do that");
                res.redirect("back");
            }    
        }
    })
    }else {
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
}

module.exports = middlewareObj;