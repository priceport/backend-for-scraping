const puppeteer = require("puppeteer");
const waitForXTime = require("../../../../helpers/waitForXTime");
const constants = require("../../../../helpers/constants");
const logError = require("../../../../helpers/logError");
const { insertScrapingError } = require("../../../../helpers/insertScrapingErrors");

const champagnes = async (start, end, browser) => {
  let pageNo = start;
  const url = "https://www.ishopchangi.com/en/category/wine-and-spirits/wines-and-champagnes/champagnes?page=";
  const page = await browser.newPage();
  const allProducts = [];

  try {
    await page.setRequestInterception(false);

    while (true) {
      console.log(`[Champagnes] Loading page ${pageNo}...`);
      await page.goto(url + pageNo, { waitUntil: "networkidle2" });

      try {
        await page.waitForSelector('a[data-test-id="products"]');
        
        await page.evaluate(async () => {
          const maxHeight = document.body.scrollHeight;
          const scrollStep = 2000;
          
          for (let pos = 0; pos < maxHeight; pos += scrollStep) {
            window.scrollTo(0, pos);
            await new Promise(r => setTimeout(r, 100));
          }
        });
        
        await waitForXTime(1000);
      } catch (err) {
        console.log("No products found");
        break;
      }

      const [products,missing] = await page.evaluate(() => {
        const productElements = document.querySelectorAll('a[data-test-id="products"]');
        const productList = [];
        let missing = 0;

        productElements.forEach((productLink, index) => {
            const img = productLink.querySelector("img");
            const imgSrc = img ? img.src.trim() : null;

            const brandDiv = productLink.querySelector("div.text-pink-500");
            const brandSpan = brandDiv ? brandDiv.querySelector("span") : null;
            const brand = brandSpan ? brandSpan.innerText.trim() : null;

            let title = null;
            const paragraphs = productLink.querySelectorAll("p");
            for (let p of paragraphs) {
              const text = p.innerText.trim();
              if (text && text.length > 10 && !text.startsWith("From") && !text.includes("S$")) {
                title = text;
                break;
              }
            }

            if (title && brand && title.toUpperCase().startsWith(brand.toUpperCase())) {
              title = title.substring(brand.length).trim();
            }

            let price = null;
            const allSpans = productLink.querySelectorAll("span");
            for (let span of allSpans) {
              const text = span.innerText.trim();
              if (text.startsWith("S$") && !text.includes("From")) {
                const classes = span.className || "";
                if (!classes.includes("line-through")) {
                  price = text;
                  break;
                }
              }
            }

            const url = productLink.href.trim() || null;

            let promo = null;
            const wrapper = productLink.parentElement;
            const container = wrapper ? wrapper.parentElement : null;
            if (container) {
              const promoSpan = container.querySelector(".targetdisc");
              if (promoSpan) {
                promo = promoSpan.innerText.trim();
              }
            }

            if (!title || !brand || !price || !imgSrc || !url) {
              missing++;
            }

            if(!title||!brand||!price||!url){}

            else
            productList.push({
              title,
              brand,
              price,
              promo,
              url,
              category: "liquor",
              source: {
                website_base: "https://www.ishopchangi.com",
                location: "changi",
                tag: "domestic",
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: "champagnes",
              img: imgSrc,
            });
          
        });

        return [productList, missing];
      });

      if(missing > 5) {
        await insertScrapingError("More than 5 entries missing for ishopchangi - champagnes: "+pageNo,"scraping_missing");
      }

      allProducts.push(...products);

      if (products.length==0 || pageNo==end) {
        await page.close();
        return allProducts;
      }

      pageNo+=1;
    }
  } catch (err) {
    logError(err);
    try{
      await insertScrapingError("Error in ishopchangi - champagnes: "+err.message,"scraping_trycatch");
    }catch(err){
        console.log(err);
    }
    await page.close();
    return allProducts;
  }
};

module.exports = champagnes;

