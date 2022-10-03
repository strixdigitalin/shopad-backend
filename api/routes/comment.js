// Require Modules
const express = require('express') ;
const router  = express.Router();
const mongoose = require('mongoose');
const { json } = require('body-parser');
const fs = require('fs');

// Require Files
const checkAuth = require('../middleware/check-auth');
const cloudinary = require('../utils/cloudinary');  
const upload = require('../utils/multer');
const shop = require('../models/shop');
const like = require('../models/like');
const comment = require('../models/comment');

// Require System
function base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString("base64");
  }

  router.post('/addcomment',checkAuth, (req,res,next)=>{
    const row = new comment(
        {
            _id: new mongoose.Types.ObjectId(),
            itemId: req.body.itemId,
            commentBy: req.body.commentBy,
            comment: req.body.comment
        }
    );
    row.save().then(result=>{
        console.log(result);
        res.status(200).json({
            status: true,
            message: 'Comment Sucessfully.',
            created_feedback: result,
                });
    }).catch(error=>{
        console.log(error);
        res.status(500).json(error);
    });
});

router.post('/delete',checkAuth, (req,res,next)=>{
    comment.findOneAndDelete({ _id: req.body.itemId })
      .then(follw => {
          return res.status(400).json({
            message: "Uncomment Sucessfully"
        });
    });  
});

router.post('/commentbyitem',checkAuth, (req,res,next)=>{
  comment.find({ userId: req.body.itemId})
  .select()
  .exec()
  .then(data => {
      if(data){
          const respose ={
            message: 'Total Count and Comment Id in likedBy Field',
            count: data.length,
            data: data,
        };
        res.status(200).json(respose);
    }});
});

module.exports = router;

