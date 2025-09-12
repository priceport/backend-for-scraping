const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const hair_accesories = async (start,end,browser)=>{
    let pageNo = start;
    const default_url = 'https://www.farmers.co.nz/beauty/hair-care-colour/hair-accessories';
    const url = 'https://www.farmers.co.nz/beauty/hair-care-colour/hair-accessories/Page-replace_me-SortingAttribute-SortBy-asc';
  
    const page = await browser.newPage();
    const allProducts = [];
    
    try{
        // Enable request interception for performance
        await page.setRequestInterception(true);

        // Smart request blocking - allow essential resources
        page.on('request', (req) => {
            const resourceType = req.resourceType();
            const url = req.url();

            // Allow essential resources for proper page loading
            if (resourceType === 'document' || 
                resourceType === 'script' || 
                resourceType === 'xhr' || 
                resourceType === 'fetch' ||
                (resourceType === 'stylesheet' && url.includes('farmers.co.nz')) ||
                (resourceType === 'image' && url.includes('farmers.co.nz'))) {
                req.continue();
            } else {
                req.abort();
            }
        });

        // Set realistic browser settings
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Set extra headers to avoid detection
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });

        while(true){
            await waitForXTime(constants.timeout);
            
            const targetUrl = pageNo==1 ? default_url : url.replace("replace_me", pageNo-1);
            
            try {
                await page.goto(targetUrl, { 
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });
                
                // Wait for dynamic content to load - using setTimeout instead of waitForTimeout
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Wait for product elements to be present
                await page.waitForSelector('.product-list > .product-list-item', { timeout: 10000 });
                
            } catch (gotoError) {
                console.log(`Error loading page ${pageNo}: ${gotoError.message}`);
                throw gotoError;
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
                  subcategory:'hair',
                  img
                });
              });
          
              return [productList,missing];
            });

            if(missing > 5) {
              await insertScrapingError("More than 5 entries missing for farmers - hair_accesories: "+pageNo,"scraping_missing");
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
          await insertScrapingError("Error in farmers - hair_accesories: "+err.message,"scraping_trycatch");
        }catch(err){
            console.log(err);
        }

        await page.close();
        return allProducts;
      }
}

module.exports = hair_accesories;
