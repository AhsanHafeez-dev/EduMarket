import {asyncHandler} from "../../utils/asyncHandler.js"
import { generateAiQuiz } from "../../utils/Quiz.js";
import {prisma} from "../../prisma/index.js"
import { httpCodes } from "../../constants.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { text } from "pdfkit";


const getAllQuizzesByCourseId = asyncHandler(
    async (req, res) => {
        const { courseId } = req.params;
        const quizes = await prisma.quiz.findMany({ where: { courseId } })
        return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, quizes, "all quized fetched successfully"));        
    }
);


const generateAiPoweredQuiz = asyncHandler(
    async (req, res) => {
        
        let { quizTopic, difficulty, courseTitle } = req.body;
        const course = await prisma.course.findFirst({ where: { courseTitle } });
        if (!course) {
            return res.status(httpCodes.notFound).json(httpCodes.notFound, {}, "course doesnot exists");
        }
        const aiResponse = await generateAiQuiz(courseTitle, quizTopic, difficulty);
        let questions = aiResponse.questions;
        const options = aiResponse.options;        

        const quiz=await prisma.quiz.create({
            data: {
                courseId: course.id,
                title:quizTopic,
                subject: courseTitle,
                difficulty,
                timeLimitMin: 20,
                shuffleQuestions: false,
                questions: {
                    create: questions.map( (q,idx)=> (
                        {
                            question: q.question, points: q.points, type: q.type, hint: q.hint, correctText: q.correctText,
                            options: {
                                create:options.map(opt=>({text:opt.text,isCorrect:opt.isCorrect}))
                            }
                            
                         }
                    ))
                    // outer map closes
                }
                
            },include:{questions:true}
        })
        
        
        
        
        return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, quiz, "quiz generated successfully"));        
    }
);
const createQuiz = asyncHandler(async (req, res) => {
    let {quizTopic, difficulty, courseTitle, questions, options } = req.body;
    
    const course = await prisma.course.findFirst({ where: { courseTitle } });
    if (!course) {
        return res.status(httpCodes.notFound).json(httpCodes.notFound, {}, "course doesnot exists");
    }

    const quiz = await prisma.quiz.create({
      data: {
        courseId: course.id,
        title: quizTopic,
        subject: courseTitle,
        difficulty,
        timeLimitMin: 20,
        shuffleQuestions: false,
        questions: {
          create: questions.map((q, idx) => ({
            question: q.question,
            points: q.points,
            type: q.type,
            hint: q.hint,
            correctText: q.correctText,
            options: {
              create: options.map((opt) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
              })),
            },
          })),
          // outer map closes
        },
      },
      include: { questions: true },
    });

    return res
      .status(httpCodes.created)
      .json(
        new ApiResponse(httpCodes.created, quiz, "quiz created successfully")
      );            
 });

const fetchQuizMeataDataAndQuestion = asyncHandler(async (req, res) => {

    const { quizId } = req.params;
    const questions = await prisma.question.findMany({ where: { quizId }, include: { options: true } });
    res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, questions, "questions fetched successfully"));
 });

const updateQuizDetails = asyncHandler(async (req, res) => {

 });

const deleteQuizById = asyncHandler(async (req, res) => { 
    const { id } = req.params;
    const deletedQuiz = await prisma.quiz.delete({ where: { id } });
    if (!deletedQuiz) { res.status(httpCodes.notFound).json(new ApiResponse(httpCodes.notFound, {}, "quiz doesnot exist")) };
    res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, deletedQuiz, "quiz deleted successfully"));
});

export {
    getAllQuizzesByCourseId,
    createQuiz,
    fetchQuizMeataDataAndQuestion,
    updateQuizDetails,
    deleteQuizById,
    generateAiPoweredQuiz
}