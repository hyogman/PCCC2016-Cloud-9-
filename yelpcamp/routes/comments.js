var express = require("express");
var router = express.Router({ mergeParams: true }); 
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});


// comments create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               comment.author.id = req.user._id; 
               comment.author.username = req.user.username; 
               comment.save(); 
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Created comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
  
});

router.get("/:comments_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comments_id, function(err, foundComment) {
       if(err) {
           res.redirect("back");
       } else {
        res.render("comments/edit", { campground_id: req.params.id, comment:foundComment }); 
       }
   });
   
});

router.put("/:comments_id",middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment){
      if(err) {
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

router.delete("/:comments_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comments_id, function(err){
       if(err) {
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});




module.exports = router;