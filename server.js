import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import cors from "cors";
import express from "express";
import cookie from "cookie-parser";
import { confirmPayment } from "./controllers/student-controller/order-controller.js";
const app = express();
const corsOption = {
  origin: ["*","https://edu-front-end-xi.vercel.app"],
  allowedHeaders: ["Content-Type","Authorization",],
  credentials: true,
};
app.use(
  cors(corsOption),
);
app.options("*", cors(
  corsOption
));


app.post(
  "/student/order/confirm", // The full path to your webhook
  express.raw({ type: "application/json" }),
  confirmPayment
);


app.use(express.json({ limit: "16kb" }));
app.set("json replacer", (key, value) =>
  typeof value === "bigint" ? value.toString() : value
  
);
app.use(express.urlencoded({ extended: true,limit:"16kb" }));
app.use(cookie())


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
import { httpCodes } from "./constants.js";
import { ApiResponse } from "./utils/ApiResponse.js";


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


app.get("/", (req, res) => {
  return res.status(200).json({ message: "welcome to course app" });
})

app.use((error, req, res, next) => {
  console.log(error.stack);
  const statusCode = error.status || httpCodes.serverSideError;
   return res.status(statusCode).json(new ApiResponse(statusCode,{},error.message || "something went wron")) 
    
})

export default app;
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`app listening on port ${port}`);
//   logger.info(`app listening on port ${port}`);
// });


