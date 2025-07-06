import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../prisma/index.js";
import { httpCodes } from "../../constants.js";
import {ApiResponse} from "../../utils/ApiResponse.js"

const getRequiredDataForRecommendation = asyncHandler(
    async (req, res) => {
        let rows=await prisma.course.findMany(
            {
                where: { isPublished: true },
                omit: {
                    welcomeMessage: true, objectives: true, pricing: true, ratings: true, specializationId: true,
                    noOfComments: true, noOfLectures: true, noOfStudents: true, noOfStudentsCompletedCourse: true,
                    instructorId:true,instructorName:true,date:true,category:true,level:true,primaryLanguage:true,subtitle:true,description:true,image:true,    isFree:true,isPublished:true,id:true,tags:true
                }
            })
        const courseName=rows.map(r=>r.title)
            rows=await prisma.course.findMany(
                {
                    where: { isPublished: true },
                    omit: {
                        welcomeMessage: true, objectives: true, pricing: true, ratings: true, specializationId: true,
                        noOfComments: true, noOfLectures: true, noOfStudents: true, noOfStudentsCompletedCourse: true,
                        instructorId:true,instructorName:true,date:true,category:true,level:true,primaryLanguage:true,subtitle:true,description:true,image:true,    isFree:true,isPublished:true,id:true,title:true
                    }
                })
        
        
        const tags = rows.map(r => r.tags);
                rows=await prisma.course.findMany(
                    {
                        where: { isPublished: true },
                        omit: {
                            welcomeMessage: true, objectives: true, pricing: true, ratings: true, specializationId: true,
                            noOfComments: true, noOfLectures: true, noOfStudents: true, noOfStudentsCompletedCourse: true,
                            instructorId:true,instructorName:true,date:true,category:true,level:true,primaryLanguage:true,subtitle:true,description:true,image:true,    isFree:true,isPublished:true,tags:true,title:true
                        }
                    })
        const ids = rows.map(r => r.id);
        return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, [courseName,tags,ids], "courses fetched successfully"));
    }
)

const getRecommendationForCourse = asyncHandler(
    async (req, res) => {
        
        const { courseId } = req.params;    
        let course = await prisma.course.findUnique({ where: { id: courseId } });
        let response = await fetch(
          `${process.env.PYTHON_API_URL}/recommendation/get/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // if you need CORS:
                // "Accept": "application/json",
                
            },
            body: JSON.stringify({
              courseName: course.title,
              limit: 10,
            }),
          }
        );
          
        
        response = await response.json();
        
        console.log(response.data); // array
        const recommendation=prisma.course.findMany({where:{title:{in:response.data}}})
        return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, recommendation, "recommendation fetched successfully"));
        
        
    }
)
const getSearchResult = asyncHandler(
    async (req, res) => {
        const { word } = req.params;
        let response = await fetch(
            `${process.env.PYTHON_API_URL}/search`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",},
              body: JSON.stringify({
                word
              }),
            }
          );
            
          
        response = await response.json();
        
        return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, response.data, "successfully searched courses"));


    }
);
export {
    getRequiredDataForRecommendation,
    getRecommendationForCourse
}