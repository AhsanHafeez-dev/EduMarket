import { Router } from "express";
import { getRecommendationForCourse,getRequiredDataForRecommendation } from "../../controllers/recommendation-controllers/recommendation.controller.js";
const courseRecommendationRouter = Router();

courseRecommendationRouter.route("/get/:courseId").get(getRecommendationForCourse)

courseRecommendationRouter.route("/get").get(getRequiredDataForRecommendation);



export { courseRecommendationRouter };