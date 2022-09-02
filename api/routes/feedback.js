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
const feedback = require('../models/feedback');



// Require System
function base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString("base64");
  }

router.get('/',checkAuth,(req,res,next)=>{
    feedback.find()
    .select()
    .exec()
    .then(data => {
        if(data){
            const respose ={
                message: 'Data Fetched successfully',
                count: data.length,
                data: data,
            };
            res.status(200).json(respose);
        }else{
            res.status(404).json({message: 'feedback not found'});
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
    // res.status(200).json({message: 'Product not found'});
});

router.post('/',checkAuth, (req,res,next)=>{
    const row = new feedback(
        {
            _id: new mongoose.Types.ObjectId(),
            customerNumber: req.body.customerNumber,
            customerEmail: req.body.customerEmail,
            customerName: req.body.customerName,
            feedbackNumber: req.body.feedbackNumber,
            feedbackFor: req.body.feedbackFor,
            feedback: req.body.feedback,
        }
    );
    row.save().then(result=>{
        console.log(result);
        res.status(200).json({
            status: true,
            message: 'feedback is created successfully.',
            created_feedback: result,
                });
    }).catch(error=>{
        console.log(error);
        res.status(500).json(error);
    });
});

router.post('/fbFor/',checkAuth,(req,res,next)=>{
    const id = req.body.feedbackFor;
    feedback.find({feedbackFor: req.body.feedbackFor})
    .select()
    .exec()
    .then(data => {
        console.log("Data From Database"+data);
        if(data){
            res.status(200).json({
                message: "Item Found",
                data: data
            });
        }else{
            res.status(404).json({message: "Item Not Found"});
        }
    })
    .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.post('/byId/',checkAuth,(req,res,next)=>{
    const id = req.body.id;
    feedback.find({feedbackNumber: req.body.id})
    .select()
    .exec()
    .then(data => {
        console.log("Data From Database"+data);
        if(data){
            res.status(200).json({
                message: "Item Found",
                data: data
            });
        }else{
            res.status(404).json({message: "Item Not Found"});
        }
    })
    .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.get('/delete',checkAuth,(req,res,next)=>{
    feedback.remove({ _id: req.body.id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "feedback deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

module.exports = router;

