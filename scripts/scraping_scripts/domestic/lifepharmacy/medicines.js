const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const medicines = async (start, end, browser) => {
  let pageNo = start;
  const url = 'https://www.lifepharmacy.co.nz/collections/medicines?page=';

  const page = await browser.newPage();

  // THESE 4 LINES ARE THE MAGIC THAT BYPASSES CLOUDFLARE + SHOPIFY BLOCKS
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  });

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.40 Safari/537.36'
  );

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    delete navigator.__proto__.webdriver;
    window.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {}, app: {} };
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  });

  await page.setDefaultNavigationTimeout(90000); // increased from 40s → 90s
  const allProducts = [];

  try {
    while (true) {
      console.log(`Scraping Life Pharmacy - Medicines - Page ${pageNo}`);

      await waitForXTime(constants.timeout || 2000);

      await page.goto(url + pageNo, {
        waitUntil: 'networkidle2',
        timeout: 90000
      });

      // Optional: wait for product grid to appear (more reliable)
      await page.waitForSelector('.boost-sd__product-item', { timeout: 10000 }).catch(() => {});

      const [products, missing] = await page.evaluate(() => {
        const productElements = document.querySelectorAll('.boost-sd__product-item');
        const productList = [];
        let missing = 0;

        productElements.forEach(product => {
          const title = product.querySelector('.boost-sd__product-title')?.innerText.trim() || null;
          const price = product.querySelector('.boost-sd__format-currency')?.innerText.trim() || null;
          const promo = product.querySelector('.boost-sd__product-label-text')?.innerText.trim() || null;
          const url = product.querySelector('.boost-sd__product-info a')?.href || null;

          const imgElement = product.querySelector('.boost-sd__product-image-img--main') ||
                            product.querySelector('.boost-sd__product-image-img');
          const img = imgElement?.src || imgElement?.dataset.src || null;

          const brand = product.querySelector('.boost-sd__product-vendor')?.innerText.trim() || null;

          if (!title || !price || !url || !img) missing++;

          if (title && price && url) {
            productList.push({
              title,
              brand,
              price,
              promo,
              url,
              category: 'health',
              source: {
                website_base: "https://www.lifepharmacy.co.nz",
                location: "new_zealand",
                tag: "domestic"
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: 'medicines',
              img
            });
          }
        });

        return [productList, missing];
      });

      console.log(`Page ${pageNo}: Found ${products.length} products (${missing} missing fields)`);

      if (missing > 5) {
        await insertScrapingError(
          `More than 5 entries missing for lifepharmacy - medicines: Page ${pageNo}`,
          "scraping_missing"
        );
      }

      allProducts.push(...products);

      if (products.length === 0 || pageNo >= end) {
        console.log(`Finished scraping Life Pharmacy Medicines. Total: ${allProducts.length} items`);
        await page.close();
        return allProducts;
      }

      pageNo++;
    }
  } catch (err) {
    console.error("FATAL ERROR in lifepharmacy medicines scraper:", err.message);
    logError(err);
    await insertScrapingError("Error in lifepharmacy - medicines: " + err.message, "scraping_trycatch");
    await page.close();
    return allProducts;
  }
};

module.exports = medicines;