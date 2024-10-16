const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');


const wine = async (start,end,browser)=>{
    let pageNo = start-1;
    const url = "https://www.heinemann.com.au/en/sydt1/wine-sparkling-champagne/c/cat_1100/?q=%3Arelevance&page=";
    const page = await browser.newPage();

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
    
    const allProducts = [];

    while(true){
        await waitForXTime(5000);
        await page.goto(url+pageNo, { waitUntil: 'networkidle2' });

        // Scrape the product details
    const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll('.c-product-card');
       
        // Extracting data from each product element
        const productData = [];
        productElements.forEach(product => {
            const obj = JSON.parse(product?.querySelector("a")?.dataset?.track);
            const title = obj?.name?.toLowerCase()|| null;
            const brand = obj?.brand?.toLowerCase() || null;
            const price = obj?.price?.toLowerCase() || null;
            const url = product?.querySelector("a")?.href || null;
            const img = product?.querySelector("img")?.src || null;
            const promo = [];
            const isMultibuy = product?.querySelector(".c-ribbon")?.innerText == "Multibuy";

            if(!title&&!brand&&!price&&!promo&&!url){}
            else productData.push({ 
            title, 
            brand, 
            price,
            promo, 
            url, 
            category:'liquor',
            source:{website_base:"https://www.heinemann.com.au/en/sydt1/",location:"sydney",tag:"duty-free"}, 
            date:Date.now(),
            last_check:Date.now(),
            mapping_ref:null,
            unit:undefined,
            subcategory:'wine',
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
}

module.exports = wine;