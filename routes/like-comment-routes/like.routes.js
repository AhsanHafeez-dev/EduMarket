import express from "express";
import { addlikeToLecture } from "../../controllers/comment-like-controllers/video.controller.js";
import { addlikeToComment } from "../../controllers/comment-like-controllers/comment.controller.js";
import { authenticate } from "../../middleware/auth-middleware.js";


const likeRouter = express.Router()

likeRouter.use(authenticate)
// lecture like routes
likeRouter.route("/lectures/:lectureId/:userId").post(addlikeToLecture);

// comment like routes
likeRouter.route("/:commentId/:userId").post(addlikeToComment);


export { likeRouter }