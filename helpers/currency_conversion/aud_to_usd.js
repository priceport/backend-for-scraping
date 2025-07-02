const logError = require("../logError");
const logInvalidInput = require("../logInvalidInput");

const aud_to_usd = (aud, source) => {
  try {
    if (!aud) return null;

    if (typeof aud == "string" && aud.includes(",")) aud = aud.replace(",", "");

    if (isNaN(aud)) {
      logInvalidInput({ text: aud, source, type: "aud_to_usd" });
      return "Invalid input";
    }

    return aud * 0.66;
  } catch (err) {
    console.log("cant convert for value:" + aud);
    logError(err);
  }
};

module.exports = aud_to_usd;
