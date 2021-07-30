var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
var campgrounds = [
    {title: "Ahmed", image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {title: "Nader", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?auto=compress&cs=tinysrgb&h=350"},
    {title: "Hossam", image: "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350"},
]

app.get("/",function(req,res){
    res.render("landing");
})

app.get("/campground",function(req,res){

    res.render("campground",{campgrounds:campgrounds});
})

app.post("/campground",function(req,res){
 var name = req.body.name;
 var image = req.body.image;
 var NewCampground = {title : name , image : image};
 campgrounds.push(NewCampground);
res.redirect("/campground");
})


app.get("/campground/new",function(req,res){
res.render("new");
})
app.listen(3000,function(){
    console.log("YelpCamp server has started!!");
})