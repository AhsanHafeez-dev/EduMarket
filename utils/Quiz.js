import { GoogleGenAI} from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



async function generateAiQuiz(category, topic,diffculty="easy") {
  
  const prompt = `give me quiz related to ${category}.${topic} with ${diffculty} difficulty in following structure i need mainly two arrays one of question second of options the question array should have json object with attributes{type(mcqs/fillintheblanks/truefalse), question(orignal textof question), points(wieghtage of eachquestion), correctText(correctText incase of blanks otherwise empty),hint (for guesiing answer)}options array should be 2d and each array element is collection of json with each json contatinig {optionText(text of option),isCorrect(is this real answer and not should be boolean)} i only need this as output no extra text`;


  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
    
    
    const arr = JSON.parse(
      response.text.replaceAll("```", "").replace("json", "")
    );
    return {"questions":arr.questions,"options":arr.options};
}



export { generateAiQuiz };