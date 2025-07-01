import { prisma } from "../../prisma/index.js";
import { httpCodes } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getAllStudentViewCourses = async (req, res) => {
  try {
    console.log("handling request in student-controller/course-controller getAllStudentViewCourses controller")
    // Optional: fetch all courses (if you still need this )
    const courseList = await prisma.course.findMany();
    if (courseList.length == 0) { console.log("no course found"); return res.status(httpCodes.notFound).json(new ApiResponse(httpCodes.notFound,{},"no course exist")); }
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    console.log("req.query",req.query);

    let filters = {};
    if (category.length) {
      filters.category = { in: category.split(",") };
    }
    if (level.length) {
      filters.level = { in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam = { pricing: "asc" };
        break;
      case "price-hightolow":
        sortParam = { pricing: "desc" };
        break;
      case "title-atoz":
        sortParam = { title: "asc" };
        break;
      case "title-ztoa":
        sortParam = { title: "desc" };
        break;
      default:
        sortParam = { pricing: "asc" };
    }
    console.log(filters, "filters");
    console.log(sortParam, "param sort");
    console.log("getting all courses");
    const coursesList = await prisma.course.findMany({
      where: filters,
      orderBy: sortParam,
      include: { curriculum: true },
    });

    // console.log("getting all lecures");
    // for (let i = 0; i < coursesList.length; i++) {
     
    //   let lectures = await prisma.lecture.findMany({ where: { courseId: coursesList[i].id } });
      
    //   coursesList[i].lectures = lectures;
    // }
    courseList.lectures = courseList.curriculum;
    courseList.curriculum = undefined;
    console.log("successfully fetched all courses sending reponse");
    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    
    console.log("handling request in student-controller/course-controller getStudentViewCourseDetails controller")
    
    const { id } = req.params;
    console.log("data recieved id : ", id);
    
    const courseDetails = await prisma.course.findUnique({
      where: { id: Number(id) },include:{students:true}
    });
    
    if (!courseDetails) {
      console.log("course not found");
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }
    const lectures = await prisma.lecture.findMany({ where: { courseId: Number(id) } });
    courseDetails.curriculum = lectures;
    console.log(req.user);
    console.log("returning course");
    // console.log(courseDetails);
    
    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    console.log("handling request in course controller's checkoutCoursePurchseInfo method");
    let { id,studentId } = req.params;
    if (!studentId) {
      studentId = req.body?.studentId || "8";
    }
    console.log("data got id : ",id," studentId : ", studentId);
    const studentCourses = await prisma.studentCourse.findFirst({
      where: { userId: studentId,courseId:id },
    });
    const ifStudentAlreadyBoughtCurrentCourse = studentCourses ? true : false;
    if (ifStudentAlreadyBoughtCurrentCourse) console.log("course is already being purchased");

    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};
