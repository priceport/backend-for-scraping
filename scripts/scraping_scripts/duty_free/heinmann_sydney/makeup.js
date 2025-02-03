const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');


const makeup = async (start,end,browser)=>{
    let pageNo = start-1;
    const url = "https://www.heinemann.com.au/en/sydt1/make-up/c/cat_3000/?q=%3Arelevance&page=";
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
        await page.goto(url+pageNo, { waitUntil: 'networkidle2' });

        // Scrape the product details
        const products = await page.evaluate(() => {
            const productElements = document.querySelectorAll('.c-product-card');
            
            // Extracting data from each product element
            const productData = [];
            productElements.forEach(product => {
                const obj = JSON.parse(product?.querySelector("a script").innerText);
                const title = obj?.name?.toLowerCase()|| null;
                const brand = obj?.brand?.toLowerCase() || null;
                const price = obj?.price?.toLowerCase() || null;
                const url = product?.querySelector("a")?.href || null;
                const img = product?.querySelector("img")?.src || null;
                const promo = [];
                const isMultibuy = product?.querySelector(".c-ribbon")?.innerText == "Multibuy";
                //   const unit = product.querySelector('.amount')?.innerText.trim() || 'N/A';

                if(!title&&!brand&&!price&&!promo&&!url){}
                else productData.push({ 
                title, 
                brand, 
                price,
                promo, 
                url, 
                category:'beauty',
                source:{website_base:"https://www.heinemann.com.au/en/sydt1/",location:"sydney",tag:"duty-free"}, 
                date:Date.now(),
                last_check:Date.now(),
                mapping_ref:null,
                unit:undefined,
                subcategory:'makeup',
                img,
                isMultibuy
                });
            
            });
            return productData;
        });
        allProducts.push(...products);

        if(products?.length==0||pageNo==(end-1)){ 
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

module.exports = makeup;