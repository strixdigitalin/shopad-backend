const mongoose = require("mongoose");
const users = require("./users");
const salesofferScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: {
    type: String,
    required: true,
    ref: users,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  location: { type: String, required: true },
  firmLocation: { type: String, required: false },
  gender: { type: String, required: false },
  areaWork: { type: String, required: false },
  numberWork: { type: String, required: false },
  experienceRequired: { type: String, required: false },
  manpowerNumber: { type: String, required: false },
  workTiming: { type: String, required: false },
  facilities: { type: JSON, required: false },
  incentiveOffered: { type: String, required: false },
  interviewTiming: { type: String, required: false },
  vechileRequired: { type: String, required: false },
  message: { type: String, required: false },
  isCv: { type: Boolean, required: true, default: false },
  isCertificate: { type: Boolean, required: true, default: false },
  isCertificate: { type: Boolean, required: true, default: false },
  isPolice: { type: Boolean, required: true, default: false },
  shopName: { type: String, required: true },
  designationName: { type: String, required: false },
  salary: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactEmail: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});
salesofferScheme.index({
  location: "text",
  description: "text",
  title: "text",
  shopName: "text",
});

module.exports = mongoose.model("Job", salesofferScheme);
