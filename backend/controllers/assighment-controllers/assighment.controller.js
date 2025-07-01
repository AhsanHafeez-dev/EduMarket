import { asyncHandler } from "../../utils/asyncHandler.js";

const getAllAssighmentsByCourseId = asyncHandler(async (req, res) => { });


const createNewAssighment = asyncHandler(async (req, res) => { });

const fetchAssighmentDetailsById = asyncHandler(async (req, res) => { });

const updateAssighmentDetails = asyncHandler(async (req, res) => { });

const removeAssighment = asyncHandler(async (req, res) => { });

export {
    getAllAssighmentsByCourseId,
    fetchAssighmentDetailsById,
    createNewAssighment,
    updateAssighmentDetails,
    removeAssighment
}


