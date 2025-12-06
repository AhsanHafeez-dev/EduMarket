import { asyncHandler } from "../../utils/asyncHandler.js";

const addQuestionToQuiz = asyncHandler(async (req, res) => { });

const updateQuestionById = asyncHandler(async (req, res) => {});

const deleteQuestionById = asyncHandler(async (req, res) => { });

const addOptionToQuestion = asyncHandler(async (req, res) => { });

const updateOption = asyncHandler(async (req, res) => { });

const deleteOption = asyncHandler(async (req, res) => { });

export {
    addOptionToQuestion,
    addQuestionToQuiz,
    updateOption,
    updateQuestionById,
    deleteOption,
    deleteQuestionById
}
