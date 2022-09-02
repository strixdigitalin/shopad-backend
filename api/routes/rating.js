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
const rating = require('../models/rating');



// Require System
function base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString("base64");
  }

router.get('/',checkAuth,(req,res,next)=>{
    rating.find()
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
            res.status(404).json({message: 'rating not found'});
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
    // res.status(200).json({message: 'Product not found'});
});

router.post('/',checkAuth, (req,res,next)=>{
    const row = new rating(
        {
            _id: new mongoose.Types.ObjectId(),
            customerid: req.body.customerid,
            workid: req.body.workid,
            rating: req.body.rating
        }
    );
    row.save().then(result=>{
        console.log(result);
        res.status(200).json({
            status: true,
            message: 'rating is created successfully.',
            created_feedback: result,
                });
    }).catch(error=>{
        console.log(error);
        res.status(500).json(error);
    });
});

router.post('/workId/',checkAuth,(req,res,next)=>{
    const id = req.body.id;
    rating.find({workid: req.body.id})
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

module.exports = router;

