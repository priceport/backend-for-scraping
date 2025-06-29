const aud_to_usd = require("../../currency_conversion/aud_to_usd");
const logInvalid = require("../../logInvalidFormat");

function parseProductTitle(input) {
  const patterns = [
    // e.g. 3 x 237ml
    /^(.*?)(\d+)\s*x\s*(\d+(\.\d+)?)(ml|g|gm|l|L|mL)/i,

    // e.g. Fragrance Library 8 x 5mL ...
    /(.*)\s(\d+)\s*x\s*(\d+(\.\d+)?)(ml|g|gm|l|L|mL)/i,

    // e.g. Tobac Apricot Travel Spray (10ml)
    /(.*)\((\d+(\.\d+)?)(ml|g|gm|l|L|mL)\)/i,

    // e.g. - 30ml or - 370g
    /(.*)-\s*(\d+(\.\d+)?)(ml|g|gm|l|L|mL)/i,

    // e.g. at end: Probiotic Jojoba Milk Serum 30ml
    /(.*)\s(\d+(\.\d+)?)(ml|g|gm|l|L|mL)$/i,

    // e.g. A Tahaa Affair 380g Soy Candle
    /(.*)\s(\d+(\.\d+)?)(ml|g|gm|l|L|mL)/i,
  ];

  for (const regex of patterns) {
    const match = input.match(regex);
    if (match) {
      return {
        title: match[1]?.trim(),
        quantity: match[3] ? parseFloat(match[3]) : parseFloat(match[2]),
        unit: match[5] || match[4] || null,
      };
    }
  }

  // fallback logging
  logInvalid({ text: input, source: "theiconic" });
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
      !rawData?.brand ||
      !rawData?.source ||
      !rawData?.price
    ) {
      //some logic to retry for that url
      // console.log("Something missing in",rawData);
      iterator += 1;
      continue;
    }

    if (
      aud_to_usd(rawData.price.replace("$", ""), "the_iconic") ==
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

      finalData.brand = rawData.brand.toLowerCase().trim();

      finalData.source = rawData.source;
      finalData.last_check = Date.now();

      finalData.price = [
        {
          text: "",
          price: aud_to_usd(rawData.price.replace("$", ""), "the_iconic"),
        },
      ];

      finalData.img = rawData.image;

      finalData.promo = rawData?.promo;

      output.push(finalData);
    } catch (err) {
      logError(err);
    }

    iterator += 1;
  }
  return output;
};

module.exports = processDataForBeauty;
