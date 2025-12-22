const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');
const logError = require('../../../../helpers/logError');

puppeteer.use(StealthPlugin());

const skincare = async (start,end)=>{
    let pageNo = start;
    const url = 'https://www.sephora.nz/categories/skincare?page=replace_me&view=120';
  
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
            const priceContainer = product.querySelector('.prices');
            const priceElement = product.querySelector('.sell-price');
            const originalPriceElement = product.querySelector('.original-price');
            const saleTextElement = product.querySelector('.sale-text');
            const urlElement = product.querySelector('.product-card-image-link');
            const imgElement = product.querySelector('.product-card-image');
      
            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = brandElement ? brandElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            let url = urlElement ? urlElement.href.trim() : null;
            // Ensure URL is absolute
            if (url && !url.startsWith('http')) {
              url = 'https://www.sephora.nz' + url;
            }
            let img = imgElement ? imgElement.src.trim() : null;
            // Ensure image URL is absolute
            if (img && !img.startsWith('http')) {
              img = 'https://www.sephora.nz' + img;
            }

            // Extract promo information
            let promo = null;
            if (priceContainer && originalPriceElement && saleTextElement) {
              const originalPrice = originalPriceElement.innerText.trim();
              const saleText = saleTextElement.innerText.trim();
              const sellPrice = priceElement ? priceElement.innerText.trim() : originalPrice;
              
              // Create promo object if there's a sale
              if (originalPrice && sellPrice && originalPrice !== sellPrice && saleText) {
                // Extract numeric values from prices
                const originalPriceNum = parseFloat(originalPrice.replace(/[^0-9.]/g, ''));
                const sellPriceNum = parseFloat(sellPrice.replace(/[^0-9.]/g, ''));
                
                if (!isNaN(originalPriceNum) && !isNaN(sellPriceNum)) {
                  promo = [{
                    text: saleText,
                    price: sellPriceNum // Use the sale price for promo
                  }];
                }
              }
            }
      
            if(!title||!brand||!price||!url||!img){missing+=1;}

            if(!title&&!brand&&!price&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo: promo, 
              url, 
              category:'beauty',
              source:{website_base:"https://www.sephora.nz",location:"new-zealand",tag:"domestic"}, 
              date:Date.now(),
              last_check:Date.now(),
              mapping_ref:null,
              unit:undefined,
              subcategory:'skincare',
              img
            });
          });
      
          return [productList,missing];
        });

        if(missing > 5) {
          await insertScrapingError("More than 5 entries missing for sephora - skincare: "+pageNo,"scraping_missing");
        }

        products.forEach(product=>{
          console.log({promo: product.promo, title: product.title});
        });

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
          await insertScrapingError("Error in sephora - skincare: "+err.message,"scraping_trycatch");
        }catch(err){
            console.log(err);
        }
        await page.close();
        await browser.close();
        return allProducts;
      }
}

module.exports = skincare;