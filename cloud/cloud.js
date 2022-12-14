const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'CAMP IMAGES',
      allowedFormats: ['jpeg', 'png', 'jpg'], // supports promises as well
    //   public_id: (req, file) => 'computed-filename-using-request',
    transformation: [
      {width: 350, crop: "scale"},
      {fetch_format: "auto"} ]
    },
  }); 

  module.exports = {cloudinary,storage}