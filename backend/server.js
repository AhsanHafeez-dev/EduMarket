import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import cors from "cors";
import express from "express";
import cookie from "cookie-parser";
const app = express();

app.use(express.json({ limit: "16kb" }));
app.set("json replacer", (key, value) =>
  typeof value === "bigint" ? value.toString() : value
);
app.use(express.urlencoded({ extended: true,limit:"16kb" }));
app.use(cookie())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import { logger } from "./utils/logger.js";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
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
import {courseRecommendationRouter} from "./routes/courseRecommendation/course.controller.js"

app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/comments", commentRouter);
app.use("/like", likeRouter);
app.use("/recommendation", courseRecommendationRouter);


app.use((error, req, res, next) => {
    console.log(error.stack);
    
    
})


const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`app listening on port ${port}`); logger.info(`app listening on port ${port}`);});