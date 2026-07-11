const AUD_WEBSITES = new Set([
  "au_sephora",
  "au_mecca",
  "au_chemist_warehouse",
  "liquorland_aus",
  "dan_murphy",
  "the_iconic",
  "laneway_melbourne",
]);

const SGD_WEBSITES = new Set([]);

const RATE_COLUMN = {
  NZD: "conversion_rate_nzd",
  AUD: "conversion_rate_aud",
  SGD: "conversion_rate_sgd",
};

const getCurrencyForWebsite = (website) => {
  if (SGD_WEBSITES.has(website)) return "SGD";
  if (AUD_WEBSITES.has(website)) return "AUD";
  return "NZD";
};

const getRateForCurrency = (rates, currency) => {
  if (currency === "AUD") return rates.aud;
  if (currency === "SGD") return rates.sgd;
  return rates.nzd;
};

const normalizeLocalPrice = (price) => {
  const n = Number(price);
  if (!Number.isFinite(n)) return null;
  return parseFloat(n.toFixed(2));
};

const localPriceFromUsdRow = (usdPrice, row, currency) => {
  if (!row || usdPrice == null) return null;
  const column = RATE_COLUMN[currency];
  const rate = Number(row[column]);
  if (!rate || Number.isNaN(rate)) return null;
  return normalizeLocalPrice(Number(usdPrice) / rate);
};

const hasLocalPriceChanged = (latestRow, scrapedLocalPrice, currency) => {
  const scraped = normalizeLocalPrice(scrapedLocalPrice);
  if (scraped == null) return false;

  if (!latestRow) return true;

  const previous = localPriceFromUsdRow(latestRow.price, latestRow, currency);
  if (previous == null) return true;

  return previous !== scraped;
};

const RATE_EPSILON = 0.000005;

const normalizeRate = (rate) => {
  const n = Number(rate);
  if (!Number.isFinite(n)) return null;
  return parseFloat(n.toFixed(5));
};

/**
 * True when any stamped FX rate differs from today's scrape rates.
 * Compared at 5 decimal places to ignore floating-point noise.
 */
const hasConversionRatesChanged = (latestRow, rates) => {
  if (!latestRow) return true;
  if (!rates) return true;

  const pairs = [
    [latestRow.conversion_rate_nzd, rates.nzd],
    [latestRow.conversion_rate_aud, rates.aud],
    [latestRow.conversion_rate_sgd, rates.sgd],
  ];

  return pairs.some(([stored, current]) => {
    const a = normalizeRate(stored);
    const b = normalizeRate(current);
    if (a == null || b == null) return true;
    return Math.abs(a - b) > RATE_EPSILON;
  });
};

/**
 * Insert when shelf changed OR FX rates changed (even if shelf is unchanged).
 */
const shouldInsertPriceRow = (latestRow, scrapedLocalPrice, currency, rates) => {
  if (!latestRow) return true;
  return (
    hasLocalPriceChanged(latestRow, scrapedLocalPrice, currency) ||
    hasConversionRatesChanged(latestRow, rates)
  );
};

module.exports = {
  getCurrencyForWebsite,
  getRateForCurrency,
  normalizeLocalPrice,
  normalizeRate,
  localPriceFromUsdRow,
  hasLocalPriceChanged,
  hasConversionRatesChanged,
  shouldInsertPriceRow,
  RATE_COLUMN,
};
