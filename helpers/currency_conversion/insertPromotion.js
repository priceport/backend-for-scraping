const { loadExchangeRates, getCachedExchangeRates } = require("./exchangeRates");

const insertPromotion = async ({
  pool,
  productId,
  website,
  text,
  usdPrice,
  date = "current_date",
}) => {
  await loadExchangeRates();
  const rates = getCachedExchangeRates();

  const query =
    date === "current_date"
      ? `INSERT INTO promotion (
          product_id,
          text,
          price,
          date,
          website,
          conversion_rate_nzd,
          conversion_rate_aud,
          conversion_rate_sgd
        ) VALUES ($1, $2, $3, current_date, $4, $5, $6, $7)`
      : `INSERT INTO promotion (
          product_id,
          text,
          price,
          date,
          website,
          conversion_rate_nzd,
          conversion_rate_aud,
          conversion_rate_sgd
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

  const values =
    date === "current_date"
      ? [productId, text || "", usdPrice, website, rates.nzd, rates.aud, rates.sgd]
      : [productId, text || "", usdPrice, date, website, rates.nzd, rates.aud, rates.sgd];

  await pool.query(query, values);
};

module.exports = insertPromotion;
