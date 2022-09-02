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
const jobapply = require('../models/jobapply');

// Require System
function base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString("base64");
  }

router.get('/',checkAuth,(req,res,next)=>{
    jobapply.find()
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
            res.status(404).json({message: 'Product not found'});
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
    // res.status(200).json({message: 'Product not found'});
});

router.post('/',checkAuth,upload.single('resumeLink'), async (req,res,next)=>{
    try {
        // var base64String = base64Encode(req.file.path);
        // const uploadString = "data:image/jpeg;base64," + base64String;
        const uploadResponse = await cloudinary.uploader.upload(req.file.path,{
            folder: "pdf"});
        console.log(uploadResponse);
     var url =  uploadResponse.secure_url;
      } catch (e) {
        console.log(e);
      }
    const row = new jobapply(
        {
            _id: new mongoose.Types.ObjectId(),
            jobId: req.body.jobId,
            applicantId: req.body.applicantId,
            applicantName: req.body.applicantName,
            applicantContact: req.body.applicantContact,
            applicantEmail: req.body.applicantEmail,
            resumeLink: url,
            timeStamp: new Date(),
        }
    );
    row.save().then(result=>{
        console.log(result);
        res.status(200).json({
            status: true,
            message: 'Offer is created successfully.',
            createdOffer: result,
                });
    }).catch(error=>{
        console.log(error);
        res.status(500).json(error);
    });

});


router.post('/jobId/',checkAuth,(req,res,next)=>{
    const id = req.body.id;
    jobapply.findById(id)
    .exec()
    .then(doc => {
        console.log("Data From Database"+doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({message: "Item Not Found"});
        }
    })
    .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.post('/applicantId',checkAuth,(req,res,next)=>{
    jobapply.find({applicantId: req.body.id})
    .exec()
    .then(doc => {
        // console.log("Data From Database"+doc);
        if(doc){
            res.status(200).json({message: "Data From Database", data: doc});
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
    const id = req.body.id;
    jobapply.remove({ _id: req.body.id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Applied job successfully deleted"
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

