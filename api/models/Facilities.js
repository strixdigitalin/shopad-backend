const mongoose = require("mongoose");
const users = require("./users");
const salesofferScheme = mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: {},
  }
);

module.exports = mongoose.model("facility", salesofferScheme);
