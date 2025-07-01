import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import cors from "cors";
import express from "express";
import cookie from "cookie-parser";
const app = express();
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({ extended: true,limit:"16kb" }));
app.use(cookie())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


import { authRoutes } from "./routes/auth-routes/index.js"
import {instructorCourseRoutes} from "./routes/instructor-routes/course-routes.js"
import { likeRouter } from "./routes/like-comment-routes/like.routes.js";
import { commentRouter } from "./routes/like-comment-routes/comment.routes.js";
import  {mediaRoutes} from "./routes/instructor-routes/media-routes.js";

import {studentViewCourseRoutes} from "./routes/student-routes/course-routes.js";
import {studentViewOrderRoutes} from "./routes/student-routes/order-routes.js";
import {studentCoursesRoutes} from "./routes/student-routes/student-courses-routes.js";
import {studentCourseProgressRoutes} from "./routes/student-routes/course-progress-routes.js";


app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/comments", commentRouter);
app.use("/like", likeRouter);


app.route('/login').post(async (req, res) => {
  console.log(req.body);
  res.status(200).json({message :req.body});
})

app.use((error, req, res, next) => {
    console.log(error.stack);
    
    
})


const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`app listening on port ${port}`) });