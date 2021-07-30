var express       = require("express"),
     app          = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    Campground    = require("./models/campground"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    User          = require("./models/users"),
    seedDb        = require("./seeds"),
    Comment       = require("./models/comments");

mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname +"/public"));
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
seedDb();


app.get("/",function(req,res){
    res.render("landing");
})
// configure to use passport
passport.use(new localStrategy(User.authenticate()));
app.use(require("express-session")({
    secret:"Hello",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================================
//   CAMPGROUND ROUTES 
//=================================
app.get("/campground",function(req,res){
Campground.find({},function(err, camps){
    if(err){
        console.log(err);
    }else {
    res.render("campgrounds/index",{campgrounds:camps , currentUser:req.user});
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

app.get("/campground/:id/comments/new",isLoggedIn,function(req,res){
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

// ================================
//   Auth ROUTES 
// //=================================
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campground");
        });
    })
})

app.get("/login",function(req,res){
    res.render("login");
})

app.post("/login",passport.authenticate("local",
{
    successRedirect:"/campground",
    failureRedirect:"/login"
}
),function(req,res){
})

app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/campground");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
       return next();
        }
        res.redirect("/login");
}
app.listen(3000,function(){
    console.log("YelpCamp server has started!!");
})