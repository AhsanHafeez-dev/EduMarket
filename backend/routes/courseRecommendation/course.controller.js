import { asyncHandler } from "../../utils/asyncHandler.js"; 
import { prisma } from "../../prisma/index.js"
import { httpCodes } from "../../constants.js"
import { ApiResponse } from "../../utils/ApiResponse.js";

// this data will be fetched by python's api to train model and then provide recommendation on demand
const getAllCourseDataForRecommendation = asyncHandler(
    async (req, res) => {
        const courses=await prisma.course.findMany({
            select: {
                id: true,
                tags: true,
                title:true
            }
        })
        res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, courses, "all courses fetched successfully"));
        
    }
)

const getRecommendation = asyncHandler(
    async (req, res) => {
        fetch(`${process.env.PYTHON_API_URL}/recommendation/get`);
    }
);