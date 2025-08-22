const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');


const accessories = async (start,end,browser)=>{
    let pageNo = start-1;
    const url = "https://www.heinemann.com.au/en/sydt1/products/make-up/accessories/c/auscat_3052/?q=%3Arelevance&page=";
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
        const [products,missing] = await page.evaluate(() => {
            const productElements = document.querySelectorAll('.c-product-card');
            let missing = 0;
            
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

                if(!title||!brand||!price||!url||!img){missing+=1;}

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
                subcategory:'accessories',
                img,
                isMultibuy
                });
            
            });
            return [productData,missing];
        });
        if(missing > 5) {
            await insertScrapingError("More than 5 entries missing for heinemann_sydney - accessories: "+pageNo,"scraping_missing");
        }

        allProducts.push(...products);

        if(products?.length==0||pageNo==(end-1)){ 
            await page.close();
            return allProducts;
        }
            
        pageNo+=1;
        }
        }catch(err){
            logError(err);
            try{
                await insertScrapingError("Error in heinemann_sydney - accessories: "+err.message,"scraping_trycatch");
              }catch(err){
                  console.log(err);
              }
            await page.close();
            return allProducts;
        }
}

module.exports = accessories;