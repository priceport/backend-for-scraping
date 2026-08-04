const puppeteer = require("puppeteer");
const waitForXTime = require("../../../../helpers/waitForXTime");
const constants = require("../../../../helpers/constants");
const logError = require("../../../../helpers/logError");
const { insertScrapingError } = require("../../../../helpers/insertScrapingErrors");

const body = async (start, end, browser) => {
  let pageNo = Math.max(1, Number(start) || 1);
  const endPage = Number(end) || pageNo;
  const urlBase = "https://www.mecca.com/en-nz/body/";
  const page = await browser.newPage();
  const allProducts = [];

  try {
    await page.setRequestInterception(true);

    page.on("request", (req) => {
      const resourceType = req.resourceType();
      // Allow document + scripts/XHR so PLP can hydrate if needed
      if (["document", "script", "xhr", "fetch"].includes(resourceType)) {
        req.continue();
      } else {
        req.abort();
      }
    });

    while (true) {
      await waitForXTime(constants.timeout);
      const pageUrl = `${urlBase}?page=${pageNo}`;
      console.log(`[Mecca Body] Loading ${pageUrl}...`);
      await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

      try {
        await page.waitForSelector('[data-testid="ProductTile"]', { timeout: 15000 });
      } catch (err) {
        console.log(`No products found on Mecca Body page ${pageNo}`);
        await page.close();
        return allProducts;
      }

      const [products, missing] = await page.evaluate((subcategory) => {
        const productElements = document.querySelectorAll(
          '[data-testid="ProductTile"]'
        );
        const productList = [];
        let missingCount = 0;

        productElements.forEach((product) => {
          const titleElement = product.querySelector("a.css-mijcyd");
          const brandElement = product.querySelector(".css-cfm1ok");
          const priceElement = product.querySelector(".css-15zvubz");
          const imgElement = product.querySelector("img");

          const title = titleElement
            ? titleElement.innerText.trim()
            : null;
          const brand = brandElement
            ? brandElement.innerText.trim()
            : null;
          let price = priceElement ? priceElement.innerText.trim() : null;
          // Ranges like "$49.00 - $87.00" → take first amount
          if (price) {
            const m = price.match(/\$[\d,]+(?:\.\d{2})?/);
            if (m) price = m[0];
          }

          let productUrl = titleElement ? titleElement.href.trim() : null;
          if (productUrl && productUrl.startsWith("/")) {
            productUrl = "https://www.mecca.com" + productUrl;
          }

          const img = imgElement
            ? (imgElement.src || imgElement.getAttribute("src") || "").trim()
            : null;

          if (!title || !brand || !price || !productUrl || !img) {
            missingCount += 1;
          }

          // Skip carousel/mini tiles without a real price
          if (title && brand && price && productUrl) {
            productList.push({
              title,
              brand,
              price,
              promo: null,
              url: productUrl,
              category: "beauty",
              source: {
                website_base: "https://www.mecca.com/en-nz",
                location: "new-zealand",
                tag: "domestic",
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory,
              img,
            });
          }
        });

        return [productList, missingCount];
      }, "body");

      if (missing > 5) {
        await insertScrapingError(
          "More than 5 entries missing for mecca - body: " + pageNo,
          "scraping_missing"
        );
      }

      products.forEach((product) => {
        console.log({ title: product.title, price: product.price });
      });

      allProducts.push(...products);

      if (!products || products.length === 0 || pageNo >= endPage) {
        await page.close();
        return allProducts;
      }

      pageNo += 1;
    }
  } catch (err) {
    logError(err);
    try {
      await insertScrapingError(
        "Error in mecca - body: " + err.message,
        "scraping_trycatch"
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

module.exports = body;
