const {
  loadExchangeRates,
  getCachedExchangeRates,
} = require("./exchangeRates");
const {
  getCurrencyForWebsite,
  hasLocalPriceChanged,
} = require("./priceConversionUtils");

const LATEST_PRICE_QUERY = `
  SELECT price, conversion_rate_nzd, conversion_rate_aud, conversion_rate_sgd
  FROM price
  WHERE product_id = $1 AND website = $2
  ORDER BY date DESC, id DESC
  LIMIT 1
`;

const INSERT_PRICE_QUERY = `
  INSERT INTO price (
    product_id, date, price, website, price_per_unit,
    conversion_rate_nzd, conversion_rate_aud, conversion_rate_sgd
  )
  VALUES ($1, current_date, $2, $3, $4, $5, $6, $7)
`;

/**
 * Insert a price row only when scraped local price changed vs latest DB row.
 * @returns {Promise<boolean>} true if a row was inserted
 */
const syncPriceEntry = async ({
  pool,
  productId,
  website,
  usdPrice,
  localPrice,
  pricePerUnit,
  currency,
}) => {
  await loadExchangeRates();
  const rates = getCachedExchangeRates();
  const resolvedCurrency =
    currency || getCurrencyForWebsite(website);

  const latest = await pool.query(LATEST_PRICE_QUERY, [productId, website]);
  const latestRow =
    latest.rowCount > 0 ? latest.rows[0] : null;

  if (
    !hasLocalPriceChanged(latestRow, localPrice, resolvedCurrency)
  ) {
    return false;
  }

  await pool.query(INSERT_PRICE_QUERY, [
    productId,
    usdPrice,
    website,
    pricePerUnit,
    rates.nzd,
    rates.aud,
    rates.sgd,
  ]);

  return true;
};

module.exports = syncPriceEntry;
