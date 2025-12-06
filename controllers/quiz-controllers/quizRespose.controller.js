import { asyncHandler } from "../../utils/asyncHandler.js";

const createAttemptRecord = asyncHandler(async (req, res) => { });

const fetchAttemptDetailsById = asyncHandler(async (req, res) => { });

const recordAnswer = asyncHandler(async (req, res) => { });

const submitQuiz = asyncHandler(async (req, res) => { });

const getQuizScore = asyncHandler(async (req, res) => {});


export {
    createAttemptRecord,
    fetchAttemptDetailsById,
    recordAnswer,
    submitQuiz,
    getQuizScore
}