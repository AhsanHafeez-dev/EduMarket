import {asyncHandler} from "../../utils/asyncHandler.js"


const getAllQuizzesByCourseId = asyncHandler(
    async(req,res)=>{}
);

const createQuiz = asyncHandler(async (req, res) => { });

const fetchQuizMeataDataAndQuestion = asyncHandler(async (req, res) => { });

const updateQuizDetails = asyncHandler(async (req, res) => { });

const deleteQuizById = asyncHandler(async (req, res) => { });

export {
    getAllQuizzesByCourseId,
    createQuiz,
    fetchQuizMeataDataAndQuestion,
    updateQuizDetails,
    deleteQuizById
}