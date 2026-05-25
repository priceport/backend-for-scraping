const logError = require("../logError");
const logInvalidInput = require("../logInvalidInput");
const { getCachedExchangeRates } = require("./exchangeRates");

const nzd_to_usd = (nzd, source) => {
  try {
    if (!nzd) return null;

    if (typeof nzd == "string" && nzd.includes(",")) nzd = nzd.replace(",", "");

    if (isNaN(nzd)) {
      logInvalidInput({ text: nzd, source, type: "nzd_to_usd" });
      return "Invalid input";
    }

    return Number(nzd) * getCachedExchangeRates().nzd;
  } catch (err) {
    console.log("cant convert for value:" + nzd);
    logError(err);
    return "Invalid input";
  }
};

module.exports = nzd_to_usd;
