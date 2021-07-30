var express = require("express"),
    router  = express.Router(),
    Campground  = require("../models/campground");

router.get("/",function(req,res){
    Campground.find({},function(err, camps){
        if(err){
            console.log(err);
        }else {
        res.render("campgrounds/index",{campgrounds:camps , currentUser:req.user});
        }
    })
    })
    
router.post("/",function(req,res){
     var name = req.body.name;
     var image = req.body.image;
     var desc = req.body.description;
     var NewCampground = {title : name , image : image,description:desc};
     Campground.create(NewCampground,function(err,newlyCreated){
         if(err){
             console.log(err);
         }
         else {
    res.redirect("/campground");
         }
     })
    })
    
router.get("/new",function(req,res){
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

module.exports = router;
    