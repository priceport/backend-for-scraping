const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const home_fragrance = async (start, end, browser) => {
  let pageNo = start;
  const url = 'https://www.lifepharmacy.co.nz/collections/home-fragrance?page=';

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(40000);
  const allProducts = [];

  try {
    await page.setRequestInterception(false);

    while (true) {

      await waitForXTime(constants.timeout);

      await page.goto(url + pageNo, { waitUntil: 'networkidle2' });

      const [products, missing] = await page.evaluate(() => {
        const productElements = document.querySelectorAll(
          '.boost-sd__product-item'
        );

        const productList = [];
        let missing = 0;

        productElements.forEach(product => {

          const title = product.querySelector('.boost-sd__product-title')?.innerText.trim() || null;
          const price = product.querySelector('.boost-sd__format-currency')?.innerText.trim() || null;
          const promo = product.querySelector('.boost-sd__product-price--sale, .boost-sd__product-price-sale')?.innerText.trim() || null;

          const url = product.querySelector('.boost-sd__product-info a')?.href || null;

          const imgElement =
            product.querySelector('.boost-sd__product-image-img--main') ||
            product.querySelector('.boost-sd__product-image-img');

          const img = imgElement?.src || null;

          const brand = product.querySelector('.boost-sd__product-vendor')?.innerText.trim() || null;

          if (!title || !price || !url || !img) missing += 1;

          if (title && price && url) {
            productList.push({
              title,
              brand,
              price,
              promo,
              url,
              category: 'beauty',
              source: { 
                website_base: "https://www.lifepharmacy.co.nz", 
                location: "new_zealand", 
                tag: "duty-free" 
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: 'home_fragrance',
              img
            });
          }
        });

        return [productList, missing];
      });


      if (missing > 5) {
        await insertScrapingError(
          "More than 5 entries missing for lifepharmacy - home_fragrance: " + pageNo,
          "scraping_missing"
        );
      }

      allProducts.push(...products);

      if (products.length === 0 || pageNo == end) {
        await page.close();
        return allProducts;
      }

      pageNo++;
    }

  } catch (err) {
    logError(err);
    await insertScrapingError("Error in lifepharmacy - home_fragrance: " + err.message, "scraping_trycatch");
    await page.close();
    return allProducts;
  }
};

module.exports = home_fragrance;
