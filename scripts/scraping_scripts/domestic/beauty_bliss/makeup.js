const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const makeup = async (start,end,browser)=>{
    let pageNo = start;
    const url = 'https://beautybliss.co.nz/product-category/makeup/?SkipCount=replace_me';
  
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
        await page.goto(url.replace("replace_me",(pageNo==1?0:(28 * (pageNo-1))-1)), { waitUntil: 'networkidle2' });
      
        const [products,missing] = await page.evaluate(() => {
          const productElements = document.querySelectorAll('.card-deck > .card');
          const productList = [];
          let missing = 0;
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('.product-title');
            const brandElement = product.querySelector('.brand');
            const priceElement = product.querySelector('strong');
            // const promoElement = product.querySelectorAll('.amasty-label-container > img');
            const urlElement = product.querySelector('a');
            const imgElement = product.querySelector('a > .secondary > img');
      
            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = brandElement ? brandElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            // const promo = promoElement ? Array.from(promoElement)?.map(promo=>promo.src.trim()) : null;
            const url = urlElement ? urlElement.href.trim() : null;
            const img = imgElement ? imgElement.dataset.src.trim() : null;
      
            if(!title||!brand||!price||!url||!img){missing+=1;}

            if(!title&&!brand&&!price&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo:null, 
              url, 
              category:'beauty',
              source:{website_base:"https://beautybliss.co.nz",location:"new-zealand",tag:"domestic"}, 
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
          await insertScrapingError("More than 5 entries missing for beauty bliss - makeup: "+pageNo,"scraping_missing");
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
          await insertScrapingError("Error in beauty bliss - makeup: "+err.message,"scraping_trycatch");
        }catch(err){
          console.log(err);
        }

        await page.close();
        return allProducts;
      }
}

module.exports = makeup;