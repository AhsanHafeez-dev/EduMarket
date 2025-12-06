import { v2 } from "cloudinary";
import { ApiError } from "./ApiError.js";
import { httpCodes } from "../constants.js";
import fs from "fs";
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  try {
    console.log("uploading : ",filePath)
    const cloudinaryResponse = await v2.uploader.upload(filePath, {
      resource_type:"auto",
    });
    if (cloudinaryResponse) { await fs.rmSync(filePath); }
    console.log(cloudinaryResponse.secure_url)
    return cloudinaryResponse;
  } catch (error) {
    console.log("cloudinary error");
    console.log(error);
    throw new ApiError(httpCodes.badGateway, error.message);
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
      await v2.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (error) {
    throw new ApiError(httpCodes.badGateway, error.message);
  }
};





export { uploadMediaToCloudinary, deleteMediaFromCloudinary };