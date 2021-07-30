var express       = require("express"),
     app          = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    Campground    = require("./models/campground"),
    seedDb        = require("./seeds"),
    Comment       = require("./models/comments")

mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
seedDb();


app.get("/",function(req,res){
    res.render("landing");
})


// ================================
//   CAMPGROUND ROUTES 
//=================================
app.get("/campground",function(req,res){

Campground.find({},function(err, camps){
    if(err){
        console.log(err);
    }else {
    res.render("campgrounds/index",{campgrounds:camps});
    }
})
})

app.post("/campground",function(req,res){
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

app.get("/campground/new",function(req,res){
res.render("campgrounds/new");
})

app.get("/campground/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,camp){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground:camp});
        }
    })
})

// ================================
//   COMMENT ROUTES 
//=================================

app.get("/campground/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err,camp){
        if(err){
            console.log(err);
        }else {
    res.render("comments/new",{campground:camp});
        }
    })
})

app.post("/campground/:id/comments",function(req,res){
Campground.findById(req.params.id,function(err,campground){
    if(err){
        console.log(err);
    }else {
//add new comment 
Comment.create(req.body.comment,function(err,comment){
    if (err){
        console.log(err);
    }else {
        campground.comments.push(comment);
        campground.save();
        console.log(comment);
        res.redirect("/campground/"+campground._id);
    }
})
}
})
})
app.listen(3000,function(){
    console.log("YelpCamp server has started!!");
})