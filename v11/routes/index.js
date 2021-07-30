var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/users"),
    passport    = require("passport");

router.get("/",function(req,res){
    res.render("landing");
})

router.get("/register",function(req,res){
    res.render("register");
})
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
             req.flash("success","Welcome to Yelp Camp "+ user.username);
            res.redirect("/campground");
        });
    })
})

router.get("/login",function(req,res){
    res.render("login");
})

router.post("/login",passport.authenticate("local",
{
    successRedirect:"/campground",
    failureRedirect:"/login"
}
),function(req,res){

})

router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Logged you out");
    res.redirect("/campground");
})



module.exports = router;