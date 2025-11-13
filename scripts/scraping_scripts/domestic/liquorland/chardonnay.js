const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const chardonnay = async (start, end, browser) => {
  let pageNo = start;
  const url = 'https://www.liquorland.co.nz/wine/white/chardonnay?p=';
  
  const page = await browser.newPage();
  const allProducts = [];
  
  try {
    // Set viewport and user agent for headless mode compatibility
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Enable request interception to block unnecessary resources
    await page.setRequestInterception(false);

    while (true) {
      await waitForXTime(constants.timeout);
      await page.goto(url + pageNo + '&s%5Brelevance%5D=desc', { waitUntil: 'networkidle2' });
      
      // Handle modals only on first page (they persist via cookies)
      if (pageNo === start) {
        // Handle age verification modal
        try {
          await page.waitForSelector('.ps-popup.popup-ageGate');
          const yesButton = await page.$('.age-gate-buttons__button[aria-label*="Yes"]');
          if (yesButton) {
            await yesButton.click();
            await waitForXTime(1000);
          }
        } catch (err) {
          // Age gate might not appear
        }
        
        // Handle welcome popup modal (press ESC to close)
        try {
          await page.waitForSelector('.popup-welcome__form');
          await page.keyboard.press('Escape');
          await waitForXTime(500);
        } catch (err) {
          // Welcome popup might not appear
        }
      }
      
      // Set store preference on EVERY page (required to get prices)
      try {
        const storeResult = await page.evaluate(async () => {
          const formdata = new FormData();
          formdata.append("storeid", "37");
          
          const response = await fetch('/api/stores/preferred', {
            method: 'POST',
            headers: {
              'Accept': '*/*',
              'Sec-Fetch-Site': 'same-origin',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Dest': 'empty'
            },
            body: formdata,
            credentials: 'include'
          });
          return { success: response.ok, status: response.status };
        });
        
        if (storeResult.success) {
          // Reload page to ensure prices are loaded with store preference
          await page.reload({ waitUntil: 'networkidle2' });
          
          // Wait for products and prices to appear
          try {
            await page.waitForSelector('.ps-category-item');
            
            // Wait for prices to appear
            let pricesFound = false;
            const maxWaitTime = 10000;
            const checkInterval = 500;
            let elapsedTime = 0;
            
            while (!pricesFound && elapsedTime < maxWaitTime) {
              const priceCount = await page.evaluate(() => {
                return document.querySelectorAll('.s-site-price, .s-price').length;
              });
              
              if (priceCount > 0) {
                pricesFound = true;
                break;
              }
              
              await waitForXTime(checkInterval);
              elapsedTime += checkInterval;
            }
          } catch (err) {
            // Products did not appear
          }
        }
      } catch (err) {
        // Store preference setting failed
      }
      
      // Scroll to load all products (lazy loading)
      await page.evaluate(async () => {
        let lastHeight = document.body.scrollHeight;
        let currentHeight = lastHeight;
        let scrollAttempts = 0;
        const maxScrollAttempts = 10;
        
        do {
          // Scroll to bottom
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise(r => setTimeout(r, 300));
          
          // Check if new content loaded
          currentHeight = document.body.scrollHeight;
          scrollAttempts++;
        } while (currentHeight > lastHeight && scrollAttempts < maxScrollAttempts);
        
        // Final scroll to ensure we're at the bottom
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, 500));
      });
      
      await waitForXTime(1500);
      
      const [products, missing, totalElements] = await page.evaluate(() => {
        const productElements = document.querySelectorAll('.ps-category-item');
        const totalCount = productElements.length;
        const productList = [];
        let missing = 0;
    
        productElements.forEach(product => {
          const titleElement = product.querySelector('.s-product__name');
          const priceElement = product.querySelector('.s-site-price, .s-price');
          const urlElement = product.querySelector('.s-product__name');
          const imgElement = product.querySelector('.s-product-gallery img');
    
          const title = titleElement ? titleElement.innerText.trim() : null;
          const price = priceElement ? priceElement.innerText.trim() : null;
          const url = urlElement ? urlElement.href : null;
          const img = imgElement ? (imgElement.src || imgElement.getAttribute('data-src')) : null;
    
          if (!title || !price || !url || !img) {
            missing += 1;
          }
    
          if (!title || !price || !url) {
          } else {
            productList.push({ 
              title, 
              brand: null, 
              price,
              promo: null, 
              url, 
              category: 'liquor',
              source: { website_base: "https://www.liquorland.co.nz", location: "new-zealand", tag: "domestic" }, 
              date: Date.now(),
              last_check: Date.now(),
              mapping_ref: null,
              unit: undefined,
              subcategory: 'chardonnay',
              img
            });
          }
        });
    
        return [productList, missing, totalCount];
      });
      

      if (missing > 5) {
        await insertScrapingError("More than 5 entries missing for liquorland - chardonnay: " + pageNo, "scraping_missing");
      }

      allProducts.push(...products);

      // Check if we should stop: no products found OR reached the end page
      if (pageNo === end) {
        await page.close();
        return allProducts;
      }
        
      pageNo += 1;
    }

  } catch (err) {
    logError(err);
    try {
      await insertScrapingError("Error in liquorland - chardonnay: " + err.message, "scraping_trycatch");
    } catch (err) {
      console.log(err);
    }
    await page.close();
    return allProducts;
  }
}

module.exports = chardonnay;
