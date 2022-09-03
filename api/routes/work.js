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
const work = require('../models/work');



// Require System
function base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString("base64");
  }

router.get('/',checkAuth,(req,res,next)=>{
    work.find()
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
            res.status(404).json({message: 'work not found'});
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
    // res.status(200).json({message: 'Product not found'});
});

router.post('/',checkAuth, (req,res,next)=>{
    const row = new work(
        {
            _id: new mongoose.Types.ObjectId(),
            description: req.body.description,
            location: req.body.location,
            shopName: req.body.shopName,
            ownerId: req.body.ownerId,
            designationName: req.body.designationName,
            salary: req.body.salary,
            shiftTime: req.body.shiftTime,
            contactNumber: req.body.contactNumber,
            contactEmail: req.body.contactEmail,
        }
    );
    row.save().then(result=>{
        console.log(result);
        res.status(200).json({
            status: true,
            message: 'work is created successfully.',
            created_work: result,
                });
    }).catch(error=>{
        console.log(error);
        res.status(500).json(error);
    });
});

router.post('/byid/',checkAuth,(req,res,next)=>{
    const id = req.body.id;
    work.find({ownerId: req.body.id})
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
    work.remove({ _id: req.body.id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "work deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

router.post('/active',checkAuth, (req,res,next)=>{
    const id = req.body.id;
    work.update({_id:id},{isActive:true})
    .exec()
    .then(data => res.status(200).json({message: "work Activated"}))
    .catch(err => res.status(500).json(err));
});

router.post('/inactive',checkAuth, (req,res,next)=>{
    const id = req.body.id;
    work.update({_id:id},{isActive:false})
    .exec()
    .then(data => res.status(200).json({message: "work Inactivated"}))
    .catch(err => res.status(500).json(err));
});

router.post('/uid/',checkAuth,(req,res,next)=>{
    const id = req.body.id;
    work.find({_id: req.body.id})
    .select()
    .exec()
    .then(data => {
        // console.log("Data From Database"+data);
        if(data){
            res.status(200).json({data});
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

