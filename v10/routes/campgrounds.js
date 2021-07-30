const e = require("express");
const { route } = require("./comments");

var express = require("express"),
    router  = express.Router(),
    Campground  = require("../models/campground");

router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
router.get("/",function(req,res){
    Campground.find({},function(err, camps){
        if(err){
            console.log(err);
        }else {
        res.render("campgrounds/index",{campgrounds:camps , currentUser:req.user});
        }
    })
    })
    
router.post("/",isLoggedIn,function(req,res){
     var name = req.body.name;
     var image = req.body.image;
     var desc = req.body.description;
     var author = {
         id: req.user._id,
         username: req.user.username 
     }
     var NewCampground = {title : name , image : image,description:desc,author:author};
     Campground.create(NewCampground,function(err,newlyCreated){
         if(err){
             console.log(err);
         }
         else {
    res.redirect("/campground");
         }
     })
    })
    
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
    })
    
router.get("/:id",function(req,res){
        Campground.findById(req.params.id).populate("comments").exec(function(err,camp){
            if(err){
                console.log(err);
            }else{
                res.render("campgrounds/show",{campground:camp});
            }
        })
    })

    //Edit Campground Route 
    router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,camp){
            res.render("campgrounds/edit",{campground:camp});
        })
    })

    router.put("/:id",checkCampgroundOwnership,function(req,res){
        Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
            if(err){
                res.redirect("/campground");
            }else {
                res.redirect("/campground/"+ req.params.id);
            }
        })
    })

    //Delete Route
    router.delete("/:id",checkCampgroundOwnership,function(req,res){
        Campground.findByIdAndRemove(req.params.id,function(err){
            res.redirect("/campground");
        })
    })
    function isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
           return next();
            }
            res.redirect("/login");
    }

    function checkCampgroundOwnership(req,res,next){
        if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCamp){
            if(err){
                res.redirect("/campground")
            }else {
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                }else {
                    res.redirect("back");
                }    
            }
        })
        }else {
            res.redirect("back");
        }
    }
module.exports = router;
    