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
const SalesOffer = require("../models/salesoffer");
const salesoffer = require("../models/salesoffer");
const Like = require("../models/like");
const Comment = require("../models/comment");

// Require System
function base64Encode(file) {
  var body = fs.readFileSync(file);
  return body.toString("base64");
}
// okay

router.get("/", (req, res, next) => {
  const { searchString } = req.query;
  if (searchString) {
    SalesOffer.find({ $text: { $search: searchString } })
      .populate({ path: "ownerId" })
      .populate({ path: "cateoryId" })
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
  } else {
    SalesOffer.find()
      .populate({ path: "ownerId" })
      .populate({ path: "cateoryId" })
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
  }
  // res.status(200).json({message: 'Product not found'});
});

router.post(
  "/",
  checkAuth,
  upload.fields([
    {
      name: "offerImage",
      maxCount: 1,
    },
    {
      name: "offerImage1",
      maxCount: 1,
    },
    {
      name: "offerImage2",
      maxCount: 1,
    },
    {
      name: "offerImage3",
      maxCount: 1,
    },
    {
      name: "offerImage4",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    try {
      path0 = req.files.offerImage[0];
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
    try {
      path1 = req.files.offerImage1[0];
      var base64String = base64Encode(path1.path);
      const uploadString = "data:image/jpeg;base64," + base64String;
      const uploadResponse = await cloudinary.uploader.upload(uploadString, {
        overwrite: true,
        invalidate: true,
        crop: "fill",
      });
      var url1 = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    try {
      path2 = req.files.offerImage2[0];
      var base64String = base64Encode(path2.path);
      const uploadString = "data:image/jpeg;base64," + base64String;
      const uploadResponse = await cloudinary.uploader.upload(uploadString, {
        overwrite: true,
        invalidate: true,
        crop: "fill",
      });
      var url2 = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    try {
      path3 = req.files.offerImage3[0];
      var base64String = base64Encode(path3.path);
      const uploadString = "data:image/jpeg;base64," + base64String;
      const uploadResponse = await cloudinary.uploader.upload(uploadString, {
        overwrite: true,
        invalidate: true,
        crop: "fill",
      });
      var url3 = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    try {
      path4 = req.files.offerImage4[0];
      var base64String = base64Encode(path4.path);
      const uploadString = "data:image/jpeg;base64," + base64String;
      const uploadResponse = await cloudinary.uploader.upload(uploadString, {
        overwrite: true,
        invalidate: true,
        crop: "fill",
      });
      var url4 = uploadResponse.secure_url;
    } catch (e) {
      console.log(e);
    }
    const row = new SalesOffer({
      _id: new mongoose.Types.ObjectId(),
      ownerId: req.body.ownerId,
      cateoryId: req.body.cateoryId,
      shopId: req.body.shopId,
      description: req.body.description,
      location: req.body.location,
      offerImage: url0,
      offerImage1: url1,
      offerImage2: url2,
      offerImage3: url3,
      offerImage4: url4,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      price: req.body.price,
      code: req.body.code,
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

router.post("/byid/", checkAuth, (req, res, next) => {
  const id = req.body.id;
  like = Like.find({ itemId: req.body.id }).select().exec();
  const Comment1 = Comment.find({ itemId: req.body.id });
  SalesOffer.findById(id)
    .exec()
    .then((doc) => {
      console.log("Data From Database" + doc);
      if (doc) {
        res.status(200).json({
          data: doc,
          totallike: Like.length,
          totalcomment: Comment.length,
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
router.post("/ownerid", checkAuth, (req, res, next) => {
  SalesOffer.find({ ownerId: req.body.ownerId })
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

router.post("/categoryid", checkAuth, (req, res, next) => {
  SalesOffer.find({ cateoryId: req.body.cateoryId })
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

router.get("/delete", checkAuth, (req, res, next) => {
  const id = req.body.id;
  salesoffer
    .remove({ _id: req.body.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Sales Offer deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/uid/", checkAuth, (req, res, next) => {
  const id = req.body.id;
  salesoffer
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

// router.post("/location/", checkAuth, (req, res, next) => {
//   const id = req.body.location;
//   salesoffer
//     .find({ location: new RegExp(id, "i") })
//     .select()
//     .exec()
//     .then((data) => {
//       console.log("Data From Database" + data);
//       if (data) {
//         res.status(200).json({
//           message: "Item Found",
//           data: data,
//         });
//       } else {
//         res.status(404).json({ message: "Item Not Found" });
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).json(error);
//     });
// });
router.post("/location/", checkAuth, (req, res, next) => {
  const id = req.body.location;
  salesoffer
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
