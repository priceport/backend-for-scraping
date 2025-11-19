const puppeteer = require("puppeteer");
const waitForXTime = require("../../../../helpers/waitForXTime");
const constants = require("../../../../helpers/constants");
const logError = require("../../../../helpers/logError");
const { insertScrapingError } = require("../../../../helpers/insertScrapingErrors");

const mens_fashion_accessories = async (start, end, browser) => {
  let pageNo = start;
  const url = "https://www.ishopchangi.com/en/category/mens-fashion/mens-fashion-accessories?page=";
  const page = await browser.newPage();
  const allProducts = [];

  try {
    await page.setRequestInterception(false);

    while (true) {
      console.log(`[Men's Fashion Accessories] Loading page ${pageNo}...`);
      await page.goto(url + pageNo, { waitUntil: "networkidle2" });

      // Wait and check for products
      let hasProducts = false;
      try {
        await page.waitForSelector('a[data-test-id="products"]', { timeout: 5000 });
        hasProducts = true;
        
        // Scroll to trigger lazy loading
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
        console.log("No products found on page " + pageNo);
        await page.close();
        return allProducts;
      }

      if (!hasProducts) {
        await page.close();
        return allProducts;
      }

      const [products,missing] = await page.evaluate(() => {
        const productElements = document.querySelectorAll('a[data-test-id="products"]');
        const productList = [];
        let missing = 0;

        productElements.forEach((productLink, index) => {
            // Image
            const img = productLink.querySelector("img");
            const imgSrc = img ? img.src.trim() : null;

            // Brand - span inside the pink div
            const brandDiv = productLink.querySelector("div.text-pink-500");
            const brandSpan = brandDiv ? brandDiv.querySelector("span") : null;
            const brand = brandSpan ? brandSpan.innerText.trim() : null;

            // Title - find p tag with actual product title (longer text, not "From")
            let title = null;
            const paragraphs = productLink.querySelectorAll("p");
            for (let p of paragraphs) {
              const text = p.innerText.trim();
              if (text && text.length > 10 && !text.startsWith("From") && !text.includes("S$")) {
                title = text;
                break;
              }
            }

            // Remove brand name from title
            if (title && brand && title.toUpperCase().startsWith(brand.toUpperCase())) {
              title = title.substring(brand.length).trim();
            }

            // Price - find span with S$ (not "From", not line-through)
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

            // URL
            const url = productLink.href.trim() || null;

            // Promo
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
              category: "fashion",
              source: {
                website_base: "https://www.ishopchangi.com",
                location: "singapore",
                tag: "duty-free",
              },
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: "mens_fashion_accessories",
              img: imgSrc,
            });
          
        });

        return [productList, missing];
      });

      if(missing > 5) {
        await insertScrapingError("More than 5 entries missing for ishopchangi - mens_fashion_accessories: "+pageNo,"scraping_missing");
      }

      // Check if products is valid array before pushing
      if (!products || !Array.isArray(products) || products.length === 0) {
        console.log("No products found on page " + pageNo + ", stopping pagination");
        await page.close();
        return allProducts;
      }

      allProducts.push(...products);

      if (pageNo == end) {
        await page.close();
        return allProducts;
      }

      pageNo+=1;
    }
  } catch (err) {
    logError(err);
    try{
      await insertScrapingError("Error in ishopchangi - mens_fashion_accessories: "+err.message,"scraping_trycatch");
    }catch(err){
        console.log(err);
    }
    await page.close();
    return allProducts;
  }
};

module.exports = mens_fashion_accessories;

