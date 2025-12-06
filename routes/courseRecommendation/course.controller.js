import { Router } from "express";
import { getRecommendationForCourse,getRequiredDataForRecommendation } from "../../controllers/recommendation-controllers/recommendation.controller.js";
import { authenticate } from "../../middleware/auth-middleware.js";
const courseRecommendationRouter = Router();

courseRecommendationRouter.use(authenticate)
courseRecommendationRouter.route("/get/:courseId").get(getRecommendationForCourse)

courseRecommendationRouter.route("/get").get(getRequiredDataForRecommendation);



export { courseRecommendationRouter };