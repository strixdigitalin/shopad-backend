// Require Modules
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { json } = require("body-parser");
const fs = require("fs");

// Require Files
const checkAuth = require("../middleware/check-auth");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const job = require("../models/job");

// Require System
function base64Encode(file) {
  var body = fs.readFileSync(file);
  return body.toString("base64");
}

router.get("/", (req, res, next) => {
  job
    .find()
    .populate({ path: "ownerId" })
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
        res.status(404).json({ message: "Job not found" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  // res.status(200).json({message: 'Product not found'});
});

router.post("/", checkAuth, (req, res, next) => {
  const row = new job({
    _id: new mongoose.Types.ObjectId(),
    description: req.body.description,
    title: req.body.title,
    location: req.body.location,
    firmLocation: req.body.firmLocation,
    shopName: req.body.shopName,
    ownerId: req.body.ownerId,
    designationName: req.body.designationName,
    salary: req.body.salary,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    gender: req.body.gender,
    areaWork: req.body.areaWork,
    numberWork: req.body.numberWork,
    experienceRequired: req.body.experienceRequired,
    manpowerNumber: req.body.manpowerNumber,
    workTiming: req.body.workTiming,
    facilities: req.body.facilities,
    incentiveOffered: req.body.incentiveOffered,
    interviewTiming: req.body.interviewTiming,
    vechileRequired: req.body.vechileRequired,
    message: req.body.message,
    isCv: req.body.isCv,
    isCertificate: req.body.isCertificate,
    isExperience: req.body.isExperience,
    isPolice: req.body.isPolice,
    contactNumber: req.body.contactNumber,
    contactEmail: req.body.contactEmail,
  });
  row
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        status: true,
        message: "job is created successfully.",
        created_job: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post("/byid/", checkAuth, (req, res, next) => {
  const id = req.body.id;
  job
    .find({ ownerId: req.body.id })
    .select()
    .exec()
    .then((data) => {
      console.log("Data From Database" + data);
      if (data) {
        res.status(200).json({
          message: "Item Found",
          data: data,
        });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.get("/delete", checkAuth, (req, res, next) => {
  job
    .remove({ _id: req.body.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "job deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/active", checkAuth, (req, res, next) => {
  const id = req.body.id;
  job
    .update({ _id: id }, { isActive: true })
    .exec()
    .then((data) => res.status(200).json({ message: "Job Activated" }))
    .catch((err) => res.status(500).json(err));
});

router.post("/inactive", checkAuth, (req, res, next) => {
  const id = req.body.id;
  job
    .update({ _id: id }, { isActive: false })
    .exec()
    .then((data) => res.status(200).json({ message: "Job Inactivated" }))
    .catch((err) => res.status(500).json(err));
});
router.post("/uid/", checkAuth, (req, res, next) => {
  const id = req.body.id;
  job
    .find({ _id: req.body.id })
    .select()
    .exec()
    .then((data) => {
      // console.log("Data From Database"+data);
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

//   router.post('/location/',checkAuth,(req,res,next)=>{
//     const id = req.body.location;
//     job.find({location: new RegExp(id, 'i')})
//     .select()
//     .exec()
//     .then(data => {
//         console.log("Data From Database"+data);
//         if(data){
//             res.status(200).json({
//                 message: "Item Found",
//                 data: data
//             });
//         }else{
//             res.status(404).json({message: "Item Not Found"});
//         }
//     })
//     .catch(error => {
//             console.log(error);
//             res.status(500).json(error);
//         });
// });
router.post("/location/", checkAuth, (req, res, next) => {
  const id = req.body.location;
  job
    .find({ $text: { $search: id } })
    .select()
    .exec()
    .then((data) => {
      console.log("Data From Database" + data);
      if (data) {
        res.status(200).json({
          message: "Item Found",
          data: data,
        });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

module.exports = router;
