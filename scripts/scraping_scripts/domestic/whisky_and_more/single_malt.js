const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');

const single_malt = async (start,end,browser)=>{

    let pageNo = start;
    const url = 'https://www.whiskyandmore.co.nz/collections/single-malt-whisky-for-sale?page=';
  
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
        await page.goto(url+pageNo, {  timeout: 0});

        const products = await page.evaluate(() => {
          const productElements = document.querySelectorAll('.product_item');
          const productList = [];
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('.name_ a');
            const brandElement = product.querySelector('.product-item-brand');
            const priceElement = product.querySelector('.price_nomarl span');
            // const promoElement = product.querySelectorAll('.amasty-label-container > img');
            const urlElement = product.querySelector('.img--thum a');
            const imgElement = product.querySelector('.img--thum img');
      
            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            const promo = null;
            const url = urlElement ? urlElement.href.trim() : null;
            const img = imgElement ? imgElement.src.trim() : null;
      
            if(!title&&!brand&&!price&&!promo&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo, 
              url, 
              category:'liquor',
              source:{website_base:"https://www.whiskyandmore.co.nz",location:"new-zealand",tag:"domestic"}, 
              date:Date.now(),
              last_check:Date.now(),
              mapping_ref:null,
              unit:undefined,
              subcategory:'spirits',
              img
            });
          });
      
          return productList;
        });

        allProducts.push(...products);

          if(products?.length==0||pageNo==end){ 
            await page.close();
            return allProducts;
          }
            
          pageNo+=1;
        }

      }catch(err){
        logError(err);
        await page.close();
        return allProducts;
    }
}

module.exports = single_malt;