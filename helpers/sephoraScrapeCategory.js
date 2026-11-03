const waitForXTime = require('./waitForXTime');
const constants = require('./constants');
const { insertScrapingError } = require('./insertScrapingErrors');
const logError = require('./logError');

const PRODUCT_SELECTOR = '.product-card';

/**
 * Shared Sephora NZ category scraper using an already-warmed real browser.
 */
const scrapeSephoraCategory = async (start, end, browser, { urlTemplate, subcategory }) => {
  let pageNo = start;
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // New tabs need proxy auth separately from the warmup page
  if (process.env.SEPHORA_PROXY_USERNAME && process.env.SEPHORA_PROXY_PASSWORD) {
    await page.authenticate({
      username: process.env.SEPHORA_PROXY_USERNAME,
      password: process.env.SEPHORA_PROXY_PASSWORD,
    });
  }

  const allProducts = [];

  try {
    while (true) {
      await waitForXTime(constants.timeout);
      await page.goto(urlTemplate.replace('replace_me', pageNo), {
        waitUntil: 'domcontentloaded',
        timeout: 90000,
      });

      const title = (await page.title()).toLowerCase();
      if (
        title.includes('access denied') ||
        title.includes('just a moment') ||
        title.includes('attention required')
      ) {
        throw new Error(`Sephora blocked (${title}) on ${subcategory} page ${pageNo}`);
      }

      await page.waitForSelector(PRODUCT_SELECTOR, { visible: true, timeout: 90000 });

      const [products, missing] = await page.evaluate(
        (selector, subcategoryName) => {
          const productElements = document.querySelectorAll(selector);
          const productList = [];
          let missingCount = 0;

          productElements.forEach((product) => {
            const titleElement = product.querySelector('.product-name');
            const priceElement =
              product.querySelector('.sell-price') ||
              product.querySelector('.original-price');
            const originalPriceElement = product.querySelector('.original-price');
            const saleTextElement = product.querySelector('.sale-text');
            const sellPriceElement = product.querySelector('.sell-price');
            const urlElement = product.querySelector('a.product-card-link');
            const imgElement = product.querySelector('img');

            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = product.getAttribute('data-product-brand') || null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            let url = urlElement ? urlElement.href.trim() : null;
            if (url && !url.startsWith('http')) {
              url = 'https://www.sephora.nz' + url;
            }
            let img =
              imgElement && imgElement.src
                ? imgElement.src.trim()
                : product.getAttribute('imageurl') || null;
            if (img && !img.startsWith('http')) {
              img = 'https://www.sephora.nz' + img;
            }

            let promo = null;
            if (originalPriceElement && sellPriceElement && saleTextElement) {
              const originalPrice = originalPriceElement.innerText.trim();
              const saleText = saleTextElement.innerText.trim();
              const sellPrice = sellPriceElement.innerText.trim();

              if (originalPrice && sellPrice && originalPrice !== sellPrice && saleText) {
                const originalPriceNum = parseFloat(
                  originalPrice.replace(/[^0-9.]/g, '')
                );
                const sellPriceNum = parseFloat(sellPrice.replace(/[^0-9.]/g, ''));

                if (!isNaN(originalPriceNum) && !isNaN(sellPriceNum)) {
                  promo = [{ text: saleText, price: sellPriceNum }];
                }
              }
            }

            if (!title || !brand || !price || !url || !img) {
              missingCount += 1;
            }

            if (!title && !brand && !price && !url) {
              // skip empty
            } else {
              productList.push({
                title,
                brand,
                price,
                promo,
                url,
                category: 'beauty',
                source: {
                  website_base: 'https://www.sephora.nz',
                  location: 'new-zealand',
                  tag: 'domestic',
                },
                date: Date.now(),
                last_check: Date.now(),
                mapping_ref: null,
                unit: undefined,
                subcategory: subcategoryName,
                img,
              });
            }
          });

          return [productList, missingCount];
        },
        PRODUCT_SELECTOR,
        subcategory
      );

      if (missing > 5) {
        await insertScrapingError(
          `More than 5 entries missing for sephora - ${subcategory}: ${pageNo}`,
          'scraping_missing'
        );
      }

      allProducts.push(...products);

      if (products?.length == 0 || pageNo == end) {
        await page.close();
        return allProducts;
      }

      pageNo += 1;
    }
  } catch (err) {
    logError(err);
    try {
      await insertScrapingError(
        `Error in sephora - ${subcategory}: ${err.message}`,
        'scraping_trycatch'
      );
    } catch (e) {
      console.log(e);
    }
    try {
      await page.close();
    } catch (_) {}
    return allProducts;
  }
};

module.exports = scrapeSephoraCategory;
