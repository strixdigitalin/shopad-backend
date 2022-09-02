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
const { exec } = require('child_process');
const chat = require('../models/chat');
// const { find } = require('../models/chat');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
   }
   return result;
  }

// Require System
function base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString("base64");
  }


router.post('/',checkAuth, async (req,res,next)=>{
    temp = await chat.find({
        to: req.body.to,
        from: req.body.from,
    }).exec();
    console.log(temp);
    if(temp.length > 0){
        // console.log("foundIndex is old");
        id = chat.find({
            to: req.body.to,
            from: req.body.from,
        }).exec();
        chatid = temp[0];
        const row = new chat(
            {
                _id: new mongoose.Types.ObjectId(),
                chatid: chatid.chatid,
                to: req.body.to,
                from: req.body.from,
                message: req.body.message,
                timestamp: new Date().getTime()
            }
        );
        row.save().then(result=>{
            console.log(result);
            res.status(200).json({
                status: true,
                message: 'chat is created successfully.',
                created_chat: result,
                    });
        }).catch(error=>{
            console.log(error);
            res.status(500).json(error);
        });
    }
    else{
        // console.log("foundIndex is new");
        const row = new chat(
            {
                _id: new mongoose.Types.ObjectId(),
                chatid: makeid(25),
                to: req.body.to,
                from: req.body.from,
                message: req.body.message,
                timestamp: new Date().getTime()
            }
        );
        row.save().then(result=>{
            console.log(result);
            res.status(200).json({
                status: true,
                message: 'chat is created successfully.',
                created_chat: result,
                    });
        }).catch(error=>{
            console.log(error);
            res.status(500).json(error);
        });
    }
});

router.post('/chatId/',checkAuth,(req,res,next)=>{
    const id = req.body.cid;
    chat.find({chatid:req.body.cid})
    .select()
    .exec()
    .then(data => {
        console.log("Data From Database"+data);
        if(data){
            res.status(200).json({
                message: "Chat Found",
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

