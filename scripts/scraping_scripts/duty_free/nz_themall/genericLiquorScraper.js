const waitForXTime = require("../../../../helpers/waitForXTime");
const constants = require("../../../../helpers/constants");
const logError = require("../../../../helpers/logError");
const {
  insertScrapingError,
} = require("../../../../helpers/insertScrapingErrors");

const genericTheMallScraper = async ({
  start,
  end,
  browser,
  url,
  subcategory,
  category,
}) => {
  let pageNo = start;
  const page = await browser.newPage();
  const allProducts = [];

  try {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      if (resourceType === "document") req.continue();
      else req.abort();
    });

    while (true) {
      await waitForXTime(constants.timeout);
      await page.goto(url + `${pageNo > 1 ? `?page=${pageNo}` : ""}`, {
        waitUntil: "networkidle2",
      });

      const [products, missing] = await page.evaluate(
        (subcategory, category) => {
          const productElements = document.querySelectorAll(
            ".productGrid.searchProductGrid a.productTile.productGridItem"
          );
          const productList = [];
          let missing = 0;

          productElements.forEach((el) => {
            const title = el.getAttribute("title") || null;
            const brand =
              el.querySelector(".productTileBrand")?.innerText.trim() || null;
            let price =
              el
                .querySelector(".priceDiscounted")
                ?.innerText.replace("Price: ", "")
                .trim() || null;
            if (!price) {
              price =
                el
                  .querySelector(".priceValue")
                  ?.innerText.replace("Price: ", "")
                  .trim() || null;
            }
            const imageUrl =
              el.querySelector("img.productTileImage")?.src || null;
            const relativeUrl = el.getAttribute("href") || null;
            const url = relativeUrl
              ? `https://themall.aucklandairport.co.nz${relativeUrl}`
              : null;
            const multiBuyOffers =
              el.querySelector(".pricePromo")?.innerText.trim() || "";

            if (!title || !brand || !price || !url || !imageUrl) {
              missing += 1;
            } else {
              productList.push({
                title,
                brand,
                price,
                promo: multiBuyOffers,
                url,
                category,
                source: {
                  website_base: "https://themall.aucklandairport.co.nz",
                  location: "auckland",
                  tag: "duty-free",
                },
                date: Date.now(),
                last_check: Date.now(),
                mapping_ref: null,
                unit: undefined,
                subcategory,
                img: imageUrl,
              });
            }
          });

          return [productList, missing];
        },
        subcategory,
        category
      );

      if (missing > 5) {
        await insertScrapingError(
          `More than 5 entries missing for au_themall - ${subcategory}: ${pageNo}`,
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
        `Error in au_themall - ${subcategory}: ${err.message}`,
        "scraping_trycatch"
      );
    } catch (err) {
      console.log(err);
    }
    await page.close();
    return allProducts;
  }
};

module.exports = genericTheMallScraper;
