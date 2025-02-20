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
async function filterCandidates(mainProduct, candidateProducts) {
  if (candidateProducts.length === 0) return [];

  console.log(candidateProducts);

  const prompt = buildBatchPrompt(mainProduct, candidateProducts);

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

    console.log("gptOutput",gptOutput);
    
    // Parse the response into an array
    const results = parseBatchResponse(gptOutput, candidateProducts);

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
  let prompt = `
Main product:
Title: ${mainProduct.title}

Below is a list of candidate products. Identify which ones are the exact same product as the main product.
For each candidate, answer "Yes" if it is the same, "Likely" if it is very similar, or "No" if it is different.

Format your response as:
1. Yes/No/Likely
2. Yes/No/Likely
...
  `;

  candidates.forEach((candidate, index) => {
    prompt += `\n${index + 1}. Title: ${candidate.title}`;
  });

  console.log("generated prompt:",prompt);
  return prompt;
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
      if (lowerLine.includes("yes") || lowerLine.includes("likely")) {
        filteredCandidates.push(candidateProducts[index]);
      }
    }
  });

  return filteredCandidates;
}

module.exports = { filterCandidates };
