// filterCandidates.js
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * filterCandidates - Uses GPT-4o-mini to filter candidate products
 * with high recall for price comparison purposes.
 */
async function filterCandidates(mainProduct, candidateProducts) {
  if (candidateProducts.length === 0) return [];

  console.log(`\n🔍 Starting OpenAI filtering for "${mainProduct.title}"`);
  console.log(`📊 Total products from similarity (BEFORE filtering): ${candidateProducts.length}`);

  // Process in batches if needed (OpenAI has token limits)
  const batchSize = 200;
  const allResults = [];
  const totalBatches = Math.ceil(candidateProducts.length / batchSize);

  for (let i = 0; i < candidateProducts.length; i += batchSize) {
    const batch = candidateProducts.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} products)`);
    const batchResults = await processBatch(mainProduct, batch);
    allResults.push(...batchResults);
    
    if (i + batchSize < candidateProducts.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n✅ OpenAI filtering completed`);
  console.log(`📊 Total products after filtering (AFTER filtering): ${allResults.length}`);
  console.log(`📉 Filtered out: ${candidateProducts.length - allResults.length} products\n`);

  return allResults;
}

async function processBatch(mainProduct, candidateProducts) {
  const startTime = Date.now();
  console.log(`⏱️  Batch processing STARTED at ${new Date().toISOString()}`);
  
  const prompt = buildBatchPrompt(mainProduct, candidateProducts);
  const maxRetries = 3;
  const baseDelay = 1000; 

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = baseDelay * Math.pow(2, attempt - 1); 
        console.log(`🔄 Retry attempt ${attempt}/${maxRetries} after ${delay}ms delay...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a product matching system for price comparison websites. Your PRIMARY GOAL is MAXIMUM RECALL.

CRITICAL RULE: Size, volume, ABV, and quantity differences are COMPLETELY IRRELEVANT. A 200ml bottle and a 1000ml bottle of the same product ARE THE SAME MATCH.

Match if products share:
1. Same/similar brand name (or brand is missing but implied by context)
2. Same core product name/identifier (the distinctive words that define this specific product)

That's it. Nothing else matters.

COMPLETELY IGNORE (these differences are meaningless):
- Any numbers: ml, L, oz, cl, gallons, %, ABV, proof, volume, size
- Any quantity: pack, bottle, case, single, multi-pack
- Descriptive words: superior, premium, original, classic, white, dark, aged, reserve
- Formatting: accents (Bacardí vs Bacardi), capitalization, hyphens, spacing
- Word order
- Generic category terms: rum, whisky, beer, wine, vodka

EXAMPLES OF MATCHES (all should be YES):
- "Bacardi Carta Blanca 200ml 37.5%" ↔ "bacardi carta blanca 1000ml 40%" = YES (different size/ABV is irrelevant)
- "Bacardi Carta Blanca Superior White Rum 1L" ↔ "carta blanca 1000ml" = YES (brand implied, same core name)
- "Johnnie Walker Red Label 700ml" ↔ "Johnnie Walker Red Label 1.75L" = YES (same product, different size)

EXAMPLES OF NON-MATCHES (should be NO):
- "Bacardi Carta Blanca" ↔ "Bacardi Oakheart" = NO (different product names)
- "Johnnie Walker Red Label" ↔ "Johnnie Walker Black Label" = NO (Red vs Black are different products)
- "Heineken Beer" ↔ "Carlsberg Beer" = NO (different brands)

When uncertain between YES and NO, ALWAYS choose YES. Your job is to cast a wide net.

OUTPUT FORMAT - STRICT REQUIREMENT:
You MUST respond with ONLY numbered lines in this EXACT format:
1. Yes
2. No
3. Yes

NO explanations. NO additional text. NO comments. ONLY the numbered answers. Each line must be: [number]. [Yes or No]`
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: Math.min(2000, 100 * candidateProducts.length),
        temperature: 0.0,
      });

      const gptOutput = response.choices[0].message.content.trim();
      console.log("\n📋 OpenAI Response:\n", gptOutput, "\n");

      const results = parseBatchResponse(gptOutput, candidateProducts);
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`✓ Matched ${results.length}/${candidateProducts.length} products in this batch`);
      console.log(`⏱️  Batch processing ENDED at ${new Date().toISOString()} (took ${duration}s)`);

      return results;
    } catch (error) {

      console.error(`❌ OpenAI API Error (attempt ${attempt + 1}/${maxRetries + 1}):`, error.message);
      console.log("⚠️ Returning all candidates due to API error (all retries exhausted or non-retryable error)");
      return candidateProducts;

    }
  }
}

function buildBatchPrompt(mainProduct, candidates) {
  const candidateCount = candidates.length;
  
  return `Your task: Match products that refer to the same base product, regardless of size or specifications.

MAIN PRODUCT:
"${mainProduct.title}"

CANDIDATES:
${candidates.map((c, i) => `${i + 1}. "${c.title}"`).join("\n")}

MATCHING RULES:
✓ Match if: Same brand (or implied) + same distinctive product name
✗ Reject if: Different brand OR different product name

CRITICAL: Treat size/volume/ABV differences as if they don't exist. "200ml 37.5%" and "1000ml 40%" are THE SAME product if the brand and name match.

Think: "Would these be found in the same section of a store under the same product name, just in different bottle sizes?"

If YES → answer "Yes"
If NO → answer "No"
If UNSURE → answer "Yes" (prefer inclusion)

OUTPUT FORMAT - STRICT REQUIREMENT:
You MUST respond with EXACTLY ${candidateCount} lines, each in this EXACT format:
1. Yes
2. No
3. Yes

Rules:
- Start each line with the number, followed by a period and space, then "Yes" or "No"
- Use ONLY "Yes" or "No" (capital Y/N, lowercase es/no)
- NO explanations, NO additional text, NO comments
- One answer per line, numbered sequentially from 1 to ${candidateCount}

Now respond with EXACTLY ${candidateCount} lines in the format above:`;
}

function parseBatchResponse(responseText, candidateProducts) {
  const filteredCandidates = [];
  const lines = responseText.split("\n").map(l => l.trim()).filter(Boolean);

  // Strict pattern: Only "1. Yes" or "1. No" format
  const pattern = /^(\d+)\.\s*(Yes|No)$/i;
  const answers = new Map();

  // Parse numbered responses
  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      const index = parseInt(match[1], 10) - 1;
      const answer = match[2].toLowerCase();
      
      if (index >= 0 && index < candidateProducts.length) {
        answers.set(index, answer);
      }
    }
  }

  // Validate we got all answers
  if (answers.size !== candidateProducts.length) {
    console.warn(`⚠️ Expected ${candidateProducts.length} answers, got ${answers.size}. Response may be malformed.`);
    console.warn("Raw response:", responseText);
  }

  // Collect "yes" answers
  for (let i = 0; i < candidateProducts.length; i++) {
    const answer = answers.get(i);
    if (answer === "yes") {
      filteredCandidates.push(candidateProducts[i]);
    } else if (!answer) {
      // Missing answer - log warning but continue
      console.warn(`⚠️ Missing answer for candidate ${i + 1}: "${candidateProducts[i]?.title}"`);
    }
  }

  return filteredCandidates;
}

module.exports = { filterCandidates };