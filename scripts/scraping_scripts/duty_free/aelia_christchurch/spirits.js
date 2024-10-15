const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');

const spirits = async (start,end)=>{
    let pageNo = start;
    const url = 'https://www.aeliadutyfree.co.nz/christchurch/spirits.html?p=';
  
    const browser = await puppeteer.launch({headless:true,  args: ['--no-sandbox', '--disable-setuid-sandbox']});
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
        await page.goto(url+pageNo, { waitUntil: 'networkidle2', timeout:0 });
      
        const products = await page.evaluate(() => {
          // Adjust the selectors according to the page structure
          const productElements = document.querySelectorAll('.product-item');
          const productList = [];
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('.product-item-link');
            const brandElement = product.querySelector('.product-item-brand'); // Adjust if the brand selector is different
            const priceElement = product.querySelector('.price');
            const promoElement = product.querySelectorAll('.amasty-label-container > img');
            const urlElement = product.querySelector('.product-item-info > a');
            const imgElement = product.querySelector('.product-image-wrapper img');
      
            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = brandElement ? brandElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            const promo = promoElement ? Array.from(promoElement)?.map(promo=>promo.src.trim()) : null;
            const url = urlElement ? urlElement.href.trim() : null;
            const img = imgElement ? imgElement.src.trim() : null;
      
            if(!title||!brand||!price||!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo, 
              url, 
              category:'liquor',
              source:{website_base:"https://www.aeliadutyfree.co.nz/christchurch",location:"christchurch",tag:"duty-free"}, 
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
            await browser.close();
            return allProducts;
        }
            
        pageNo+=1;
          
        }
}

module.exports = spirits;