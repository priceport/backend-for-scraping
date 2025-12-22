const waitForXTime = require("../../../../helpers/waitForXTime");
const constants = require("../../../../helpers/constants");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const {
  insertScrapingError,
} = require("../../../../helpers/insertScrapingErrors");
const logError = require("../../../../helpers/logError");

puppeteer.use(StealthPlugin());

const bath = async (start, end) => {
  let pageNo = start;
  const url =
    "https://www.sephora.com.au/categories/bath-and-body?page=replace_me&view=120";

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-http2", "--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const allProducts = [];

  try {
    // Enable request interception to block unnecessary resources
    await page.setRequestInterception(true);

    // Only allow 'document' (HTML) requests
    page.on("request", (req) => {
      const resourceType = req.resourceType();

      if (resourceType === "document") {
        req.continue();
      } else {
        req.abort(); // Block other resources like JS, CSS, images, etc.
      }
    });

    while (true) {
      await waitForXTime(constants.timeout);
      await page.goto(url.replace("replace_me", pageNo), {
        waitUntil: "networkidle2",
      });

      const [products, missing] = await page.evaluate(() => {
        const productElements = document.querySelectorAll(
          ".products-grid-container > .products-card-container"
        );
        const productList = [];
        let missing = 0;

        productElements.forEach((product) => {
          const titleElement = product.querySelector(".product-name");
          const brandElement = product.querySelector(".brand");
          const sellPriceElement = product.querySelector(".sell-price");
          const pricesDiv = product.querySelector(".prices");
          const saleTextElement = product.querySelector(".sale-text");
          const urlElement = product.querySelector(".product-card-image-link");
          const imgElement = product.querySelector(".product-card-image");

          const title = titleElement ? titleElement.innerText.trim() : null;
          const brand = brandElement ? brandElement.innerText.trim() : null;
          let price = null;
          let promo = null;

          if (sellPriceElement) {
            price = sellPriceElement.innerText.trim();
          } else if (pricesDiv) {
            const pricesText = pricesDiv.innerText.trim();
            const priceMatches = pricesText.match(/\$[\d,]+\.?\d{0,2}/g);
            if (priceMatches && priceMatches.length > 0) {
              price = priceMatches[priceMatches.length - 1];
            }
          }

          if (saleTextElement) {
            promo = [{ saleText: saleTextElement.innerText.trim() }];
          }

          const url = urlElement ? urlElement.href.trim() : null;
          const img = imgElement ? imgElement.src.trim() : null;

          if (!title || !brand || !price || !url || !img) {
            missing += 1;
          }

          if (!title && !brand && !price && !url) {
          } else
            productList.push({
              title,
              brand,
              price,
              promo,
              url,
              category: "beauty",
              source: {
                website_base: "https://www.sephora.com.au/",
                location: "australia",
                tag: "domestic",
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: "bath",
              img,
            });
        });

        return [productList, missing];
      });

      if (missing > 5) {
        await insertScrapingError(
          "More than 5 entries missing for au_sephora - bath: " + pageNo,
          "scraping_missing"
        );
      }

      allProducts.push(...products);

      if (products?.length == 0 || pageNo == end) {
        await page.close();
        await browser.close();
        return allProducts;
      }

      pageNo += 1;
    }
  } catch (err) {
    logError(err);
    try {
      await insertScrapingError(
        "Error in au_sephora - bath: " + err.message,
        "scraping_trycatch"
      );
    } catch (err) {
      console.log(err);
    }
    await page.close();
    await browser.close();
    return allProducts;
  }
};

module.exports = bath;
