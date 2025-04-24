const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');


const whiskey = async (start,end,browser)=>{
    let pageNo = start;
    const url = "https://www.lottedutyfree.com.au/collections/whiskey?page=";
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
        const productElements = document.querySelectorAll('.sf__col-item');
          const productList = [];
          let missing = 0;
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('h3 > a');
            const brandElement = product.querySelector('.sf__pcard-vendor'); // Adjust if the brand selector is different
            let priceElement = product.querySelector('.f-price__regular-container .f-price-item');
            if(!priceElement) priceElement = product.querySelector('.sf__col-item .f-price-item-discount-sale');
            const promoElement = product.querySelectorAll('.bundle-offers-block');
            const urlElement = product.querySelector('.sf__pcard');
            const imgElement = product.querySelector('.sf__pcard');
            const promo2Element = product.querySelector('.collection_page_coupon_text');
      
            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = brandElement ? brandElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            const promo = promoElement ? Array.from(promoElement)?.map(promo=> promo.querySelector(".bundle-offers-text a").innerText.trim()): null;
            const url = urlElement ? urlElement.dataset.url : null;
            const img = imgElement ? imgElement.dataset.image : null;
            const promo2 = promo2Element ? promo2Element.innerText.trim() : null;
      
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
              source:{website_base:"https://lottedutyfree.com.au/",location:"brisbane",tag:"duty-free"}, 
              date:Date.now(),
              last_check:Date.now(),
              mapping_ref:null,
              unit:undefined,
              subcategory:'whiskey',
              img,
              promo2
            });
          });
        return [productList,missing];
    });

    if(missing > 5) {
      await insertScrapingError("More than 5 entries missing for lotte_brisbane - whiskey: "+pageNo,"scraping_missing");
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
      await insertScrapingError("Error in lotte_brisbane - whiskey: "+err.message,"scraping_trycatch");
    }catch(err){
        console.log(err);
    }
    await page.close();
    return allProducts;
  }
}

module.exports = whiskey;