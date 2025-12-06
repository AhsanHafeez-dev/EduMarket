import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../prisma/index.js";
import { httpCodes } from "../../constants.js";
import {ApiResponse } from "../../utils/ApiResponse.js";


const addlikeToComment = asyncHandler(
    async (req, res) => {
        const { commentId, userId } = req.params;
        const { like } = req.body;
        
        if (!(commentId && like))
        { return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest, {}, "missing commentId or like")) }
        
        const comment = await prisma.comment.findFirst({ where: { id: commentId } });
        
        if (!Boolean(like))
        {
            const deletedLike = await prisma.like.delete({ where:{AND:[{commentId:commentId},{ownerId:userId}]} });
            if (!deletedLike)
            { return res.status(httpCodes.notFound).json(new ApiResponse(httpCodes.notFound, {}, "comment or like doesnot exist")); }
            
            
            comment.noOfLikes -= 1;
            await prisma.comment.updateMany({ where: { id: commentId }, data: { noOflikes: comment.noOflikes } });
            return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, deletedLike, "Like toggled successfully"));
        }
        
            const createdlike = await prisma.like.create({ data: { commentId: commentId, text: like } });
            comment.noOflikes += 1;
        
        
        
        
        
        await prisma.comment.updateMany({ where: { id: commentId }, data: { noOflikes: comment.noOflikes } });

        return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, createdlike, "like successfully toggled to comment"));

    }
)


const addReplyToComment = asyncHandler(
    async (req, res) => {

        const { commentId } = req.param;
        const {  comment } = req.body;
        
        if (!(commentId && comment))
        { return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest, {}, "missing commentId or comment")) }
        
        
        const createdComment = await prisma.comment.create({ data: { commentId: commentId, text: comment } });
        const commentDb = await prisma.comment.findFirst({ where: { id: lectureId } });
        const lecture = await prisma.lecture.findFirst({ where: { id: commentDb.lectureId } });
        
        commentDb.noOfReplies += 1;
        lecture.noOfComments += 1;
        
        await prisma.lecture.update({ where: { id: lecture.id }, data: { noOfComments: lecture.noOfComments } });
        await prisma.comment.updateMany({ where: { id: commentId }, data: { noOfReplies:commentDb.noOfReplies} });

        return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, createdComment, "reply successflly added"));

    }
)

const deleteComment = asyncHandler(
    async (req, res) => {
        const { commentId } = req.param;
        
        const commentToBeDeleted = await prisma.comment.findFirst({ where: { id: commentId } });
        
        const deletedComments = await prisma.comment.deleteMany({ where: { OR: [{ id: commentId }, { commentId: commentId }] } });

        if (commentToBeDeleted.lectureId)
        {
            const lecture = await prisma.lecture.findFirst({ where: { id: commentToBeDeleted.lectureId } });
            lecture.noOfComments -= deletedComments.count;
            await prisma.lecture.update({ where: { id: lectureId }, data: { noOfComments: lecture.noOfComments } });
        }
        if (commentToBeDeleted.commentId)
        {
            const comment = await prisma.comment.findFirst({ where: { id: commentToBeDeleted.commentId } });
            comment.noOfReplies -= deletedComments.count;
            await prisma.comment.update({ where: { id: commentToBeDeleted.commentId }, data: { noOfReplies: comment.noOfReplies } });
         }
        if (commentToBeDeleted.courseId)
        {
            const course = await prisma.course.findFirst({ where: { id: commentToBeDeleted.courseId } });
            course.noOfComments -= deletedComments.count;
            await prisma.course.update({ where: { id: commentToBeDeleted.courseId }, data: { noOfComments: course.noOfComments } });
         }
        
        

        if (!deletedComments) {
            return res.status(httpCodes.notFound).json(new ApiResponse(httpCodes.notFound, {}, "comment with this id doesnot exist"));
        }
        return res.
            status(httpCodes.ok)
            .json(new ApiResponse(httpCodes.ok, { noOfDeletedComment: deletedComments.count }, "comment and its replies deleted succesfully"));
    }
);

const getCommentReplies = asyncHandler(
    async (req, res) => {
        const { commentId } = req.body;
        
        const replies=await prisma.comment.findMany({ where: { commentId: commentId } });

        return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, replies, "replies fetched successfully"));

        
    }
)


export {
  addlikeToComment,
  addReplyToComment,
  deleteComment,
  getCommentReplies,
};