import express from "express";
import multer from "multer";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { httpCodes } from "../../constants.js";
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from "../../utils/cloudinary.js";

const mediaRoutes = express.Router();

const upload = multer({ dest: "uploads/"});
// import {upload} from "../../middleware/multer.middleware.js"

mediaRoutes.route("/upload").post( upload.single("file"), async (req, res) => {
  try {
    console.log(`uploading ${req.file.path}`)
    const result = await uploadMediaToCloudinary(req.file.path);
    console.log("returning")
    return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,result,"video uploaded successfully"));
  } catch (e) {
    console.log("error",e);
    return res.status(httpCodes.serverSideError,{},"cannot upload to cloudinary");

    // throw new ApiError(httpCodes.serverSideError,"cannot upload to cloudinary")
  }
});

mediaRoutes.route("/delete/:id").delete(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(httpCodes.badRequest, "Asset Id is required");
    }

    await deleteMediaFromCloudinary(id);

    res
      .status(httpCodes.ok)
      .json(new ApiResponse(httpCodes.ok, {}, "Asset deleted "));
  } catch (e) {
    console.log(e);

    throw new ApiError(httpCodes.serverSideError, "Error deleting asset");
  }
});

mediaRoutes.route("/bulk-upload").post( upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,results,"uploaded successfully"));
  } catch (event) {
    console.log(event);

    throw new ApiError(httpCodes.serverSideError, "Error in bulk uploading" + event.message);
  }
});

export { mediaRoutes };
