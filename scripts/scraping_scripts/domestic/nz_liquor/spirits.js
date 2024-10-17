const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');

const spirits = async (start,end,browser)=>{

    let pageNo = start;
    const url = 'https://nzliquor.online/collections/spirits-liqueurs?page=';
  
    const page = await browser.newPage();
    const allProducts = [];
    
    try{

    // Enable request interception to block unnecessary resources
    // await page.setRequestInterception(true);

    // // Only allow 'document' (HTML) requests
    // page.on('request', (req) => {
    //      const resourceType = req.resourceType();

    //      if (resourceType === 'document') {
    //      req.continue();
    //      } else {
    //      req.abort();  // Block other resources like JS, CSS, images, etc.
    //      }
    // });

    while(true){
        await waitForXTime(constants.timeout);
        await page.goto(url+pageNo, {  timeout: 0});

        const currentPageUrl = page.url();  // Gets the final URL after redirection
        const urlParams = new URL(currentPageUrl).searchParams;
        const loadedPageNo = parseInt(urlParams.get('page'), 10) || 1; 

        let products=[];

        if(loadedPageNo==pageNo)
        products = await page.evaluate(() => {
          const productElements = document.querySelector('#fast-simon-serp-app').shadowRoot.querySelectorAll(".product-card");
          const productList = [];
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('.title');
            const brandElement = product.querySelector('.product-item-brand');
            const priceElement = product.querySelector('.price');
            // const promoElement = product.querySelectorAll('.amasty-label-container > img');
            const urlElement = product.querySelector('.title-container');
            const imgElement = product.querySelector('.image');
      
            const title = titleElement ? titleElement?.innerText?.trim() : null;
            const brand = null;
            const price = priceElement ? priceElement?.innerText?.trim() : null;
            const promo = null;
            const url = urlElement ? urlElement?.href?.trim() : null;
            const img = imgElement ? imgElement?.src?.trim() : null;
      
            if(!title&&!brand&&!price&&!promo&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo, 
              url, 
              category:'liquor',
              source:{website_base:"https://nzliquor.online",location:"new-zealand",tag:"domestic"}, 
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

module.exports = spirits;