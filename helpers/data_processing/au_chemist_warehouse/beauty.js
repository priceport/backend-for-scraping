const fs = require("fs");
const logError = require("../../logError");
const logInvalid = require("../../logInvalidFormat");
const aud_to_usd = require("../../currency_conversion/aud_to_usd");

//INPUT: Dalmore The Quartet 1L 75.4%
//OUTPUT: { title: 'Dalmore The Quartet', quantity: 1, unit: 'L' }
function parseProductTitle(input) {
  let match = input.match(
    /^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)$/
  );

  ///
  match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm|floz)(\/\d+(\.\d+)?floz)?$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)\s(\d+)\s(.*)\s(\d+(\.\d+)?)(ml|gm)$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm|floz)$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)(\/\d+(\.\d+)?floz)?$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)\s(\d+)$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*\d+.*)\s(\d+(\.\d+)?)(ml|gm)$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)(.*)?$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)\s?(.*)?$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)(\/\d+(\.\d+)?(floz|oz))?$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)\s?(.*)?$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.+\d+.*)\s(\d+(\.\d+)?)(ml|gm)$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.+)\s(\d+(\.\d+)?)(ml|gm)(.*)?$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/^(.+)\s(\d+(\.\d+)?)(ml|gm)\s?(.*)?$/);
  if (match && match[2] && match[4]) {
    return {
      title: match[1]?.trim(),
      quantity: match[2] ? parseFloat(match[2]) : null,
      unit: match[4] || null,
    };
  }

  match = input.match(/(\d+(?:\.\d+)?)\s*(ml|l|g|kg)/i);
  if (match) {
    let result = {};
    result.quantity = match[1];
    result.unit = match[2];
    result.title = input;

    // Follow-up check for cases like "2x1l"
    const multiMatch = input.match(/(\d+)\s*x\s*(\d+)\s*(ml|l)/i);
    if (multiMatch) {
      const multiplier = parseFloat(multiMatch[1]); // First part (e.g., 2 in 2x1)
      const perUnitQuantity = parseFloat(multiMatch[2]); // Second part (e.g., 1 in 2x1)
      result.quantity = multiplier * perUnitQuantity; // Calculate total quantity
    }

    return result;
  }

  // console.log("Invalid format or unit.", input);
  logInvalid({ text: input, source: "au chemist warehouse" });
  return {
    title: input,
    quantity: null,
    unit: null,
  };
}

const processDataForBeauty = async (data) => {
  const output = [];
  let iterator = 0;

  while (iterator < data?.length) {
    const rawData = data[iterator];
    const finalData = {};

    if (
      !rawData?.url ||
      !rawData?.category ||
      !rawData?.title ||
      !rawData?.source ||
      !rawData?.price
    ) {
      //some logic to retry for that url
      // console.log("Something missing in",rawData);
      iterator += 1;
      continue;
    }

    if (
      aud_to_usd(rawData.price.replace("$", ""), "au chemist warehouse") ==
      "Invalid input"
    ) {
      iterator += 1;
      continue;
    }

    try {
      finalData.url = rawData?.url;
      finalData.category = rawData?.category;
      finalData.sub_category = rawData?.subcategory;

      let breaktitle = parseProductTitle(rawData?.title);

      if (!breaktitle)
        throw new Error("Invalid pattern for: " + rawData?.title);

      finalData.title = breaktitle.title?.toLowerCase();
      finalData.unit = breaktitle.unit?.toLowerCase();
      finalData.quantity = breaktitle.quantity;

      finalData.brand = null;

      finalData.source = rawData.source;
      finalData.last_check = Date.now();

      finalData.price = [
        {
          text: "",
          price: aud_to_usd(
            rawData.price.replace("$", ""),
            "au chemist warehouse"
          ),
        },
      ];

      finalData.img = rawData.img;

      finalData.promo = rawData.promo;

      if (isNaN(finalData?.price[0]?.price)) {
        iterator += 1;
        continue;
      }

      output.push(finalData);
    } catch (err) {
      logError(err);
    }

    iterator += 1;
  }

  return output;
};

module.exports = processDataForBeauty;
