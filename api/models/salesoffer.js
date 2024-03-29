const mongoose = require("mongoose");
const shop = require("./shop");
const users = require("./users");

const salesofferScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: { type: String, required: true },
  cateoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  shopId: {
    type: String,
    ref: shop,
  },
  location: { type: String, required: true },
  offerImage: { type: String, required: false },
  offerImage1: { type: String, required: false },
  offerImage2: { type: String, required: false },
  offerImage3: { type: String, required: false },
  offerImage4: { type: String, required: false },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  price: { type: String, required: true },
  code: { type: String, required: true },
});
// salesofferScheme.index({ location: "text", description: "text" });
salesofferScheme.index({ "$**": "text" });
module.exports = mongoose.model("SalesOffer", salesofferScheme);
