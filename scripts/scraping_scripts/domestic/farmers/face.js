const puppeteer = require('puppeteer-extra');
const ProxyPlugin = require('puppeteer-extra-plugin-proxy');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

// Configure webshare.io proxy for Farmers scraping
const proxyServer = '142.111.48.253:7030';
const proxyUsername = 'ftjgwyap';
const proxyPassword = '17xe9se18188';

// Setup webshare proxy plugin
console.log("Using webshare.io proxy for Farmers face scraping");
puppeteer.use(ProxyPlugin({
    address: proxyServer.split(':')[0],
    port: parseInt(proxyServer.split(':')[1]),
    credentials: {
        username: proxyUsername,
        password: proxyPassword
    }
}));

const face = async (start,end,browser)=>{
    let pageNo = start;
    const default_url = 'https://www.farmers.co.nz/beauty/makeup/face';
    const url = 'https://www.farmers.co.nz/beauty/makeup/face/Page-replace_me-SortingAttribute-SortBy-asc';
  
    const page = await browser.newPage();
    const allProducts = [];
    
    try{
        // Enable request interception for performance
        await page.setRequestInterception(false);

        // Smart request blocking - allow essential resources
        
        // Set realistic browser settings
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Remove webdriver property to avoid detection (important for headless mode)
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
            // Override plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
            // Override languages
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });
        });
        
        // Set extra headers to avoid detection
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        });

        while(true){
            await waitForXTime(constants.timeout);
            
            const targetUrl = pageNo==1 ? default_url : url.replace("replace_me", pageNo-1);
            
            try {
                await page.goto(targetUrl, { 
                    waitUntil: 'domcontentloaded',
                    timeout: 60000 // Increased timeout for proxy
                });
                
                // Wait for page to be interactive
                await waitForXTime(3000);
                
                // Wait for page to be fully loaded
                try {
                    await page.waitForFunction(() => {
                        return document.readyState === 'complete';
                    }, { timeout: 15000 });
                } catch (e) {
                    console.log("Page readyState check timeout, continuing...");
                }
                
                // Additional wait for JavaScript to execute and AJAX requests to complete
                await waitForXTime(5000);
                
                // Scroll to trigger lazy loading and ensure content is rendered
                try {
                    // Scroll down gradually
                    for (let i = 0; i < 3; i++) {
                        await page.evaluate(() => {
                            window.scrollBy(0, window.innerHeight);
                        });
                        await waitForXTime(1000);
                    }
                    // Scroll to bottom
                    await page.evaluate(() => {
                        window.scrollTo(0, document.body.scrollHeight);
                    });
                    await waitForXTime(2000);
                    // Scroll back to top
                    await page.evaluate(() => {
                        window.scrollTo(0, 0);
                    });
                    await waitForXTime(2000);
                } catch (scrollError) {
                    console.log("Scroll error (non-critical):", scrollError.message);
                }
                
                // Take screenshot for debugging
                try {
                    await Promise.race([
                        page.screenshot({ 
                            path: `farmers_face_page_${pageNo}_debug.png`, 
                            fullPage: false 
                        }),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Screenshot timeout')), 5000))
                    ]);
                    console.log(`Screenshot saved: farmers_face_page_${pageNo}_debug.png`);
                } catch (screenshotError) {
                    console.log(`Screenshot failed (non-critical): ${screenshotError.message}`);
                }
                
                // Try multiple selectors and wait strategies
                let productsFound = false;
                
                // Strategy 1: Wait for the main product list container
                try {
                    await page.waitForSelector('.product-list', { timeout: 15000 });
                    console.log("Product list container found");
                } catch (e) {
                    console.log("Product list container not found, trying alternative...");
                }
                
                // Strategy 2: Wait for any product items with multiple selectors and wait strategies
                let retryCount = 0;
                const maxRetries = 3;
                
                while (!productsFound && retryCount < maxRetries) {
                    try {
                        // Try multiple approaches in parallel
                        await Promise.race([
                            page.waitForSelector('.product-list > .product-list-item', { timeout: 20000 }),
                            page.waitForSelector('.product-list-item', { timeout: 20000 }),
                            page.waitForFunction(() => {
                                const items = document.querySelectorAll('.product-list > .product-list-item, .product-list-item');
                                return items.length > 0;
                            }, { timeout: 20000 }),
                            page.waitForFunction(() => {
                                // Check if products are loading
                                const container = document.querySelector('.product-list');
                                if (!container) return false;
                                // Check for any child elements that might be products
                                return container.children.length > 0;
                            }, { timeout: 20000 })
                        ]);
                        productsFound = true;
                        console.log("Product items found");
                        break;
                    } catch (selectorError) {
                        retryCount++;
                        console.log(`Product items not found (attempt ${retryCount}/${maxRetries}), checking page content...`);
                        
                        // Debug: Check what's actually on the page
                        const pageInfo = await page.evaluate(() => {
                            const productList = document.querySelector('.product-list');
                            return {
                                hasProductList: !!productList,
                                productListChildren: productList ? productList.children.length : 0,
                                productListItems: document.querySelectorAll('.product-list > .product-list-item').length,
                                allProductItems: document.querySelectorAll('.product-list-item').length,
                                allListItems: document.querySelectorAll('li').length,
                                bodyText: document.body.innerText.substring(0, 300),
                                url: window.location.href,
                                readyState: document.readyState
                            };
                        });
                        console.log("Page debug info:", JSON.stringify(pageInfo, null, 2));
                        
                        if (retryCount < maxRetries) {
                            // Wait longer and scroll again
                            console.log(`Waiting ${3000 * retryCount}ms before retry...`);
                            await waitForXTime(3000 * retryCount);
                            
                            // Scroll again to trigger loading
                            try {
                                await page.evaluate(() => {
                                    window.scrollTo(0, document.body.scrollHeight);
                                });
                                await waitForXTime(2000);
                                await page.evaluate(() => {
                                    window.scrollTo(0, 0);
                                });
                                await waitForXTime(1000);
                            } catch (e) {}
                        } else {
                            // Final attempt - check if container exists
                            if (pageInfo.hasProductList && pageInfo.productListChildren > 0) {
                                console.log("Product list container exists with children, continuing anyway...");
                                productsFound = true; // Assume products are there even if selector doesn't match
                                break;
                            } else {
                                throw new Error(`Products not found after ${maxRetries} attempts. Container: ${pageInfo.hasProductList}, Children: ${pageInfo.productListChildren}, Items: ${pageInfo.productListItems}`);
                            }
                        }
                    }
                }
                
            } catch (gotoError) {
                console.log(`Error loading page ${pageNo}: ${gotoError.message}`);
                
                // Take error screenshot for debugging
                try {
                    await Promise.race([
                        page.screenshot({ 
                            path: `farmers_face_page_${pageNo}_error.png`, 
                            fullPage: false 
                        }),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Screenshot timeout')), 5000))
                    ]);
                    console.log(`Error screenshot saved: farmers_face_page_${pageNo}_error.png`);
                } catch (screenshotError) {
                    console.log(`Error screenshot failed: ${screenshotError.message}`);
                }
                
                throw gotoError;
            }

            // Take screenshot after successful load
            try {
                await Promise.race([
                    page.screenshot({ 
                        path: `farmers_face_page_${pageNo}_success.png`, 
                        fullPage: false 
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Screenshot timeout')), 5000))
                ]);
            } catch (screenshotError) {
                // Ignore screenshot errors
            }
            
            const [products,missing] = await page.evaluate(() => {
              const productElements = document.querySelectorAll('.product-list > .product-list-item');
              const productList = [];
              let missing = 0;
          
              productElements.forEach(product => {
                const titleElement = product.querySelector('.product-title-span');
                const brandElement = product.querySelector('.css-cfm1ok');
                const priceElement = product.querySelector('.current-price');
                const promoElement = product.querySelector('.basics-promotion-label');
                const urlElement = product.querySelector('.product-image-container > a');
                const imgElement = product.querySelector('.product-image');
          
                const title = titleElement ? titleElement.innerText.trim() : null;
                const brand = brandElement ? brandElement.innerText.trim() : null;
                const price = priceElement ? priceElement.innerText.trim() : null;
                const promo = promoElement ? promoElement?.innerText?.trim() : null;
                const url = urlElement ? urlElement.href.trim() : null;
                const img = imgElement ? imgElement.src.trim() : null;
          
                if(!title||!brand||!price||!url||!img){missing+=1;}

                if(!title&&!brand&&!price&&!url){}
                else
                productList.push({ 
                  title, 
                  brand, 
                  price,
                  promo, 
                  url, 
                  category:'beauty',
                  source:{website_base:"https://www.farmers.co.nz",location:"new-zealand",tag:"domestic"}, 
                  date:Date.now(),
                  last_check:Date.now(),
                  mapping_ref:null,
                  unit:undefined,
                  subcategory:'makeup',
                  img
                });
              });
          
              return [productList,missing];
            });

            if(missing > 5) {
              await insertScrapingError("More than 5 entries missing for farmers - face: "+pageNo,"scraping_missing");
            }

            allProducts.push(...products);

              if(products?.length==0||pageNo==end){ 
                await page.close();
                return allProducts;
              }
                
              pageNo+=1;
            }

      }catch(err){
        logError(err);

        try{
          await insertScrapingError("Error in farmers - face: "+err.message,"scraping_trycatch");
        }catch(err){
            console.log(err);
        }

        await page.close();
        return allProducts;
      }
}

module.exports = face;
