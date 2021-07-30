var express       = require("express"),
     app          = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose");


mongoose.connect("mongodb://localhost/yelp_camp");


var CampgroundSchema = new mongoose.Schema({
    title: String,
    image : String,
    description : String
});

var Campground = mongoose.model("Campground",CampgroundSchema);


// Campground.create({
//     title: "Nader", 
//     image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?auto=compress&cs=tinysrgb&h=350",
//     description : "this is bla bla bla bla"
// },function(err,camps){
//     if(err){
//         console.log(err);
//     }else {
//         console.log("You added:");
//         console.log(camps);
//     }
// })
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("landing");
})

app.get("/campground",function(req,res){

Campground.find({},function(err, camps){
    if(err){
        console.log(err);
    }else {
    res.render("index",{campgrounds:camps});
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
res.render("new");
})

app.get("/campground/:id",function(req,res){
    Campground.findById(req.params.id,function(err,camp){
        if(err){
            console.log(err);
        }else{
            res.render("show",{campground:camp});
        }
    })
})


app.listen(3000,function(){
    console.log("YelpCamp server has started!!");
})