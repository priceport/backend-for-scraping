const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const womens_fragrance = async (start, end, browser) => {
  // One Chromium tab scrapes every page until empty (or safety ceiling).
  // Do not rely on scrapingService relaunching a browser per page — that OOMs EC2.
  let pageNo = Math.max(1, start || 1);
  const maxPage = Math.max(end || 1, 200);
  const url = 'https://www.lifepharmacy.co.nz/collections/womens-fragrance?page=';

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1440, height: 900 });
  const allProducts = [];

  try {
    await page.setRequestInterception(false);

    while (pageNo <= maxPage) {
      console.log(`[LifePharmacy womens_fragrance] Loading page ${pageNo}...`);
      await waitForXTime(constants.timeout);

      let loaded = false;
      let navErr = null;
      let gotoOk = false;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          // Shopify/Boost keeps background requests alive — avoid networkidle.
          // Product cards are hydrated by Boost JS after load; wait for real titles.
          await page.goto(url + pageNo, { waitUntil: 'domcontentloaded', timeout: 60000 });
          gotoOk = true;

          // Trigger lazy/Boost render
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
        // End of catalogue: page loaded but Boost never rendered titles.
        if (gotoOk && allProducts.length > 0) {
          console.log(
            `[LifePharmacy womens_fragrance] No product titles on page ${pageNo}; finished (${allProducts.length} total).`
          );
          await page.close();
          return allProducts;
        }
        throw navErr || new Error(`Failed to load lifepharmacy womens_fragrance page ${pageNo}`);
      }

      // Give Boost a beat to finish filling price/image nodes after titles appear
      await waitForXTime(1500);

      const [products, missing] = await page.evaluate(() => {
        // Boost cards may not use .boost-sd__product-item — prefer list children with ids,
        // then fall back to walking up from titles.
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

          // Prefer sale price if present, else first currency span
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
              subcategory: 'womens_fragrance',
              img,
            });
          }
        });

        return [productList, missing];
      });

      if (missing > 5) {
        await insertScrapingError(
          'More than 5 entries missing for lifepharmacy - womens_fragrance: ' + pageNo,
          'scraping_missing'
        );
      }

      allProducts.push(...products);

      products.forEach((product) =>
        console.log({ title: product.title, price: product.price })
      );

      // Empty page = end of catalogue. Stay on one browser instance for all pages.
      if (products.length === 0) {
        console.log(
          `[LifePharmacy womens_fragrance] No products on page ${pageNo}; finished (${allProducts.length} total).`
        );
        await page.close();
        return allProducts;
      }

      pageNo++;
    }

    console.log(
      `[LifePharmacy womens_fragrance] Reached safety max page ${maxPage}; finished (${allProducts.length} total).`
    );
    await page.close();
    return allProducts;
  } catch (err) {
    logError(err);
    await insertScrapingError(
      'Error in lifepharmacy - womens_fragrance: ' + err.message,
      'scraping_trycatch'
    );
    try {
      await page.close();
    } catch (_) {}
    return allProducts;
  }
};

module.exports = womens_fragrance;
