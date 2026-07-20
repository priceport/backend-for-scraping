const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const toners = async (start, end, browser) => {
  // Same pagination contract as other scrapers (e.g. Aelia): scrape pages start..end only.
  // scrapingService advances start/end each outer loop.
  let pageNo = start;
  const url = 'https://www.lifepharmacy.co.nz/collections/toners?page=';

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1440, height: 900 });
  const allProducts = [];

  try {
    await page.setRequestInterception(false);

    while (true) {
      console.log(`[LifePharmacy toners] Loading page ${pageNo}...`);
      await waitForXTime(constants.timeout);

      let loaded = false;
      let navErr = null;
      let gotoOk = false;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          // Shopify/Boost keeps background requests alive — avoid networkidle.
          await page.goto(url + pageNo, { waitUntil: 'domcontentloaded', timeout: 60000 });
          gotoOk = true;

          await page.evaluate(async () => {
            const maxHeight = document.body.scrollHeight || 2000;
            for (let pos = 0; pos < maxHeight; pos += 800) {
              window.scrollTo(0, pos);
              await new Promise((r) => setTimeout(r, 150));
            }
            window.scrollTo(0, 0);
          });

          await page.waitForFunction(
            () => {
              const titles = document.querySelectorAll(
                '.boost-sd__product-title, [id^="product-title-"]'
              );
              for (const t of titles) {
                if ((t.innerText || '').trim().length > 0) return true;
              }
              return false;
            },
            { timeout: 45000 }
          );

          loaded = true;
          break;
        } catch (err) {
          navErr = err;
          if (attempt < 2) {
            await waitForXTime(2000);
          }
        }
      }

      if (!loaded) {
        // Empty page (end of catalogue) or failed hydrate — stop this range.
        if (gotoOk) {
          console.log(
            `[LifePharmacy toners] No product titles on page ${pageNo}; finished (${allProducts.length} total).`
          );
          await page.close();
          return allProducts;
        }
        throw navErr || new Error(`Failed to load lifepharmacy toners page ${pageNo}`);
      }

      await waitForXTime(1500);

      const [products, missing] = await page.evaluate(() => {
        let productElements = Array.from(
          document.querySelectorAll('.boost-sd__product-list > div[id], .boost-sd__product-item')
        );

        if (productElements.length === 0) {
          const titles = document.querySelectorAll(
            '.boost-sd__product-title, [id^="product-title-"]'
          );
          const cards = new Set();
          titles.forEach((t) => {
            const card =
              t.closest('[id]') ||
              t.closest('.boost-sd__product-item') ||
              t.parentElement?.parentElement;
            if (card) cards.add(card);
          });
          productElements = Array.from(cards);
        }

        const productList = [];
        let missing = 0;

        productElements.forEach((product) => {
          const title =
            product.querySelector('.boost-sd__product-title, [id^="product-title-"]')
              ?.innerText.trim() || null;

          const salePrice = product
            .querySelector('.boost-sd__product-price--sale .boost-sd__format-currency')
            ?.innerText.trim();
          const anyPrice = product
            .querySelector('.boost-sd__format-currency')
            ?.innerText.trim();
          const price = salePrice || anyPrice || null;

          const promoElement = product.querySelector('.boost-sd__product-label-text');
          const promo = promoElement?.innerText.trim() || null;

          const url =
            product.querySelector('a.boost-sd__product-link')?.href ||
            product.querySelector('.boost-sd__product-info a')?.href ||
            product.querySelector('a[href*="/products/"]')?.href ||
            null;

          const imgElement =
            product.querySelector('.boost-sd__product-image-img--main') ||
            product.querySelector('.boost-sd__product-image-img') ||
            product.querySelector('img');

          const img = imgElement?.src || imgElement?.getAttribute('data-src') || null;

          const brand =
            product.querySelector('.boost-sd__product-vendor')?.innerText.trim() || null;

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
                website_base: 'https://www.lifepharmacy.co.nz',
                location: 'new_zealand',
                tag: 'domestic',
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: 'toners',
              img,
            });
          }
        });

        return [productList, missing];
      });

      if (missing > 5) {
        await insertScrapingError(
          'More than 5 entries missing for lifepharmacy - toners: ' + pageNo,
          'scraping_missing'
        );
      }

      allProducts.push(...products);

      products.forEach((product) =>
        console.log({ title: product.title, price: product.price })
      );

      if (products.length === 0 || pageNo == end) {
        await page.close();
        return allProducts;
      }

      pageNo++;
    }
  } catch (err) {
    logError(err);
    await insertScrapingError(
      'Error in lifepharmacy - toners: ' + err.message,
      'scraping_trycatch'
    );
    try {
      await page.close();
    } catch (_) {}
    return allProducts;
  }
};

module.exports = toners;
