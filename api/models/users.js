const mongoose = require("mongoose");

const productScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  fathername: { type: String, required: false },
  mothername: { type: String, required: false },
  pAddress: { type: String, required: false },
  rAddress: { type: String, required: false },
  certifiedCourse: { type: String, required: false },
  experienceYears: { type: String, required: false },
  googleAdd: String,
  religion: { type: String, required: false },
  physicalDisablity: { type: String, required: false },
  martialStatus: { type: String, required: false },
  experienceCertificate: { type: String, required: false, default: null }, // nothing
  policeVerification: { type: String, required: false, default: null },
  educationCertificate: { type: String, required: false, default: null }, // educationcerti
  resume: { type: String, required: false, default: null },
  file2: { type: String, required: false, default: null },
  file3: { type: String, required: false, default: null },
  eduction: { type: Object, required: false },

  certificate: { type: String, required: false, default: null }, // thisisexperience certificate
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "user", "shop"],
  },
  categoryOfShop: {
    type: String,
  },
  isSubscribed: { type: Boolean, required: true, default: false },
  isActive: { type: Boolean, required: true, default: true },
  userProfile: { type: String },
  transactionId: { type: String, default: null },
  qrImage: { type: String, default: null },
  subscriptionId: { type: String, default: null },
  purposeOfRegistration: { type: String, default: null },
  resetToken: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", productScheme);
