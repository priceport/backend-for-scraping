const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');
const handleAgeVerification = require('../../../../helpers/ageVerificationHandler');

const energy_sports = async (start, end, browser) => {
  let pageNo = start;
  const baseUrl = 'https://www.liquorland.co.nz/shop/other/non-alcoholic-drinks/energy-sports?FF=&InStoreOnly=false&P.StartPage=';
  const urlSuffix = '&P.LoadToPage=&CategoryId=2705&sorting=Suggested&SelectedView=0';
  
  const page = await browser.newPage();
  const allProducts = [];
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (resourceType === 'document' || resourceType === 'script' || resourceType === 'stylesheet' || resourceType === 'xhr' || resourceType === 'fetch') {
        req.continue();
      } else if (resourceType === 'image' || resourceType === 'font' || resourceType === 'media') {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log('Setting store selection cookies before navigation...');
    try {
      await page.setCookie({
        name: 'lq-store-selection',
        value: '2024',
        domain: '.liquorland.co.nz',
        path: '/'
      });
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
      
      if (pageNo === start) {
        console.log('Handling age verification (first page only)...');
        const ageVerificationSuccess = await handleAgeVerification(page);
        if (!ageVerificationSuccess) {
          console.log('Warning: Age verification might not have been handled properly');
        }
        
        try {
          console.log('Verifying store selection...');
          
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
      }
      
      const [products, missing] = await page.evaluate(() => {
        const productList = [];
        let missing = 0;
        const productElements = document.querySelectorAll('.list-item');
        console.log(`Found ${productElements.length} product elements`);

        productElements.forEach((product, index) => {
          try {
            const titleElement = product.querySelector('.list-title-link, .list-title span, h1, h2, h3, h4, h5, h6, [class*="title"], [class*="name"]');
            const title = titleElement ? titleElement.innerText.trim() : null;
            const priceElement = product.querySelector('.current-price, .list-price, [class*="price"]');
            const price = priceElement ? priceElement.innerText.trim() : null;
            const urlElement = product.querySelector('a[href]');
            const url = urlElement ? urlElement.href : null;
            const imgElement = product.querySelector('img');
            const img = imgElement ? (imgElement.src || imgElement.getAttribute('data-src') || imgElement.getAttribute('data-main-src')) : null;
            const brandElement = product.querySelector('[class*="brand"], .brand');
            const brand = brandElement ? brandElement.innerText.trim() : null;

            if (!title || !price || !url) {
              missing += 1;
            }

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
                subcategory: 'energy_sports',
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
        await insertScrapingError("More than 5 entries missing for liquorland - energy_sports: " + pageNo, "scraping_missing");
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
      await insertScrapingError("Error in liquorland - energy_sports: " + err.message, "scraping_trycatch");
    } catch (err) {
      console.log(err);
    }
    await page.close();
    return allProducts;
  }
}

module.exports = energy_sports;

