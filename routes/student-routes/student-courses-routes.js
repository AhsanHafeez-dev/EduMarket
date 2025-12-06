import express from "express";
import  {
  getCoursesByStudentId,
} from "../../controllers/student-controller/student-courses-controller.js";
import { authenticate } from "../../middleware/auth-middleware.js";

const studentCoursesRoutes = express.Router();

studentCoursesRoutes.use(authenticate)
studentCoursesRoutes.get("/get/:studentId", getCoursesByStudentId);

export {studentCoursesRoutes}
