import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../prisma/index.js";
import { httpCodes } from "../../constants.js";
import {ApiResponse } from "../../utils/ApiResponse.js";

const addCommentToCourse = asyncHandler(
    async (req, res) => {
        const { courseId, comment } = req.body;
        if (!(courseId && comment)) { return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest, {}, "missing courseId or comment")) }
        
        
        
        const createdcomment = await prisma.comment.create({data:{courseId:courseId} }   )
        const course = await prisma.course.findFirst({ where: { id: courseId } });
        course.noOfcomments += 1;
        
        await prisma.course.updateMany({ where: { id: courseId }, data: { noOfcomments: course.noOfcomments } });

        return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, createdcomment, "comment successfully added to course"));

    }
)


export { addCommentToCourse };