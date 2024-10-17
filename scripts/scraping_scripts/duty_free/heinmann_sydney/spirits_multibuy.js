const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');


const spiritsMultibuy = async (allProducts)=>{
    const browser = await puppeteer.launch({headless:true,  args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    
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

    for(let i=0;i<allProducts?.length;i++){
        if(!allProducts[i]?.isMultibuy) continue;

        await waitForXTime(constants.timeout);
        await page.goto(allProducts[i]?.url, { waitUntil: 'networkidle2' });
        const product = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".c-promotion-box__list > li"))?.map(text=>text?.innerText);
        });

        allProducts[i].promo = product;
    }

    await page.close();
    await browser.close();
  
    return allProducts;
    }catch(err){
        logError(err);
        await page.close();
        await browser.close();
        return allProducts;
    }
}

module.exports = spiritsMultibuy;