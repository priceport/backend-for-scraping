const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');
const handleAgeVerification = require('../../../../helpers/ageVerificationHandler');

const premium_beer = async (start, end, browser) => {
  let pageNo = start;
  const baseUrl = 'https://www.liquorland.co.nz/shop/beer/premium?FF=&InStoreOnly=false&P.StartPage=';
  const urlSuffix = '&P.LoadToPage=&CategoryId=2705&sorting=Suggested&SelectedView=0';
  
  const page = await browser.newPage();
  const allProducts = [];
  
  try {
    // Simple setup like baijiu.js
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      
      // Allow document, script, stylesheet, and XHR/fetch (needed for store selection)
      if (resourceType === 'document' || resourceType === 'script' || resourceType === 'stylesheet' || resourceType === 'xhr' || resourceType === 'fetch') {
        req.continue();
      } 
      // Block images, fonts, and other resources to speed up loading
      else if (resourceType === 'image' || resourceType === 'font' || resourceType === 'media') {
        req.abort();
      }
      // Allow everything else for now to ensure store selection works
      else {
        req.continue();
      }
    });

    console.log('Setting store selection cookies before navigation...');
    try {
      await page.setCookie(
        {
          name: 'lq-store-selection',
          value: '2024',
          domain: '.liquorland.co.nz',
          path: '/'
        }
      );
      console.log('Store selection cookie set: lq-store-selection=2024');
    } catch (cookieErr) {
      console.log('Pre-navigation cookie setting failed:', cookieErr.message);
    }

    while (true) {
      await waitForXTime(constants.timeout);
      
      let fullUrl = baseUrl + pageNo + urlSuffix;
      
      if (pageNo === start) {
        fullUrl += '&storeId=2024';
        console.log(`Adding store parameter to URL for first page`);
      }
      
      console.log(`Navigating to page ${pageNo}...`);
      console.log(`URL: ${fullUrl}`);
      
      await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log(`Successfully loaded page ${pageNo}`);
      
      // Handle age verification and store selection on first page only
      if (pageNo === start) {
        console.log('Handling age verification (first page only)...');
        const ageVerificationSuccess = await handleAgeVerification(page);
        if (!ageVerificationSuccess) {
          console.log('Warning: Age verification might not have been handled properly');
        }
        
        // Verify store selection and try API call if needed
        try {
          console.log('Verifying store selection...');
          
          // Check if prices are already showing (cookie might have worked)
          const initialPriceCheck = await page.evaluate(() => {
            const priceElements = document.querySelectorAll('.current-price, .list-price, [class*="price"]');
            let actualPrices = 0;
            priceElements.forEach(el => {
              const text = el.innerText?.trim();
              if (text && text.includes('$') && !text.includes('Choose')) {
                actualPrices++;
              }
            });
            return actualPrices;
          });
          
          if (initialPriceCheck > 0) {
            console.log('✅ Store selection already working - prices found!');
          } else {
            console.log('⚠️ No prices found, trying API store selection...');
            
            // Try API store selection
            const storeResult = await page.evaluate(async () => {
              try {
                const response = await fetch('/LLStoreInfo/SetStoreId?selectedStoreId=2024&X-Requested-With=XMLHttpRequest', {
                  method: 'GET',
                  headers: { 'X-Requested-With': 'XMLHttpRequest' },
                  credentials: 'include'
                });
                return { success: response.ok, status: response.status };
              } catch (e) {
                return { success: false, error: e.message };
              }
            });
            
            console.log('Store API result:', storeResult);
            
            if (storeResult.success) {
              console.log('Store API successful, reloading page...');
              await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
              await waitForXTime(3000);
            }
          }
          
        } catch (err) {
          console.log('Store verification failed:', err.message);
        }
      } else {
        console.log(`Skipping age verification for page ${pageNo} (only needed on first page)`);
      }
      
      // Verify store selection worked by checking for actual prices (first page only)
      if (pageNo === start) {
        try {
          const priceCheck = await page.evaluate(() => {
            const priceElements = document.querySelectorAll('.current-price, .list-price, [class*="price"]');
            let actualPrices = 0;
            let storeSelectionText = 0;
            
            priceElements.forEach(el => {
              const text = el.innerText?.trim();
              if (text && text.includes('$') && !text.includes('Choose')) {
                actualPrices++;
              } else if (text && text.includes('Choose a store')) {
                storeSelectionText++;
              }
            });
            
            console.log("actual prices", actualPrices);
            console.log("store selection text", storeSelectionText);

            return { actualPrices, storeSelectionText, total: priceElements.length };
          });
          
          console.log(`Store selection verification: ${priceCheck.actualPrices} actual prices, ${priceCheck.storeSelectionText} "Choose store" texts, ${priceCheck.total} total price elements`);
          
          if (priceCheck.actualPrices > 0) {
            console.log('✅ Store selection successful - actual prices found!');
          } else {
            console.log('⚠️ Store selection may not have worked - no actual prices found');
          }
        } catch (err) {
          console.log('Could not verify store selection:', err.message);
        }
      }
      
      const [products, missing] = await page.evaluate(() => {
        const productList = [];
        let missing = 0;

        // Simple product extraction like baijiu.js - use specific selector to avoid duplicates
        const productElements = document.querySelectorAll('.list-item');
        console.log(`Found ${productElements.length} product elements`);

        productElements.forEach((product, index) => {
          try {
            // Extract title - simple approach
            const titleElement = product.querySelector('.list-title-link, .list-title span, h1, h2, h3, h4, h5, h6, [class*="title"], [class*="name"]');
            const title = titleElement ? titleElement.innerText.trim() : null;

            // Extract price - simple approach
            const priceElement = product.querySelector('.current-price, .list-price, [class*="price"]');
            const price = priceElement ? priceElement.innerText.trim() : null;
            
            // Extract URL
            const urlElement = product.querySelector('a[href]');
            const url = urlElement ? urlElement.href : null;
            
            // Extract image
            const imgElement = product.querySelector('img');
            const img = imgElement ? (imgElement.src || imgElement.getAttribute('data-src') || imgElement.getAttribute('data-main-src')) : null;
            
            // Extract brand (if available)
            const brandElement = product.querySelector('[class*="brand"], .brand');
            const brand = brandElement ? brandElement.innerText.trim() : null;

            // Check if required fields are missing
            if (!title || !price || !url) {
              missing += 1;
            }

            // Only add if we have title and price
            if (title && price) {
              console.log(`Product ${index + 1}: ${title} - ${price}`);
              
              productList.push({
                title,
                brand,
                price,
                promo: null,
                url,
                category: 'liquor',
                source: { 
                  website_base: "https://www.liquorland.co.nz", 
                  location: "new-zealand", 
                  tag: "domestic" 
                },
                date: Date.now(),
                last_check: Date.now(),
                mapping_ref: null,
                unit: undefined,
                subcategory: 'premium_beer',
                img
              });
            }
            
          } catch (err) {
            console.log('Error parsing product:', err);
            missing += 1;
          }
        });

        return [productList, missing];
      });

      if (missing > 5) {
        await insertScrapingError("More than 5 entries missing for liquorland - premium_beer: " + pageNo, "scraping_missing");
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
      await insertScrapingError("Error in liquorland - premium_beer: " + err.message, "scraping_trycatch");
    } catch (err) {
      console.log(err);
    }
    await page.close();
    return allProducts;
  }
}

module.exports = premium_beer;

