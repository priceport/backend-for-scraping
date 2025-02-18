// filterCandidates.js
require("dotenv").config(); // Load environment variables
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // The API key is automatically picked up if set as OPENAI_API_KEY
});

/**
 * filterCandidates - Uses GPT to filter an array of candidate products,
 * returning only those that are likely the same as the main product.
 *
 * @param {Object} mainProduct      - Main product object
 * @param {Array} candidateProducts - Array of candidate product objects
 * @returns {Promise<Array>}        - Filtered array of candidate products
 *
 * Example mainProduct:
 * {
 *   title: "Logitech Wireless Mouse M510 - Grey",
 *   brand: "Logitech",
 *   description: "Wireless USB Mouse with 2-year battery life."
 * }
 *
 * Example candidate product:
 * {
 *   title: "Logitech M510 Mouse Wireless Grey",
 *   brand: "Logi",
 *   description: "Wireless mouse with USB receiver, 2-year battery."
 * }
 */
async function filterCandidates(mainProduct, candidateProducts) {
  const filteredCandidates = [];

  for (const candidate of candidateProducts) {
    console.log("Trying candidate:"+candidate?.title);
    const prompt = buildPrompt(mainProduct, candidate);

    try {
      // Use the updated chat completions API call.
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // or "gpt-4" if you have access
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that determines whether two product listings refer to the exact same physical product.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.0,
      });

      // In v4, the response format is: response.choices[0].message.content
      const gptOutput = response.choices[0].message.content.trim();

      console.log(gptOutput);
      // Check for an affirmative answer ("Yes" or "Likely").
      if (
        gptOutput.toLowerCase().includes("yes") ||
        gptOutput.toLowerCase().includes("likely")
      ) {
        filteredCandidates.push(candidate);
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }
  }

  return filteredCandidates;
}

/**
 * buildPrompt - Constructs a prompt comparing the main product to a candidate.
 */
function buildPrompt(mainProduct, candidate) {
  return `
Main product:
Title: ${mainProduct.title}

Candidate product:
Title: ${candidate.title}

Question: Are these two listings referring to the exact same product?
Answer with "Yes" or "Likely" if they are the same, or "No" if they are not.
  `;
}

module.exports = { filterCandidates };
