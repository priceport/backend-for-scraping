const logError = require("../logError");
const logInvalidInput = require("../logInvalidInput");

const sgd_to_usd = (sgd, source) => {
  try {
    if (!sgd) return null;

    if (typeof sgd == "string" && sgd.includes(",")) sgd = sgd.replace(",", "");

    if (isNaN(sgd)) {
    logInvalidInput({ text: sgd, source, type: "sgd_to_usd" });
      return "Invalid input";
    }

    return sgd * 0.75;
  } catch (err) {
    console.log("cant convert for value:" + sgd);
    logError(err);
  }
};

module.exports = sgd_to_usd;

