import { prisma } from "../../prisma/index.js";
import { generateCertificatePdf } from "../../utils/certficateGeneration.js";
import { v4 as uuidv4 } from "uuid";
import { uploadMediaToCloudinary } from "../../utils/cloudinary.js";

//
// 1. Mark one lecture as viewed (and—if it’s the last one—mark the course complete)
//
export const markCurrentLectureAsViewed = async (req, res) => {
      
  console.log("handling request in student-controller/course-progress-controller markCurrentLectureAsViewed controller")
  console.log("data recieved : ", req.body);
  
  const { userId: rawUserId, courseId: rawCourseId, lectureId } = req.body;
  const userId = rawUserId.toString();
  
  
  
  const courseId = rawCourseId.toString();
  const now = new Date();
  // steps
  // checks wether courseProgress already exist if not create one

  // check wether lecture is viewed for first time if not create one other wise update last viewed
  // increase number of lecture viewed 
  // calculate fresh attendance
  // check if course is completed
  

  try {
    
    let progress = await prisma.courseProgress.findFirst({
      where: { userId, courseId },
      include:{lectureProgress:true}
    });

    if (!progress) {
      console.log("lecture is viewed for first time marking as done");
      progress = await prisma.courseProgress.create({
        data: { userId, courseId, completed: false },
        include:{lectureProgress:true}
      });
    }

      
    const existingLP = await prisma.lectureProgress.findFirst({
      where: {
        courseProgressId: progress.id,
        lectureId: Number(lectureId),
      },
    });
    if (existingLP) {
      
      console.log("updating last viewed time");
      
      await prisma.lectureProgress.updateMany({
        where: { id: existingLP.id },
        data: { viewed: true, dateViewed: now },
      });

    }
    else {

      console.log("cretaing lecture progress for first time");

      await prisma.lectureProgress.create({
        data: {
          courseProgressId: progress.id,
          lectureId: Number(lectureId),
          viewed: true,
          dateViewed: now,
        },
      });
      
    }
    progress.noOfLecturesViews += 1;
    
    

    console.log("now checking wether course is completed or not");
    
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      
    });

    if (!course) {
      console.log("course not found");
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const totalLectures = course.noOfLectures;
    const viewedCount = progress.noOfLecturesViews;
    const attendance = (viewedCount / totalLectures) * 100;

    

    const cstd=await prisma.courseStudent.updateManyAndReturn({
      where: { studentId: userId, courseId: rawCourseId },
      data:{attendance:attendance}
    });
    
    
    const std=await prisma.studentCourse.updateManyAndReturn({
      where: { userId: userId, courseId: courseId },
      data:{attendance:attendance}
    })


    console.log("current attendance of : ",cstd[0].studentName," is : ", attendance," in course : ",std[0].title, " where total lectures are  : ", totalLectures, " and viewed lectures are :", viewedCount);
    
    let certificateUrl;
    
    if (viewedCount === totalLectures) {
      const course = await prisma.certificate.findFirst({ where: { courseId: parseInt(cstd[0]).courseId, userId: parseInt(std[0].userId) } })
      if(!course){
      let certId = uuidv4();
      const certificate = await generateCertificatePdf(cstd[0].studentName, std[0].title,certId);
      console.log("certificate generated at ", certificate);
       certificateUrl = (await uploadMediaToCloudinary(certificate)).secure_url;
      
      await prisma.certificate.create({
        data: {
          courseId: parseInt(cstd[0]).courseId,
          userId: parseInt(std[0].userId),
          certificateUrl: certificateUrl,
        },
      });}
      
      console.log("course progresss is completed");
      
      progress = await prisma.courseProgress.updateMany({
        where: {  userId, courseId  },
        data: { completed: true, completionDate: now,noOfLecturesViews:progress.noOfLecturesViewsl },
      });
    
    }

    
    else {
      progress = await prisma.courseProgress.updateMany({
        where: {  userId, courseId  },
        data: { noOfLecturesViews:progress.noOfLecturesViews },
      });
      
    }
    progress.attendance = attendance;
    console.log("returning response",progress.attendance);    
    return res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: {progress,certificateUrl},
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred" });
  }
};

//
// 2. Fetch current progress (only if the user has purchased the course)
//
export const getCurrentCourseProgress = async (req, res) => {
  
  console.log("handling request in student-controller/course-progress-controller getCurrentCourseProgress controller");
  console.log("recieved data : ", req.params);

  const { userId: rawUserId, courseId: rawCourseId } = req.params;
  const userId = rawUserId.toString();
  const courseId = rawCourseId.toString();

  try {
    // 2a) Check purchase via the StudentCourse join table
    const purchase = await prisma.studentCourse.findFirst({
      where: { userId, courseId },
    });
    if (!purchase) {
    
      console.log("course is not being purchased by user");
    
      return res.status(200).json({
        success: true,
        message: "You need to purchase this course to access it.",
        data: { isPurchased: false },
      });
    }
    
    console.log("getting progress in current course");

    // 2b) Load or initialize progress
    let progress = await prisma.courseProgress.findFirst({
      where: {  userId, courseId } ,
      include: { lectureProgress: true },
    });

    // 2c) If no progress yet, return empty
    if (!progress || progress.lectureProgress.length === 0) {

      console.log("user doesnot has course progress record for this course");

      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
        include:{curriculum:true}
      });
      
      if (!course) {
        console.log("course didnot exist");
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }
      
      
      return res.status(200).json({
        
        statusCode: 200,
        stattus:200,
        success: true,
        message: "No progress found; you can start watching.",
        data: {
          courseDetails: course,
          progress: [],
          attendance:0.0,
          isPurchased: true,
        },
      });
    }

    console.log("user has progress record in current course returning it");
    // 2d) Otherwise, return existing progress
    const courseDetails = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: { curriculum: true },
    });
    
    const courstudent = await prisma.courseStudent.findFirst({ where: { studentId: userId, courseId: parseInt(courseId) } });
    
    console.log(courstudent.attendance, "returning this response");
    
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: progress.lectureProgress,
        completed: progress.completed,
        completionDate: progress.completionDate,
        attendance:courstudent.attendance,
        isPurchased: true,
      },
    });
  }
  
  catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred" });
  }
};

//
// 3. Reset all progress for a given (user, course) pair
//
export const resetCurrentCourseProgress = async (req, res) => {

  console.log("handling request in student-controller/course-progress-controller resetCurrentCourseProgress controller");
  console.log("recieved data : ", req.body);

  const { userId: rawUserId, courseId: rawCourseId } = req.body;
  const userId = rawUserId.toString();
  const courseId = rawCourseId.toString();

  try {

    console.log("fetching students's progress");

    // 1) Locate the single CourseProgress record
    const progress = await prisma.courseProgress.findFirst({
      where: { userId, courseId },
    });

    if (!progress) {
      console.log("user doesnot have any progress record to reset");
      return res
        .status(404)
        .json({ success: false, message: "Progress not found!" });
    }

    // 2) Use update by its unique `id`, and nest-delete its LectureProgress children
    console.log("deleting all progress");
    const updated = await prisma.courseProgress.update({
      where: { id: progress.id },
      data: {
        lectureProgress: { deleteMany: {} }, // wipe out all lectureProgress rows
        completed: false,
        completionDate: null,
      },
      include: { lectureProgress: true },
    });
    
    await prisma.courseStudent.updateMany({ where: { studentId: userId, courseId: parseInt(rawCourseId) }, data: { attendance: 0 } });
    await prisma.courseProgress.updateMany({ where: { courseId: courseId, userId: userId }, data: { noOfLecturesViews: 0 } });
    console.log("successfully removed all data");

    return res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred!" });
  }
};
