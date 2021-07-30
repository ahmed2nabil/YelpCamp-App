var express     = require("express"),
    router      = express.Router({mergeParams:true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comments");



router.get("/new",isLoggedIn,function(req,res){
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
        console.log(err);
    }else {
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        campground.comments.push(comment);
        campground.save();
        console.log(comment);
        res.redirect("/campground/"+campground._id);
    }
})
}
})
})

   //Edit Comment Route 
 router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
        Comment.findById(req.params.comment_id,function(err,comment){
            if(err){
                res.redirect("back")
            }else {
                res.render("comments/edit",{comment:comment,campground_id:req.params.id});
            }
        })
})

router.put("/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedCamp){
        if(err){
            res.redirect("back");
        }else {
            res.redirect("/campground/"+ req.params.id );
        }
    })
})

//Delete Route
router.delete("/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        res.redirect("/campground/"+req.params.id);
    })
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
       return next();
        }
        res.redirect("/login");
}


function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("/campground")
        }else {
            if(foundComment.author.id.equals(req.user._id)){
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
