const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

puppeteer.use(StealthPlugin());

const hair = async (start,end)=>{
    let pageNo = start;
    const url = 'https://www.sephora.nz/categories/hair?page=replace_me&view=120';
  
    const browser = await puppeteer.launch({headless:true,args:  ['--disable-http2','--no-sandbox', '--disable-setuid-sandbox']});
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
        await page.goto(url.replace("replace_me",pageNo), { waitUntil: 'networkidle2' });
      
        const [products,missing] = await page.evaluate(() => {
          const productElements = document.querySelectorAll('.products-grid-container > .products-card-container');
          const productList = [];
          let missing = 0;
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('.product-name');
            const brandElement = product.querySelector('.brand');
            const priceElement = product.querySelector('.sell-price');
            // const promoElement = product.querySelectorAll('.amasty-label-container > img');
            const urlElement = product.querySelector('.product-card-image-link');
            const imgElement = product.querySelector('.product-card-image');
      
            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = brandElement ? brandElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            // const promo = promoElement ? Array.from(promoElement)?.map(promo=>promo.src.trim()) : null;
            const url = urlElement ? urlElement.href.trim() : null;
            const img = imgElement ? imgElement.src.trim() : null;
      
            if(!title||!brand||!price||!url||!img){missing+=1;}

            if(!title&&!brand&&!price&&!promo&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo:null, 
              url, 
              category:'beauty',
              source:{website_base:"https://www.sephora.nz",location:"new-zealand",tag:"domestic"}, 
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
          await insertScrapingError("More than 5 entries missing for sephora - hair: "+pageNo,"scraping_missing");
        }

        allProducts.push(...products);

          if(products?.length==0||pageNo==end){ 
            await page.close();
            await browser.close();
            return allProducts;
          }
            
          pageNo+=1;
        }
      }catch(err){
        logError(err);
        try{
          await insertScrapingError("Error in sephora - hair: "+err.message,"scraping_trycatch");
        }catch(err){
            console.log(err);
        }
        await page.close();
        await browser.close();
        return allProducts;
      }
}

module.exports = hair;