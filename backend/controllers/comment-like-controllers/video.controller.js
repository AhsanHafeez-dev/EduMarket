import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../prisma/index.js";
import { httpCodes } from "../../constants.js";
import {ApiResponse } from "../../utils/ApiResponse.js";


const addlikeToLecture = asyncHandler(
    async (req, res) => {
        const { lectureId, userId } = req.params;
        const {  like } = req.body;
        if (!(lectureId && like && userId))
        { return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest, {}, "missing lectureId,userId or like")) }
        
        const lecture = await prisma.lecture.findFirst({ where: { id: lectureId } });
        
        if (!Boolean(like)) {
            const deletedLike = prisma.like.delete({ where: { lectureId: lectureId, ownerId: userId } });
            
            if (!deletedLike)
            { return res.status(httpCodes.notFound).json(new ApiResponse(httpCodes.noContent, {}, "user has not liked the video")); }

            lecture.noOflikes -= 1;
        
            await prisma.lecture.update({ where: { id: lectureId }, data: { noOflikes: lecture.noOflikes } });
            return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, deletedLike, "like successfully removed from lecture"));
        }
        
        const createdlike = await prisma.like.create({data:{lectureId:lectureId,text:like}})
        
        
        lecture.noOflikes += 1;
        
        await prisma.lecture.updateMany({ where: { id: lectureId }, data: { noOflikes: lecture.noOflikes } });

        return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, createdlike, "like successfully added to lecture"));

    }
)


const addCommentToLecture = asyncHandler(
    async (req, res) => {
        
        const { lectureId, userId } = req.params;
        const { comment } = req.body;
        if (!(lectureId && comment.trim()))
        { return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest, {}, "missing lectureId or comment")) }
        
        
        const createdComment = await prisma.comment.create({ data: { lectureId: lectureId, text: comment,ownerId:userId } });
        
        const lecture = await prisma.lecture.findFirst({ where: { id: lectureId } });
        
        
        lecture.noOfComments += 1;
        await prisma.lecture.updateMany({ where: { id: lectureId }, data: { noOfComments:lecture.noOfComments } });

        return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, createdComment, "comment successfully added to lecture"));

    }
)




const getAllCommentsOfLecture = asyncHandler(
    async (req, res) => {
        const { lectureId } = req.params;
        const comments = await prisma.comment.findMany({ where: { lectureId: lectureId } });
        
        return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, comments, "comments fetched succesfully"));
    }
);



export {
    addlikeToLecture,
    addCommentToLecture,
  
    getAllCommentsOfLecture,
    
};