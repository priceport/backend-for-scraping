const constants = require("../../../../helpers/constants");
const logError = require("../../../../helpers/logError");
const waitForXTime = require("../../../../helpers/waitForXTime");

const grooming_treatments = async (start, end, browser) => {
  let pageNo = start;
  const url = "https://www.theiconic.com.au/beauty-grooming-treatments/";
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
      await page.goto(url + (pageNo > 1 ? `?page=${pageNo}` : ""), {
        waitUntil: "networkidle2",
      });

      const [products, missing] = await page.evaluate(() => {
        const productElements = document.querySelectorAll(
          ".catalog-page .product"
        );
        const productList = [];
        let missing = 0;

        productElements.forEach((product) => {
          const brand =
            product.querySelector(".brand")?.innerText.trim() || null;
          const title =
            product.querySelector(".name")?.innerText.trim() || null;
          const finalPrice =
            product.querySelector(".price.final")?.innerText.trim() ||
            product.querySelector(".price")?.innerText.trim() ||
            null;
          const image =
            product
              .querySelector(".product-image-link img")
              ?.getAttribute("src") ||
            product
              .querySelector(".product-image-link img")
              ?.getAttribute("data-src") ||
            null;

          const relativeUrl =
            product
              .querySelector(".product-image-link")
              ?.getAttribute("href") || null;
          const fullUrl = relativeUrl
            ? `https://www.theiconic.com.au${relativeUrl}`
            : null;
          let promo;
          if (!title || !brand || !finalPrice || !fullUrl || !image) {
            missing += 1;
          }

          if (!title && !brand && !finalPrice && !promo && !fullUrl) {
          } else
            productList.push({
              title,
              brand,
              price: finalPrice,
              promo,
              url: fullUrl,
              category: "beauty",
              source: {
                website_base: "https://www.theiconic.com.au/",
                location: "australia",
                tag: "domestic",
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: "grooming_treatments",
              image: image?.startsWith("//") ? `https:${image}` : image,
            });
        });

        return [productList, missing];
      });

      if (missing > 5) {
        await insertScrapingError(
          "More than 5 entries missing for the_iconic - grooming_treatments: " +
            pageNo,
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
        "Error in the_iconic - grooming_treatments: " + err.message,
        "scraping_trycatch"
      );
    } catch (err) {
      console.log(err);
    }
    await page.close();
    return allProducts;
  }
};

module.exports = grooming_treatments;
