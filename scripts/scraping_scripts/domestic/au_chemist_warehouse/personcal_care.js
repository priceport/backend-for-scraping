const { timeout } = require("../../../../helpers/constants");
const {
  insertScrapingError,
} = require("../../../../helpers/insertScrapingErrors");
const logError = require("../../../../helpers/logError");
const waitForXTime = require("../../../../helpers/waitForXTime");

const personal_care = async (start, end, browser) => {
  let pageNo = start;
  const url =
    "https://www.chemistwarehouse.com.au/shop-online/259/personal-care";
  const page = await browser.newPage();
  const allProducts = [];

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    // Enable request interception to block unnecessary resources
    await page.setRequestInterception(true);

    // Only allow 'document' (HTML) requests
    page.on("request", (req) => {
      const resourceType = req.resourceType();

      if (["document", "xhr", "script"].includes(resourceType)) {
        req.continue();
      } else {
        req.abort();
      }
    });

    while (true) {
      await waitForXTime(timeout);
      await page.goto(url + (pageNo > 1 ? `?page=${pageNo}` : ""), {
        waitUntil: "networkidle2",
      });

      // Then try to wait for the selector
      await page.waitForSelector("li.group.relative.list-none", {
        timeout: 10000,
      });

      const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll(
          "li.group.relative.list-none"
        );
        const productList = [];
        let missing = 0;

        productElements.forEach((product) => {
          const title =
            product.querySelector("p.body-s a")?.innerText.trim() || null;
          const url = product.querySelector("p.body-s a")?.href || null;
          const img = product.querySelector("img")?.src || null;

          const price =
            product
              .querySelector("p.text-colour-title-light.headline-xl")
              ?.innerText.trim() || null;

          if (title || brand || price || url) {
            productList.push({
              title,
              brand: null,
              price,
              promo: null,
              url,
              category: "beauty",
              source: {
                website_base: "https://www.chemistwarehouse.com.au",
                location: "australia",
                tag: "domestic",
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: "personal_care",
              img,
            });
          }
        });
        return productList;
      });

      // Push new products to the allProducts array
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
        "Error in au_chemist_warehouse - personal_care: " + err.message,
        "scraping_trycatch"
      );
    } catch (err) {
      console.log(err);
    }
    await page.close();
    return allProducts;
  }
};

module.exports = personal_care;
