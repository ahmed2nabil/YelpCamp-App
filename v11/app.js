var express       = require("express"),
     app          = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    Campground    = require("./models/campground"),
    middelware    = require("./middleware"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User          = require("./models/users"),
    seedDb        = require("./seeds"),
    Comment       = require("./models/comments");


var  commentRoutes      = require("./routes/comments"),
     campgroundRoutes   = require("./routes/campgrounds"),
     indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v11");
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname +"/public"));

// app.use();
// /seedDb();

// configure to use passport
app.use(require("express-session")({
    secret:"Hello",
    resave:false,
    saveUninitialized:false
}));
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error   = req.flash("error");
    res.locals.success   = req.flash("success");
    next();
})
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));


app.use("/campground/:id/comments",commentRoutes);
app.use("/campground",campgroundRoutes);
app.use("/",indexRoutes);

app.listen(3000,function(){
    console.log("YelpCamp server has started!!");
})