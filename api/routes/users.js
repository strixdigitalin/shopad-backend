const express = require("express");
const router = express.Router();
const User = require("../models/users");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/users");
const nodemail = require("../utils/nodemailer");
const checkAuth = require("../middleware/check-auth");
const follwers = require("../models/follwers");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const fs = require("fs");
const QRCode = require("qrcode");

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function base64Encode(file) {
  var body = fs.readFileSync(file);
  return body.toString("base64");
}

router.get("/", (req, res, next) => {
  users
    .find()
    .select()
    .exec()
    .then((data) => {
      if (data) {
        const respose = {
          message: "Data Fetched successfully",
          count: data.length,
          data: data,
        };
        res.status(200).json(respose);
      } else {
        res.status(404).json({ message: "Users not found" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  // res.status(200).json({message: 'Product not found'});
});

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  console.log(req.body.email);
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              name: req.body.name,
              mobile: req.body.mobile,
              userType: req.body.userType,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result._id);
                console.log(result._id);
                console.log(result._id);
                console.log(result._id);
                console.log(result._id);
                console.log(result._id);
                console.log(result._id);
                let tid = result._id;
                // console.log(tid);
                let qrlink = "https://strixdigital.in/shop-ad?uid=";
                console.log(qrlink);
                console.log(qrlink.concat(result._id));
                let data = {
                  link: qrlink.concat(result._id),
                };
                // Converting the data into String format
                let stringdata = JSON.stringify(data);
                // Print the QR code to terminal
                Qrcode = QRCode.toDataURL(
                  qrlink.concat(result._id),
                  { type: "png" },
                  async function (err, QRcode) {
                    if (err) return console.log("error occurred");
                    // console.log('--------------------------------');
                    // console.log('--------------------------------');
                    // console.log(QRcode);
                    // console.log('--------------------------------');
                    // console.log('--------------------------------');
                    try {
                      // var base64String = base64Encode(QRcode);
                      const uploadString = QRcode;
                      const uploadResponse = await cloudinary.uploader.upload(
                        uploadString,
                        {
                          overwrite: true,
                          invalidate: true,
                          crop: "fill",
                        }
                      );
                      var url = uploadResponse.secure_url;
                    } catch (e) {
                      console.log(e);
                    }
                    // Printing the generated code
                    User.update(
                      { _id: result._id },
                      {
                        qrImage: url,
                      }
                    ).exec(),
                      res.status(201).json({
                        message: "User created",
                        user: result,
                      });
                    console.log(QRcode);
                  }
                );
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

//   router.delete("/:userId", (req, res, next) => {
//     User.remove({ _id: req.params.userId })
//       .exec()
//       .then(result => {
//         res.status(200).json({
//           message: "User deleted"
//         });
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({
//           error: err
//         });
//       });
//   });

router.post("/login", async (req, res, next) => {
  console.log("herere", req.body);
  let { email } = req.body;
  const user = await User.find({ email });
  console.log(user, "<<< this is user");
  bcrypt.compare(req.body.password, user[0].password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    if (result) {
      const token = jwt.sign(
        {
          email: user[0].email,
          userId: user[0]._id,
        },
        "xirtS"
      );
      return res.status(200).json({
        message: "Auth successful",
        user: user,
        token: token,
      });
    }
    res.status(401).json({
      message: "Auth failed",
    });
  });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const updateOPs = {};
  for (const ops of req.body) {
    updateOPs[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOPs })
    .exec()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json(err));
});

router.post("/resetToken", (req, res, next) => {
  users
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(409).json({
          message: "Your Email is not registered with us.",
        });
      } else {
        const token = makeid(8);
        users
          .update(
            { email: req.body.email },
            {
              resetToken: token,
            }
          )
          .then((result) => {
            let mailOptions = {
              from: process.env.MAIL_USERNAME,
              to: req.body.email,
              subject: "Shop AD Password Reset",
              text:
                "Hi, Your Forgot Token is " +
                token +
                " . Please enter this is your app. Don not share with others.",
            };
            nodemail.sendMail(mailOptions, function (err, data) {
              if (err) {
                console.log("Error " + err);
              } else {
                console.log("Email sent successfully");
              }
            });
            console.log(result);
            res.status(200).json({
              status: true,
              message: "Email sent successfully.",
              update_status: result,
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json(error);
          });
      }
    });
});

router.post("/setpassword", (req, res, next) => {
  User.find({
    email: req.body.email,
    resetToken: req.body.resetToken,
  })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(409).json({
          message: "Mail Does not exist or Token is invalid",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            users
              .update(
                { email: req.body.email },
                {
                  resetToken: null,
                  password: hash,
                }
              )
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User Updated",
                  user: result,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.post(
  "/update",
  checkAuth,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "certificate",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    try {
      path0 = req.files.image[0];
      var base64String = base64Encode(path0.path);
      const uploadString = "data:image/jpeg;base64," + base64String;
      const uploadResponse = await cloudinary.uploader.upload(uploadString, {
        overwrite: true,
        invalidate: true,
        crop: "fill",
      });
      var url0 = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    var certificateUrl = req.body.experineceCertificate;
    var policeUrl = req.body.policeVerification;
    var resume = req.body.resume;

    try {
      path1 = req.files.certificate[0];
      var base64String = base64Encode(path1.path);
      const uploadString = "data:image/jpeg;base64," + base64String;
      const uploadResponse = await cloudinary.uploader.upload(uploadString, {
        overwrite: true,
        invalidate: true,
        crop: "fill",
      });
      certificateUrl = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    try {
      path1 = req.files.resume[0];
      var base64String = base64Encode(path1.path);
      const uploadString = "data:image/jpeg;base64," + base64String;
      const uploadResponse = await cloudinary.uploader.upload(uploadString, {
        overwrite: true,
        invalidate: true,
        crop: "fill",
      });
      resume = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    try {
      path1 = req.files.police[0];
      var base64String = base64Encode(path1.path);
      const uploadString = "data:image/jpeg;base64," + base64String;
      const uploadResponse = await cloudinary.uploader.upload(uploadString, {
        overwrite: true,
        invalidate: true,
        crop: "fill",
      });
      policeUrl = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    User.find({ email: req.body.email, _id: req.body.uid })
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return res.status(409).json({
            message: "User Not Exist",
          });
        } else {
          User.update(
            { _id: req.body.uid, email: req.body.email },
            {
              name: req.body.name,
              mobile: req.body.mobile,
              userType: req.body.userType,
              userProfile: url0,
              certificate: certificateUrl,
              policeVerification: policeUrl,
              resume: resume,
              certificateUrl,
              fathername: req.body.fathername,
              mothername: req.body.mothername,
              pAddress: req.body.pAddress,
              rAddress: req.body.rAddress,
              googleAdd: req?.body?.googleAdd ? req.body?.googleAdd : null,
              certifiedCourse: req.body.certifiedCourse,
              experienceYears: req.body.experienceYears,
              religion: req.body.religion,
              physicalDisablity: req.body.physicalDisablity,
              martialStatus: req.body.martialStatus,
              experineceCertificate: req.body.experineceCertificate,
              eduction: req.body.eduction,
              purposeOfRegistration: req.body.purposeOfRegistration,
              categoryOfShop: req.body.categoryOfShop,
            }
          )
            .exec()
            .then((result) => {
              console.log(result);
              res.status(201).json({
                message: "User Updated",
                user: result,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        }
      });
  }
);

router.post("/addpayment", checkAuth, (req, res, next) => {
  User.find({ email: req.body.email, _id: req.body.uid })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(409).json({
          message: "User Not Exist",
        });
      } else {
        User.update(
          { _id: req.body.uid, email: req.body.email },
          {
            isSubscribed: req.body.isSubscribed,
            subscriptionId: req.body.subscriptionId,
            transactionId: req.body.transactionId,
          }
        )
          .exec()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "Payment Updated",
              user: result,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
});

router.post("/active", checkAuth, (req, res, next) => {
  const id = req.body.id;
  User.update({ _id: id }, { isActive: true })
    .exec()
    .then((data) => res.status(200).json({ message: "User Activated" }))
    .catch((err) => res.status(500).json(err));
});

router.post("/inactive", checkAuth, (req, res, next) => {
  const id = req.body.id;
  User.update({ _id: id }, { isActive: false })
    .exec()
    .then((data) => res.status(200).json({ message: "User Inactivated" }))
    .catch((err) => res.status(500).json(err));
});

router.post("/uid/", (req, res, next) => {
  const id = req.body.id;
  users
    .find({ _id: req.body.id })
    .select()
    .exec()
    .then((data) => {
      console.log("Data From Database", data);
      if (data) {
        res.status(200).json({ data });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }
    })

    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post("/addfollwer", checkAuth, (req, res, next) => {
  follwers
    .find({ userId: req.body.userId, follwedId: req.body.follwedId })
    .exec()
    .then((follw) => {
      if (follw.length >= 1) {
        return res.status(400).json({
          message: "Already Follwed",
        });
      } else {
        const row = new follwers({
          _id: new mongoose.Types.ObjectId(),
          userId: req.body.userId,
          follwedId: req.body.follwedId,
        });
        row
          .save()
          .then((result) => {
            console.log(result);
            res.status(200).json({
              status: true,
              message: "Follwed Sucessfully.",
              created_feedback: result,
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json(error);
          });
      }
    });
});

router.post("/unfollow", checkAuth, (req, res, next) => {
  follwers
    .remove({ userId: req.body.userId, follwedId: req.body.follwedId })
    .exec()
    .then((follw) => {
      return res.status(400).json({
        message: "Unfollowed Sucessfully",
      });
    });
});
router.post("/followcountbyid", checkAuth, (req, res, next) => {
  follwers
    .find({ follwedId: req.body.userId })
    .select()
    .exec()
    .then((data) => {
      if (data) {
        const respose = {
          message: "Follwer COunt of Follwed ID",
          count: data.length,
          data: data,
        };
        res.status(200).json(respose);
      }
    });
});
router.post("/followingcountbyid", checkAuth, (req, res, next) => {
  follwers
    .find({ userId: req.body.userId })
    .select()
    .exec()
    .then((data) => {
      if (data) {
        const respose = {
          message: "Following Count of User Id",
          count: data.length,
          data: data,
        };
        res.status(200).json(respose);
      }
    });
});
module.exports = router;
