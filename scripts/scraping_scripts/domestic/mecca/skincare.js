const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');

const skincare = async (start,end)=>{
    let pageNo = start;
    const url = 'https://www.mecca.com/en-nz/skincare/?page=';
  
    const browser = await puppeteer.launch({headless:true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
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
        await page.goto(url+pageNo, { waitUntil: 'networkidle2' });
      
        const products = await page.evaluate(() => {
          const productElements = document.querySelectorAll('.css-17b0w3j > .css-yy6ajo');
          const productList = [];
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('.css-mijcyd');
            const brandElement = product.querySelector('.css-cfm1ok');
            const priceElement = product.querySelector('.css-15zvubz');
            // const promoElement = product.querySelectorAll('.amasty-label-container > img');
            const urlElement = product.querySelector('.css-mijcyd');
            const imgElement = product.querySelector('.css-1llogg1 img');
      
            // console.log(titleElement.innerText);
            // console.log(brandElement);
            // console.log(priceElement);
            // console.log(urlElement);
            // console.log(imgElement);

            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = brandElement ? brandElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            // const promo = promoElement ? Array.from(promoElement)?.map(promo=>promo.src.trim()) : null;
            const url = urlElement ? urlElement.href.trim() : null;
            const img = imgElement ? imgElement.src.trim() : null;
      
            if(!title&&!brand&&!price&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo:null, 
              url, 
              category:'beauty',
              source:{website_base:"https://www.mecca.com/en-nz",location:"new-zealand",tag:"domestic"}, 
              date:Date.now(),
              last_check:Date.now(),
              mapping_ref:null,
              unit:undefined,
              subcategory:'skincare',
              img
            });
          });
      
          return productList;
        });

        allProducts.push(...products);

          if(products?.length==0||pageNo==end){ 
            await page.close();
            await browser.close();
            return allProducts;
          }
            
          pageNo+=1;
        }
}

module.exports = skincare;