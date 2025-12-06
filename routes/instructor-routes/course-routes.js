import { Router } from "express";
import {addNewCourse,getAllCourses,getCourseDetails,updateCourseById} from "../../controllers/instructor-controller/course.controller.js"
import { authenticate } from "../../middleware/auth-middleware.js";

const instructorCourseRoutes = Router();
instructorCourseRoutes.use(authenticate)
instructorCourseRoutes .route("/add").post( addNewCourse);
instructorCourseRoutes.route("/get").get( getAllCourses);
instructorCourseRoutes.route("/get/details/:id").get(getCourseDetails);
instructorCourseRoutes.route("/update/:id").put(updateCourseById);

export { instructorCourseRoutes };