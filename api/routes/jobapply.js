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
const jobapply = require("../models/jobapply");

// Require System
function base64Encode(file) {
  var body = fs.readFileSync(file);
  return body.toString("base64");
}

router.get("/", checkAuth, (req, res, next) => {
  jobapply
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
        res.status(404).json({ message: "Product not found" });
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
      name: "resumeLink",
      maxCount: 1,
    },
    {
      name: "policeLink",
      maxCount: 1,
    },
    {
      name: "experienceLink",
      maxCount: 1,
    },
    {
      name: "certificateLink",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    console.log(req.files);
    try {
      path1 = req.files.resumeLink[0];
      const uploadResponse = await cloudinary.uploader.upload(path1.path, {
        folder: "pdf",
      });
      console.log(uploadResponse);
      var url = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    try {
      path2 = req.files.policeLink[0];
      const uploadResponse = await cloudinary.uploader.upload(path2.path, {
        folder: "pdf",
      });
      console.log(uploadResponse);
      var url2 = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    try {
      path4 = req.files.experienceLink[0];
      const uploadResponse = await cloudinary.uploader.upload(path4.path, {
        folder: "pdf",
      });
      console.log(uploadResponse);
      var url3 = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    try {
      path3 = req.files.certificateLink[0];
      const uploadResponse = await cloudinary.uploader.upload(path3.path, {
        folder: "pdf",
      });
      console.log(uploadResponse);
      var url4 = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    const row = new jobapply({
      _id: new mongoose.Types.ObjectId(),
      jobId: req.body.jobId,
      applicantId: req.body.applicantId,
      applicantName: req.body.applicantName,
      applicantContact: req.body.applicantContact,
      applicantEmail: req.body.applicantEmail,
      resumeLink: url,
      certificateLink: url4,
      experienceLink: url3,
      policeLink: url2,
      timeStamp: new Date(),
    });
    row
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          status: true,
          message: "Offer is created successfully.",
          createdOffer: result,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  }
);

router.post("/jobId/", checkAuth, (req, res, next) => {
  const id = req.body.id;
  jobapply
    .find({ jobId: req.body.id })
    .exec()
    .then((doc) => {
      console.log("Data From Database" + doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post("/applicantId", checkAuth, (req, res, next) => {
  jobapply
    .find({ applicantId: req.body.id })
    .exec()
    .then((doc) => {
      // console.log("Data From Database"+doc);
      if (doc) {
        res.status(200).json({ message: "Data From Database", data: doc });
      } else {
        res.status(404).json({ message: "Item Not Found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.put("/selected/:id/:value", async (req, res) => {
  try {
    const data = await jobapply.findByIdAndUpdate(
      req.params.id,
      {
        isSelected: req.params.value,
      },
      { new: true }
    );
    res.status(200).send({ success: true, message: "Updated", data });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/delete", checkAuth, (req, res, next) => {
  const id = req.body.id;
  jobapply
    .remove({ _id: req.body.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Applied job successfully deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
