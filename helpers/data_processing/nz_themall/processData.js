const nzd_to_usd = require("../../currency_conversion/nzd_to_usd");
const logError = require("../../logError");
const logInvalid = require("../../logInvalidFormat");

// Helper: Parse multi-buy and discount promo text
function calculatePriceFromText(text, og_price) {
  const prices = [];
  const offers = text.split("/");

  offers.forEach((offer) => {
    offer = offer.trim();

    // "2 for $79"
    const matchForXForY = offer.match(/(\d+)\s*(?:for|tor)\s*\$(\d+)/i);
    if (matchForXForY) {
      const quantity = parseInt(matchForXForY[1], 10);
      const price = parseFloat(matchForXForY[2]);
      prices.push({
        text: offer,
        price: nzd_to_usd((price / quantity).toFixed(3)),
      });
      return;
    }

    // "Buy 2 save 20%"
    const matchBuyXSaveYPercent = offer.match(
      /(?:buy\s*)?(\d+)\s*save\s*(\d+)%/i
    );
    if (matchBuyXSaveYPercent) {
      const quantity = parseInt(matchBuyXSaveYPercent[1], 10);
      const discount = parseInt(matchBuyXSaveYPercent[2], 10) / 100;
      const effectivePrice = og_price * (1 - discount);
      prices.push({
        text: offer,
        price: nzd_to_usd(effectivePrice.toFixed(3)),
      });
      return;
    }
  });

  if (prices?.length == 0) return null;
  return prices;
}

// INPUT: Dalmore The Quartet 1L 75.4%
// OUTPUT: { title: 'Dalmore The Quartet', quantity: 1, unit: 'L' }
function parseProductTitle(input) {
  // This regex captures: title, quantity, unit (with optional space)
  const patterns = [
    /^(.*?)(?:\s+)?twin pack\s+(\d+)\s*x\s*(\d+(\.\d+)?)[ ]?(g|ml|l|litre|cl)/i,
    /^(.*)\s(\d+(\.\d+)?)[ ]?(g|ml|l|litre|cl|bottle)\s*$/i,
    /(.*)\s[-–]?\s*(\d+(\.\d+)?)[ ]?(g|ml|l|litre|cl)/i,
    /(.*?)(\d{2,})\s*(yo|year\s*old).*?(\d+(\.\d+)?)[ ]?(g|ml|l|litre|cl)/i,
    /(.*?)(\d+(\.\d+)?)[ ]?(g|ml|l|litre|cl)/i,
  ];

  for (const regex of patterns) {
    const match = input.match(regex);
    if (match) {
      if (regex === patterns[0]) {
        return {
          title: input,
          quantity: parseFloat(match[3]) * parseInt(match[2], 10),
          unit: match[5] ? match[5].toLowerCase() : null,
        };
      }
      if (regex === patterns[3]) {
        return {
          title: input,
          quantity: parseFloat(match[4]),
          unit: match[6] ? match[6].toLowerCase() : null,
        };
      }
      return {
        title: input,
        quantity: match[2] ? parseFloat(match[2]) : null,
        unit: match[4]
          ? match[4].toLowerCase()
          : match[3]
          ? match[3].toLowerCase()
          : null,
      };
    }
  }
  logInvalid({ text: input, source: "nz_themall" });
  return {
    title: input.trim(),
    quantity: null,
    unit: null,
  };
}

// Main function
const processData = async (data) => {
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
      iterator += 1;
      continue;
    }

    if (
      nzd_to_usd(rawData.price.replace("$", ""), "nz_themall") ==
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
          price: nzd_to_usd(rawData.price.replace("$", ""), "nz_themall"),
        },
      ];

      // Handle promo text directly (no OCR)
      if (rawData?.promo && rawData?.promo?.length > 0) {
        let promoText = rawData.promo || "";
        let res = calculatePriceFromText(
          promoText,
          parseFloat(rawData.price.replace("$", ""))
        );
        if (res) {
          finalData.promo = res;
        }
      }

      finalData.img = rawData.img;

      output.push(finalData);
    } catch (err) {
      logError(err);
    }

    iterator += 1;
  }

  return output;
};

module.exports = processData;
