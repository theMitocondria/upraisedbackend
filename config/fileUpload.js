import cloudinaryPackage from "cloudinary";
import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary"
import dotenv from "dotenv";
dotenv.config();
const cloudinary=cloudinaryPackage.v2;

//configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage=new CloudinaryStorage({
    cloudinary,
    allowedFormats:["jpg","jpeg","png"],
    params:{
        folder:"Vaibhav",
    },
})

//init multer with storage
const upload=multer({
    storage,
});

export default upload;