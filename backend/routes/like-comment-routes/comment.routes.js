import express from "express"
import {getAllCommentsOfLecture,addCommentToLecture} from  "../../controllers/comment-like-controllers/video.controller.js"
import { addReplyToComment, deleteComment, getCommentReplies } from "../../controllers/comment-like-controllers/comment.controller.js";
import { addCommentToCourse } from "../../controllers/comment-like-controllers/course.controller.js";

const commentRouter = express.Router();

// lecture comments routes
commentRouter.route("lectures/:lectureId").get(getAllCommentsOfLecture);
commentRouter.route("/:lectureId/:userId").post(addCommentToLecture);


// general comment routes
commentRouter.route("/:commentId").post(addReplyToComment);
commentRouter.route("/:commentId").get(getCommentReplies);
commentRouter.route("/:commentId").delete(deleteComment);


// course comment routes
commentRouter.route("/courses/:courseId").post(addCommentToCourse)

export {commentRouter}