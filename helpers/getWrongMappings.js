// filterCandidates.js
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * filterCandidates - Uses GPT-4o-mini to filter a batch of candidate products,
 * reducing the number of API calls and avoiding rate limits.
 *
 * @param {Object} mainProduct      - Main product object
 * @param {Array} candidateProducts - Array of candidate product objects
 * @returns {Promise<Array>}        - Filtered array of candidate products
 */
async function getWrongMappings(mainProduct, candidateProducts) {
  if (candidateProducts.length === 0) return [];

  const prompt = buildBatchPrompt(mainProduct, candidateProducts);

  if(prompt=="skip"){
      console.log("skipping");
     return candidateProducts;
  }

  try {
    // Single API call for the entire batch
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that determines whether a list of product listings refer to the exact same physical product as the main product.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: Math.min(1000, 50 * candidateProducts.length), // Limit token usage
      temperature: 0.0,
    });

    const gptOutput = response.choices[0].message.content.trim();
    
    // Parse the response into an array
    const results = parseBatchResponse(gptOutput, candidateProducts);

    console.log(results);
    return results;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return [];
  }
}

/**
 * buildBatchPrompt - Constructs a single prompt for batch processing.
 */
function buildBatchPrompt(mainProduct, candidates) {
  let toSend = false;
  let prompt = `
Main product:
Title: ${mainProduct.title}
Quanity: ${mainProduct.qty}
Unit: ${mainProduct.unit}
Price: ${mainProduct.latest_price}

Below is a list of candidate products. Identify which ones are the exact same product as the main product.
For each candidate, answer "Yes" if it is the same and have same quanity (unit adjusted like 0.5l and 500ml should be considered same) and price difference is not huge (greater than 20%), "Likely" if it is very similar, or "No" if it is different.

Format your response as:
1. Yes/No/Likely
2. Yes/No/Likely
...
  `;

  candidates.forEach((candidate, index) => {
    if(candidate?.ai_check==""){
      toSend = true;
      prompt += `\n${index + 1}. Title: ${candidate.title} Quanity: ${candidate.qty} Unit: ${candidate.unit} Price: ${candidate.latest_price}`;
    }
  });

  if(toSend)
  return prompt;

  else return "skip";
}

/**
 * parseBatchResponse - Extracts structured results from the GPT response.
 */
function parseBatchResponse(responseText, candidateProducts) {
  const filteredCandidates = [];

  const lines = responseText.split("\n");
  lines.forEach((line, index) => {
    if (index < candidateProducts.length) {
      const lowerLine = line.toLowerCase();
      filteredCandidates.push({...candidateProducts[index],ai_check:lowerLine?.split(".")[1]?.trim()});
    }
  });

  return filteredCandidates;
}

module.exports = { getWrongMappings };
