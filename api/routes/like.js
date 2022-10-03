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

// Require System
function base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString("base64");
  }

  router.post('/addlike',checkAuth, (req,res,next)=>{
    like.find({ itemId: req.body.itemId,
        likedBy: req.body.likedBy })
      .exec()
      .then(follw => {
        if (follw.length >= 1) {
          return res.status(400).json({
            message: "Already Liked"
          });
        }else{
    const row = new like(
        {
            _id: new mongoose.Types.ObjectId(),
            itemId: req.body.itemId,
            likedBy: req.body.likedBy
        }
    );
    row.save().then(result=>{
        console.log(result);
        res.status(200).json({
            status: true,
            message: 'Liked Sucessfully.',
            created_feedback: result,
                });
    }).catch(error=>{
        console.log(error);
        res.status(500).json(error);
    });
  }});
});

router.post('/unlike',checkAuth, (req,res,next)=>{
    like.findOneAndDelete({ itemId: req.body.itemId,
        likedBy: req.body.likedBy })
      .then(follw => {
          return res.status(400).json({
            message: "Unliked Sucessfully"
        });
    });  
});

router.post('/likecountbyitem',checkAuth, (req,res,next)=>{
  like.find({ userId: req.body.itemId})
  .select()
  .exec()
  .then(data => {
      if(data){
          const respose ={
              message: 'Total Count and Like Id in likedBy Field',
              count: data.length,
              data: data,
          };
          res.status(200).json(respose);
        }});
});

module.exports = router;

