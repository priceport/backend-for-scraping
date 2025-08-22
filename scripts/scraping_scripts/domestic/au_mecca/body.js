const waitForXTime = require("../../../../helpers/waitForXTime");
const constants = require("../../../../helpers/constants");
const logError = require("../../../../helpers/logError");
const {
  insertScrapingError,
} = require("../../../../helpers/insertScrapingErrors");

const body = async (start, end, browser) => {
  let pageNo = start;
  const url = "https://www.mecca.com/en-au/body-personal-care/?page=";

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
      await page.goto(url + pageNo, { waitUntil: "networkidle2" });

      const [products, missing] = await page.evaluate(() => {
        const productElements = document.querySelectorAll(
          ".css-1mdzhs1"
        );
        const productList = [];
        let missing = 0;

        productElements.forEach((product) => {
          const titleElement = product.querySelector(".css-mijcyd");
          const brandElement = product.querySelector(".css-cfm1ok");
          const priceElement = product.querySelector(".css-15zvubz");
          // const promoElement = product.querySelectorAll('.amasty-label-container > img');
          const urlElement = product.querySelector(".css-mijcyd");
          const imgElement = product.querySelector(".css-1llogg1 img");

          // console.log(titleElement.innerText);
          // console.log(brandElement);
          // console.log(priceElement);
          // console.log(urlElement);
          // console.log(imgElement);

          const title = titleElement ? titleElement.innerText.trim() : null;
          const brand = brandElement ? brandElement.innerText.trim() : null;
          const price = priceElement ? priceElement.innerText.trim() : null;
          // const promo = promoElement ? Array.from(promoElement)?.map(promo=>promo.src.trim()) : null;
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
              promo: null,
              url,
              category: "beauty",
              source: {
                website_base: "https://www.mecca.com/en-au",
                location: "australia",
                tag: "domestic",
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: "body",
              img,
            });
        });

        return [productList, missing];
      });

      if (missing > 5) {
        await insertScrapingError(
          "More than 5 entries missing for au_mecca - body: " + pageNo,
          "scraping_missing"
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
        "Error in au_mecca - body: " + err.message,
        "scraping_trycatch"
      );
    } catch (err) {
      console.log(err);
    }
    await page.close();
    return allProducts;
  }
};

module.exports = body;
