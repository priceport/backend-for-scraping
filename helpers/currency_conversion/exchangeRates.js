const logError = require("../logError");

const STATIC_RATES = {
  nzd: 0.58,
  aud: 0.7,
  sgd: 0.78,
};

const FRANKFURTER_BASE = "https://api.frankfurter.dev";

let cachedRates = null;
let cachedDate = null;
let loadPromise = null;

const todayKey = () => new Date().toISOString().slice(0, 10);

const fetchRate = async (from, to = "USD") => {
  const response = await fetch(
    `${FRANKFURTER_BASE}/v2/rate/${from}/${to}`
  );
  if (!response.ok) {
    throw new Error(`Frankfurter ${from}/${to}: HTTP ${response.status}`);
  }
  const data = await response.json();
  if (data?.rate == null || Number.isNaN(Number(data.rate))) {
    throw new Error(`Frankfurter ${from}/${to}: invalid rate`);
  }
  return Number(data.rate);
};

const fetchRatesFromApi = async () => {
  const [nzd, aud, sgd] = await Promise.all([
    fetchRate("NZD"),
    fetchRate("AUD"),
    fetchRate("SGD"),
  ]);
  return { nzd, aud, sgd };
};

/**
 * Load today's FX rates (cached in memory for the calendar day).
 * Falls back to STATIC_RATES if the API fails.
 */
const loadExchangeRates = async () => {
  const key = todayKey();
  if (cachedRates && cachedDate === key) {
    return cachedRates;
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      const rates = await fetchRatesFromApi();
      cachedRates = rates;
      cachedDate = key;
      console.log(
        `Exchange rates (${key}): NZD=${rates.nzd}, AUD=${rates.aud}, SGD=${rates.sgd}`
      );
      return rates;
    } catch (err) {
      logError(err);
      console.log("Using static exchange rate fallback");
      cachedRates = { ...STATIC_RATES };
      cachedDate = key;
      return cachedRates;
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
};

const getCachedExchangeRates = () => cachedRates || { ...STATIC_RATES };

module.exports = {
  STATIC_RATES,
  loadExchangeRates,
  getCachedExchangeRates,
};
