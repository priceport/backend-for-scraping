const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');

const foot_care = async (start,end,browser)=>{
    let pageNo = start;
    const default_url = 'https://www.farmers.co.nz/beauty/bath-body-care/hand-foot-care';
    const url = 'https://www.farmers.co.nz/beauty/bath-body-care/hand-foot-care/Page-replace_me-SortingAttribute-SortBy-asc';
  
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
        await page.goto(pageNo==1?default_url:url.replace("replace_me",pageNo-1), { waitUntil: 'networkidle2' });
      
        const products = await page.evaluate(() => {
          const productElements = document.querySelectorAll('.product-list > .product-list-item');
          const productList = [];
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('.product-title-span');
            const brandElement = product.querySelector('.css-cfm1ok');
            const priceElement = product.querySelector('.current-price');
            const promoElement = product.querySelector('.basics-promotion-label');
            const urlElement = product.querySelector('.product-image-container > a');
            const imgElement = product.querySelector('.product-image');
      
            // console.log(titleElement.innerText);
            // console.log(brandElement);
            // console.log(priceElement);
            // console.log(urlElement);
            // console.log(imgElement);

            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = brandElement ? brandElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            const promo = promoElement ? promoElement?.innerText?.trim() : null;
            const url = urlElement ? urlElement.href.trim() : null;
            const img = imgElement ? imgElement.src.trim() : null;
      
            if(!title&&!brand&&!price&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo, 
              url, 
              category:'beauty',
              source:{website_base:"https://www.farmers.co.nz",location:"new-zealand",tag:"domestic"}, 
              date:Date.now(),
              last_check:Date.now(),
              mapping_ref:null,
              unit:undefined,
              subcategory:'bath',
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
}

module.exports = foot_care;