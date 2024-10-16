const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');

const special = async (start,end,browser)=>{

    let pageNo = start;
    const url = 'https://bigbarrel.co.nz/en/special?pagenumber=replace_me&orderby=5&pagesize=48';
  
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
        await waitForXTime(2000);
        await page.goto(url.replace("replace_me",pageNo), {  timeout: 0});

        const products = await page.evaluate(() => {
          const productElements = document.querySelectorAll(".item-box");
          const productList = [];
      
          productElements.forEach(product => {
            if(product.querySelector(".product-title > a")?.innerText) {
              const titleElement = product.querySelector('.product-title > a');
              const brandElement = product.querySelector('.product-item-brand');
              let priceElement = product.querySelector('.price');
              // const promoElement = product.querySelectorAll('.amasty-label-container > img');
              const urlElement = product.querySelector('.product-title > a');
              const imgElement = product.querySelector('.picture img');
        
              if(priceElement.innerText.includes("Mates Club")) priceElement = product.querySelector(".non-member-price");

              const title = titleElement ? titleElement.innerText.trim() : null;
              const brand = null;
              const price = priceElement ? priceElement.innerText.replace("Special: ","").replace("Non-Members: ","").replace("From ","").trim() : null;
              const promo = null;
              const url = urlElement ? urlElement.href.trim() : null;
              const img = imgElement ? imgElement?.dataset?.lazyloadsrc.trim() : null;

              if(!title&&!brand&&!price&&!promo&&!url){}
              else
              productList.push({ 
                title, 
                brand, 
                price,
                promo, 
                url, 
                category:'undefined',
                source:{website_base:"https://bigbarrel.co.nz",location:"new-zealand",tag:"domestic"}, 
                date:Date.now(),
                last_check:Date.now(),
                mapping_ref:null,
                unit:undefined,
                subcategory:'',
                img
              });
            }
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
}

module.exports = special;