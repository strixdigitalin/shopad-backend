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
const shop = require("../models/shop");
const work = require("../models/work");
const job = require("../models/job");

// Require System
function base64Encode(file) {
  var body = fs.readFileSync(file);
  return body.toString("base64");
}

router.get("/", checkAuth, (req, res, next) => {
  shop
    .find(req.query)
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

router.post("/", checkAuth, (req, res, next) => {
  shop
    .find({ ownerId: req.body.ownerId })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Shop exists with is Owner.",
        });
      } else {
        const row = new shop({
          _id: new mongoose.Types.ObjectId(),
          description: req.body.description,
          location: req.body.location,
          shopName: req.body.shopName,
          ownerId: req.body.ownerId,
        });
        row
          .save()
          .then((result) => {
            console.log(result);
            res.status(200).json({
              status: true,
              message: "Shop is created successfully.",
              created_Shop: result,
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json(error);
          });
      }
    });
});

router.post("/byid/", checkAuth, (req, res, next) => {
  const id = req.body.id;
  shop
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
  // const id = req.body.id;
  shop
    .remove({ _id: req.body.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Shop deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/update", checkAuth, (req, res, next) => {
  const id = req.body.id;
  shop
    .update(
      { _id: id },
      {
        description: req.body.description,
        location: req.body.location,
        shopName: req.body.shopName,
      }
    )
    .exec()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json(err));
});

router.post("/active", checkAuth, (req, res, next) => {
  const id = req.body.id;
  shop
    .update({ _id: id }, { isActive: true })
    .exec()
    .then((data) => res.status(200).json({ message: "Shop Activated" }))
    .catch((err) => res.status(500).json(err));
});

router.post("/inactive", checkAuth, (req, res, next) => {
  const id = req.body.id;
  shop
    .update({ _id: id }, { isActive: false })
    .exec()
    .then((data) => res.status(200).json({ message: "Shop Inactivated" }))
    .catch((err) => res.status(500).json(err));
});

router.post("/location/", checkAuth, (req, res, next) => {
  const id = req.body.location;
  if (req.body.ask == "1") {
    shop
      .find({
        $or: [
          { location: new RegExp(id, "i") },
          { shopName: new RegExp(id, "i") },
          { description: new RegExp(id, "i") },
        ],
      })
      .select()
      .exec()
      .then((data) => {
        console.log("Data From Database" + data);
        if (data) {
          res.status(200).json({
            message: "Shop is Found",
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
  }
  if (req.body.ask == "2") {
    work
      .find({
        $or: [
          { location: new RegExp(id, "i") },
          { shopName: new RegExp(id, "i") },
          { description: new RegExp(id, "i") },
          { designationName: new RegExp(id, "i") },
          { shiftTime: new RegExp(id, "i") },
        ],
      })
      .select()
      .exec()
      .then((data) => {
        console.log("Data From Database" + data);
        if (data) {
          res.status(200).json({
            message: "Work is Found",
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
  }
  if (req.body.ask == "3") {
    job
      .find({
        $or: [
          { location: new RegExp(id, "i") },
          { shopName: new RegExp(id, "i") },
          { description: new RegExp(id, "i") },
          { designationName: new RegExp(id, "i") },
          { shiftTime: new RegExp(id, "i") },
          { firmLocation: new RegExp(id, "i") },
        ],
      })
      .select()
      .exec()
      .then((data) => {
        console.log("Data From Database" + data);
        if (data) {
          res.status(200).json({
            message: "Job is Found",
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
  }
});

module.exports = router;
