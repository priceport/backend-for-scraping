const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getQueryType = async (chat)=>{

};

exports.chat = catchAsync(async (req,res,next)=>{
    const chat = req.query.chat;

    if(!chat){
        return next(
            new AppError(`Chat query required!`,400)
        )
    }

    //get type
    const type = await getQueryType(chat);

    //remove params for type

    //query

    //humanize response

    //response
})

exports.analyze = catchAsync(async (req,res,next)=>{
    const jsonData = req.body.data;
    const notes = req.body.notes;

    if (!jsonData || typeof jsonData !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON data provided.' });
    }

    const prompt = `
    You are a data analyst. Analyze the following JSON data and provide clear, point-wise insights in numbered format. Keep each point concise and meaningful.

    additional notes:
    ${notes?notes:"NA"}

    JSON Data:
    ${JSON.stringify(jsonData, null, 2)}

    Return output as:
    1) ...
    2) ...
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful data analyst who gives clear, bullet-point insights.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4',
      temperature: 0.7,
    });

    const insights = completion.choices[0].message.content;
    res.status(200).json({ message:"success",data:insights });
})