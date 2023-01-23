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
const work = require("../models/work");
const { url } = require("inspector");

// Require System
function base64Encode(file) {
  var body = fs.readFileSync(file);
  return body.toString("base64");
}

router.get("/", checkAuth, (req, res, next) => {
  work
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
        res.status(404).json({ message: "work not found" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  // res.status(200).json({message: 'Product not found'});
});

router.post(
  "/",
  checkAuth,
  upload.fields([
    {
      name: "image1",
      maxCount: 1,
    },
    {
      name: "image2",
      maxCount: 1,
    },
    {
      name: "image3",
      maxCount: 1,
    },
    {
      name: "image4",
      maxCount: 1,
    },
    {
      name: "image5",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    var url1 = null;
    var url2 = null;
    var url3 = null;
    var url4 = null;
    var url5 = null;
    try {
      // console.log(req.files);
      // return null;
      let path0 = req.files.image1[0];
      var base64String = base64Encode(path0.path);
      const uploadString = "data:image/jpeg;base64," + base64String;
      const uploadResponse = await cloudinary.uploader.upload(uploadString, {
        overwrite: true,
        invalidate: true,
        crop: "fill",
      });
      url1 = uploadResponse.secure_url;
      console.log(url1);
    } catch (e) {
      console.log(e);
    }
    // try {
    //   let path0 = req.files.image2[0];
    //   var base64String = base64Encode(path0.path);
    //   const uploadString = "data:image/jpeg;base64," + base64String;
    //   const uploadResponse = await cloudinary.uploader.upload(uploadString, {
    //     overwrite: true,
    //     invalidate: true,
    //     crop: "fill",
    //   });
    //   var url2 = uploadResponse.secure_url;
    // } catch (e) {
    //   console.log(e);
    // }
    // try {
    //   let path0 = req.files.image3[0];
    //   var base64String = base64Encode(path0.path);
    //   const uploadString = "data:image/jpeg;base64," + base64String;
    //   const uploadResponse = await cloudinary.uploader.upload(uploadString, {
    //     overwrite: true,
    //     invalidate: true,
    //     crop: "fill",
    //   });
    //   var url3 = uploadResponse.secure_url;
    // } catch (e) {
    //   console.log(e);
    // }
    // try {
    //   let path0 = req.files.image4[0];
    //   var base64String = base64Encode(path0.path);
    //   const uploadString = "data:image/jpeg;base64," + base64String;
    //   const uploadResponse = await cloudinary.uploader.upload(uploadString, {
    //     overwrite: true,
    //     invalidate: true,
    //     crop: "fill",
    //   });
    //   var url4 = uploadResponse.secure_url;
    // } catch (e) {
    //   console.log(e);
    // }
    // try {
    //   let path0 = req.files.image5[0];
    //   var base64String = base64Encode(path0.path);
    //   const uploadString = "data:image/jpeg;base64," + base64String;
    //   const uploadResponse = await cloudinary.uploader.upload(uploadString, {
    //     overwrite: true,
    //     invalidate: true,
    //     crop: "fill",
    //   });
    //   var url5 = uploadResponse.secure_url;
    // } catch (e) {
    //   console.log(e);
    // }
    const row = new work({
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
      name: req.body.name,
      image1: url1,
      image2: url2,
      image3: url3,
      image4: url4,
      image5: url5,
    });
    row
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          status: true,
          message: "work is created successfully.",
          created_work: result,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ success: false, message: error.message });
      });
  }
);

router.post("/byid/", checkAuth, (req, res, next) => {
  const id = req.body.id;
  work
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
  work
    .remove({ _id: req.body.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "work deleted",
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
  work
    .update({ _id: id }, { isActive: true })
    .exec()
    .then((data) => res.status(200).json({ message: "work Activated" }))
    .catch((err) => res.status(500).json(err));
});

router.post("/inactive", checkAuth, (req, res, next) => {
  const id = req.body.id;
  work
    .update({ _id: id }, { isActive: false })
    .exec()
    .then((data) => res.status(200).json({ message: "work Inactivated" }))
    .catch((err) => res.status(500).json(err));
});

router.post("/uid/", checkAuth, (req, res, next) => {
  const id = req.body.id;
  work
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

router.post("/location/", checkAuth, (req, res, next) => {
  const id = req.body.location;
  work
    .find({ location: new RegExp(id, "i") })
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
