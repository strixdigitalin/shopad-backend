const cloudinary = require("cloudinary").v2;
let config = {
  CLOUD_NAME: "strix-digital",
  CLOUD_KEY: "576127676785571",
  CLOUD_SECRET: "aLySilv69kgAZPTDzboyAraiKGQ",
};
cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_KEY,
  api_secret: config.CLOUD_SECRET,
});
module.exports = cloudinary;
