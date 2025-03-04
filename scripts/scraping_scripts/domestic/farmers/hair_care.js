const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const hair_care = async (start,end,browser)=>{
    let pageNo = start;
    const default_url = 'https://www.farmers.co.nz/beauty/hair-care-colour/hair-care-brushes';
    const url = 'https://www.farmers.co.nz/beauty/hair-care-colour/hair-care-brushes/Page-replace_me-SortingAttribute-SortBy-asc';
  
    const page = await browser.newPage();
    const allProducts = [];
    
    try{

    // Enable request interception to block unnecessary resources
    await page.setRequestInterception(true);

    // Only allow 'document' (HTML) requests
    page.on('request', (req) => {
         const resourceType = req.resourceType();

         if (resourceType === 'document') {
         req.continue();
         } else {
         req.abort();  // Block other resources like JS, CSS, images, etc.
         }
    });

    while(true){
        await waitForXTime(constants.timeout);
        await page.goto(pageNo==1?default_url:url.replace("replace_me",pageNo-1), { waitUntil: 'networkidle2' });
      
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
      
            // console.log(titleElement.innerText);
            // console.log(brandElement);
            // console.log(priceElement);
            // console.log(urlElement);
            // console.log(imgElement);

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
          await insertScrapingError("More than 5 entries missing for farmers - hair_care: "+pageNo,"scraping_missing");
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
          await insertScrapingError("Error in farmers - hair_care: "+err.message,"scraping_trycatch");
        }catch(err){
            console.log(err);
        }

        await page.close();
        return allProducts;
      }
}

module.exports = hair_care;