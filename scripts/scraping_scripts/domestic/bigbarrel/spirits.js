const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const spirits = async (start,end,browser)=>{

    let pageNo = start;
    const url = 'https://bigbarrel.co.nz/en/spirits?pagenumber=replace_me&orderby=5&pagesize=48';
  
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
        await page.goto(url.replace("replace_me",pageNo), {  timeout: 0});

        const [products,missing] = await page.evaluate(() => {
          const productElements = document.querySelectorAll(".item-box");
          const productList = [];
          let missing = 0;
      
          productElements.forEach(product => {
            if(product.querySelector(".product-title > a")?.innerText) {
              const titleElement = product.querySelector('.product-title > a');
              const brandElement = product.querySelector('.product-item-brand');
              const priceElement = product.querySelector('.price');
              // const promoElement = product.querySelectorAll('.amasty-label-container > img');
              const urlElement = product.querySelector('.product-title > a');
              const imgElement = product.querySelector('.picture img');
        
              const title = titleElement ? titleElement.innerText.trim() : null;
              const brand = null;
              const price = priceElement ? priceElement.innerText.trim() : null;
              const promo = null;
              const url = urlElement ? urlElement.href.trim() : null;
              const img = imgElement ? imgElement?.dataset?.lazyloadsrc.trim() : null;
        
              if(!title||!brand||!price||!url||!img){missing+=1;}

              if(!title&&!brand&&!price&&!promo&&!url){}
              else
              productList.push({ 
                title, 
                brand, 
                price,
                promo, 
                url, 
                category:'liquor',
                source:{website_base:"https://bigbarrel.co.nz",location:"new-zealand",tag:"domestic"}, 
                date:Date.now(),
                last_check:Date.now(),
                mapping_ref:null,
                unit:undefined,
                subcategory:'spirits',
                img
              });
            }
          });
          
      
          return [productList,missing];
          
        });

        if(missing > 5) {
          await insertScrapingError("More than 5 entries missing for big barrel - spririts: "+pageNo,"scraping_missing");
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
          await insertScrapingError("Error in big barrel - spirits: "+err.message,"scraping_trycatch");
        }catch(err){
          console.log(err);
        }

        await page.close();
        return allProducts;
      }
}

module.exports = spirits;