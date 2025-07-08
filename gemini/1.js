import { GoogleGenAI} from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBMC1jb2xwujOM8Co_CkesR2m8pzVptgVU",
});


const prompt = "give me quiz related to webdevelopment.mongodb pipelines with medium difficulty in following structure it should be list of json each json represent question whose structure should be  question type(mcqs/fill in the banks/truefalse) difficulty (easy/medium/hard) points(weightage of question) correctText(correct answer) hint(hint for students to get to answer)  options[] (options to select from ) options arrays should also be array of json where each json should be in format of text(option) isCorrect(boolean is this option right one or not) i only need this as output no extra text"



const prompt3 =
  "give me quiz related to ai with medium difficulty in following structure i need mainly two arrays one of question second of options the question array should have json object with attributes{type(mcqs/fillintheblanks/truefalse), question(orignal textof question), points(wieghtage of eachquestion), correctText(correctText incase of blanks otherwise empty),hint (for guesiing answer),quizId : 5} options array should be 2d and each array element is collection of json with each json contatinig {optionText(text of option),isCorrect(is this real answer or not should be boolean)} i only need this as output no extra text";




const prompt2="give me quiz related to gen ai with medium difficulty in following structure it should be list of json each json represent question whose structure should be  question type(mcqs/fill in the banks/truefalse) difficulty (easy/medium/hard) points(weightage of question) correctText(correct answer) hint(hint for students to get to answer)  options(options to be selected from , type:string) option should not be array it should be array where each option should be sperated by either comma or \n"


async function main() {

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt3,
  });
    
    
    const arr = JSON.parse(
      response.text.replaceAll("```", "").replace("json", "")
    );
  console.log(arr.options[0]);
}

await main();



// {
//     question: 'Which of the following is a primary characteristic of Generative AI models?',
//     type: 'mcqs',
//     difficulty: 'medium',
//     points: 10,
//     correctText: 'They create new, original content.',
//     hint: "Think about what 'generative' means in the context of AI output.",
//     options: 'They classify existing data, They create new, original content, They analyze historical trends, They store large datasets'
//   }