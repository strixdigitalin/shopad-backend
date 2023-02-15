const mongoose = require("mongoose");
const users = require("./users");
const salesofferScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: { type: String, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  location: { type: String, required: true },
  shopName: { type: String, required: true },
  facebookId: { type: String },
  emailId: { type: String },
  websiteAddress: { type: String },
  instaId: { type: String },
  designationName: { type: String, required: true },
  salary: { type: String, required: true },
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactEmail: { type: String, required: true },
  image1: { type: String },
  image2: { type: String },
  image3: { type: String },
  image4: { type: String },
  image: { type: String },
  shiftTime: { type: String, required: true, enum: ["day", "night"] },
});
salesofferScheme.index({
  location: "text",
  description: "text",
  name: "text",
  shopName: "text",
});

module.exports = mongoose.model("Work", salesofferScheme);
