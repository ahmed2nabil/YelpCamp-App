// const e = require("express");
// const { route } = require("./comments");


var express = require("express"),
    router  = express.Router(),
    middleware    = require("../middleware"),
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
    
router.post("/",middleware.isLoggedIn,function(req,res){
     var name = req.body.name;
     var image = req.body.image;
     var price = req.body.price;
     var desc = req.body.description;
     var author = {
         id: req.user._id,
         username: req.user.username 
     }
     var NewCampground = {title : name , image : image,description:desc,author:author,price:price};
     Campground.create(NewCampground,function(err,newlyCreated){
         if(err){
             console.log(err);
         }
         else {
        req.flash("sucess","Succesfully added campground");
    res.redirect("/campground");
         }
     })
    })
    
router.get("/new",middleware.isLoggedIn,function(req,res){
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
    router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,camp){
            res.render("campgrounds/edit",{campground:camp});
        })
    })

    router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
            if(err){
                req.flash("error","Oops!! something went wrong");
                res.redirect("/campground");
            }else {
                res.redirect("/campground/"+ req.params.id);
            }
        })
    })

    //Delete Route
    router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findByIdAndRemove(req.params.id,function(err){
            res.redirect("/campground");
        })
    })

module.exports = router;
    