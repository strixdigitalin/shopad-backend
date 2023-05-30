// Require Modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { json } = require('body-parser');
const fs = require('fs');

// Require Files
const checkAuth = require('../middleware/check-auth');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const coupon = require('../models/coupon');
const { exec } = require('child_process');



// Require System
function base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString("base64");
}

router.get('/', checkAuth, (req, res, next) => {
    coupon.find()
        .select()
        .exec()
        .then(data => {
            if (data) {
                const respose = {
                    message: 'Data Fetched successfully',
                    count: data.length,
                    data: data,
                };
                res.status(200).json(respose);
            } else {
                res.status(404).json({ message: 'coupon not found' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
    // res.status(200).json({message: 'Product not found'});
});

router.post('/', checkAuth, (req, res, next) => {
    const row = new coupon(
        {
            _id: new mongoose.Types.ObjectId(),
            code: req.body.code,
            discount: req.body.discount,
            count: req.body.count,
            user: req.body.user,
            subCoupan: req.body.subCoupan
        }
    );

    row.save().then(result => {
        console.log(result);
        res.status(200).json({
            status: true,
            message: 'coupon is created successfully.',
            created_coupon: result,
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

router.post('/addUser', checkAuth, async (req, res, next) => {
    try {
        const user=req.body.userId;
        const coupan=req.body.coupan;

        const check=await coupon.findOne({subCoupan: {$elemMatch: {coupanCode: coupan}}});

        if(check)
        {
            let checkUser=check.subCoupan.find(x=>x.users.includes(user));
            if(!checkUser)
            {
                // let users=checkUser.users;
                // users.push(user);

                // let subCoupan1=check.subCoupan;
                // let subCoupan=[];
                // for(let i of subCoupan1)
                // {
                //     if(i.coupanCode===coupan)
                //     {
                //         subCoupan.push({
                //             coupanCode: i.coupanCode,
                //             users: users.concat(user)
                //         });
                //     }
                //     else
                //     {
                //         subCoupan.push(i);
                //     }
                // }

                let subCoupan=check.subCoupan;
                let coupanIndex=check.subCoupan.findIndex(x=>x.coupanCode===coupan);
                subCoupan[coupanIndex]={
                    ...subCoupan[coupanIndex],
                    users: subCoupan[coupanIndex].users.concat(user)
                };

                await coupon.findByIdAndUpdate(check._id, {$set: {subCoupan}},{new: true});
                res.json({success: true, message: 'Coupan applied'});
            }
            else
            {
                return res.status(400).json({success: false, message: 'Coupan already applied'});
            }
        }
        else
        {
            return res.status(400).json({success: false, message: 'Coupan does not exists'});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.post('/couponId/', checkAuth, (req, res, next) => {
    const id = req.body.cid;
    coupon.findById(req.body.cid)
        .select()
        .exec()
        .then(data => {
            console.log("Data From Database" + data);
            if (data) {
                res.status(200).json({
                    message: "Item Found",
                    data: data
                });
            } else {
                res.status(404).json({ message: "Item Not Found" });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

router.get('/delete', checkAuth, (req, res, next) => {
    coupon.remove({ _id: req.body.id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "coupon deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/useCoupon', checkAuth, (req, res, next) => {
    coupon.find({ code: req.body.code })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(409).json({
                    message: "Coupon doesn't exists."
                });
            } else {
                temp = user[0];
                coupon.update({ _id: temp._id }, {
                    count: temp.count - 1,
                }).
                    exec().then(result => {
                        console.log(result);
                        res.status(200).json({
                            status: true,
                            message: 'Coupon Code is reddemed successfully.',
                            update_coupon: temp,
                        });
                    }).catch(error => {
                        console.log(error);
                        res.status(500).json(error);
                    });
            }
        });
});

router.post('/delete', checkAuth, (req, res, next) => {
    const id = req.body.id;
    coupon.remove({ _id: id })
        .exec()
        .then(data => res.status(200).json({ message: "Coupon deleted" }))
        .catch(err => res.status(500).json(err));
});

module.exports = router;
