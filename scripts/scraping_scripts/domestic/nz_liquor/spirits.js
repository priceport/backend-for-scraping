const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const spirits = async (start,end,browser)=>{

    let pageNo = start;
    const url = 'https://nzliquor.online/collections/spirits-liqueurs?page=';
  
    const page = await browser.newPage();
    const allProducts = [];
    
    try{

    // Enable request interception to block unnecessary resources
    // await page.setRequestInterception(true);

    // // Only allow 'document' (HTML) requests
    // page.on('request', (req) => {
    //      const resourceType = req.resourceType();

    //      if (resourceType === 'document') {
    //      req.continue();
    //      } else {
    //      req.abort();  // Block other resources like JS, CSS, images, etc.
    //      }
    // });

    while(true){
        await waitForXTime(constants.timeout);
        await page.goto(url+pageNo, {  timeout: 0});

        const currentPageUrl = page.url();  // Gets the final URL after redirection
        const urlParams = new URL(currentPageUrl).searchParams;
        const loadedPageNo = parseInt(urlParams.get('page'), 10) || 1; 

        let products=[],missing = 0;

        if(loadedPageNo==pageNo)
        [products,missing] = await page.evaluate(() => {
          const productElements = document.querySelectorAll('#product_listing__sorted .product_item');
          const productList = [];
          let missing = 0;
      
          productElements.forEach(product => {
            const titleAnchor = product.querySelector('.product_info .product_name a');
            const priceElement = product.querySelector('.product_info .product_prop .product_price .money:last-of-type .langwill-money')
              || product.querySelector('.product_info .product_prop .product_price .money .langwill-money')
              || product.querySelector('.product_info .product_prop .product_price .money:last-of-type')
              || product.querySelector('.product_info .product_prop .product_price .money');
            const imgElement = product.querySelector('.product_img img');
      
            const title = titleAnchor ? titleAnchor?.innerText?.trim() : null;
            const brand = null;
            let price = priceElement ? priceElement?.innerText?.trim() : null;
            const promo = null;
            const url = titleAnchor ? titleAnchor?.href?.trim() : null;
            let img = imgElement ? imgElement?.src?.trim() : null;

            if (img && img.startsWith('//')) {
              img = `https:${img}`;
            }

            // Normalize price for downstream processing (expects "NZ$")
            if (price) {
              price = price.replace(/\s+/g, ' ').trim();
              if (price.startsWith('$') && !price.startsWith('NZ$')) {
                price = `NZ${price}`; // "$49.99" -> "NZ$49.99"
              }
            }
      
            if(!title||!price||!url||!img){missing+=1;}

            if(!title&&!brand&&!price&&!promo&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo, 
              url, 
              category:'liquor',
              source:{website_base:"https://nzliquor.online",location:"new-zealand",tag:"domestic"}, 
              date:Date.now(),
              last_check:Date.now(),
              mapping_ref:null,
              unit:undefined,
              subcategory:'spirits',
              img
            });
          });
      
          return [productList,missing];
        });

        if(missing > 5) {
          await insertScrapingError("More than 5 entries missing for nz_liquor - spirits: "+pageNo,"scraping_missing");
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
          await insertScrapingError("Error in nz_liquor - spirits: "+err.message,"scraping_trycatch");
        }catch(err){
            console.log(err);
        }
        await page.close();
        return allProducts;
      }
}

module.exports = spirits;