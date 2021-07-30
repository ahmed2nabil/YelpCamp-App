var express     = require("express"),
    router      = express.Router({mergeParams:true}),
    Campground  = require("../models/campground"),
    middleware    = require("../middleware"),
    Comment     = require("../models/comments");



router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,camp){
        if(err){
            console.log(err);
        }else {
    res.render("comments/new",{campground:camp});
        }
    })
})

router.post("/",function(req,res){
Campground.findById(req.params.id,function(err,campground){
    if(err){
        console.log(err);
    }else {
//add new comment 
Comment.create(req.body.comment,function(err,comment){
    if (err){
        req.flash("error","Oops!! something went wrong");
        console.log(err);
    }else {
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        campground.comments.push(comment);
        campground.save();
        console.log(comment);
        req.flash("sucess","Succesfully added comment");
        res.redirect("/campground/"+campground._id);
    }
})
}
})
})

   //Edit Comment Route 
 router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
        Comment.findById(req.params.comment_id,function(err,comment){
            if(err){
                req.flash("error","Oops!! something went wrong");
                res.redirect("back")
            }else {
                res.render("comments/edit",{comment:comment,campground_id:req.params.id});
            }
        })
})

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedCamp){
        if(err){
            
            res.redirect("back");
        }else {
            res.redirect("/campground/"+ req.params.id );
        }
    })
})

//Delete Route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        req.flash("success","Successfully deleted");
        res.redirect("/campground/"+req.params.id);
    })
})


module.exports = router;
