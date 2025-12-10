// scripts/scraping_scripts/domestic/lifepharmacy/medicines.js

const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const medicines = async (start, end, browser) => {
  let pageNo = start;
  const url = 'https://www.lifepharmacy.co.nz/collections/medicines?page=';
  const allProducts = [];

  const page = await browser.newPage();

  // PROXY AUTHENTICATION (YOUR WEBSHARE CREDENTIALS)
  await page.authenticate({
    username: 'ftjgwyap',
    password: '17xe9se18188'
  });

  // FULL ANTI-BOT STEALTH + HEADERS
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Upgrade-Insecure-Requests': '1'
  });

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.40 Safari/537.36'
  );

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    delete navigator.__proto__.webdriver;
    window.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {}, app: {} };
    Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US','en'] });
  });

  await page.setDefaultNavigationTimeout(120000);

  try {
    while (true) {
      console.log(`Scraping Life Pharmacy - Medicines - Page ${pageNo}`);

      await waitForXTime(constants.timeout || 3000);

      await page.goto(url + pageNo, {
        waitUntil: 'networkidle2',
        timeout: 120000
      });

      await page.waitForSelector('.boost-sd__product-item', { timeout: 15000 }).catch(() => {});

      const [products, missing] = await page.evaluate(() => {
        const items = document.querySelectorAll('.boost-sd__product-item');
        const list = [];
        let missingCount = 0;

        items.forEach(el => {
          const title = el.querySelector('.boost-sd__product-title')?.innerText.trim() || null;
          const price = el.querySelector('.boost-sd__format-currency')?.innerText.trim() || null;
          const url = el.querySelector('.boost-sd__product-info a')?.href || null;
          const imgEl = el.querySelector('.boost-sd__product-image-img--main') ||
                        el.querySelector('.boost-sd__product-image-img');
          const img = imgEl?.src || imgEl?.dataset.src || null;
          const brand = el.querySelector('.boost-sd__product-vendor')?.innerText.trim() || null;

          if (!title || !price || !url || !img) missingCount++;

          if (title && price && url) {
            list.push({
              title, brand, price, url, img,
              promo: el.querySelector('.boost-sd__product-label-text')?.innerText.trim() || null,
              category: 'health',
              subcategory: 'medicines',
              source: { website_base: "https://www.lifepharmacy.co.nz", location: "new_zealand", tag: "domestic" },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined
            });
          }
        });

        return [list, missingCount];
      });

      console.log(`Page ${pageNo}: Found ${products.length} products (${missing} missing fields)`);
      allProducts.push(...products);

      if (missing > 5) {
        await insertScrapingError(`Lifepharmacy page ${pageNo}: ${missing} missing fields`, "scraping_missing");
      }

      if (products.length === 0 || pageNo >= end) {
        console.log(`Finished! Total items scraped: ${allProducts.length}`);
        await page.close();
        return allProducts;
      }

      pageNo++;
    }
  } catch (err) {
    console.error("FATAL ERROR in lifepharmacy scraper:", err.message);
    logError(err);
    await insertScrapingError("Lifepharmacy medicines error: " + err.message, "scraping_trycatch");
    await page.close();
    return allProducts;
  }
};

module.exports = medicines;