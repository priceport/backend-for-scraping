const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');

const wine = async ()=>{

    console.log("in wine");
    let pageNo = 1;
    const url = 'https://www.aeliadutyfree.co.nz/auckland/wine.html?p=';
  
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    console.log("page opened");
    const allProducts = [];


    while(true){
        await waitForXTime(2000);
        await page.goto(url+pageNo, { waitUntil: 'networkidle2' });
      
        const products = await page.evaluate(() => {
          // Adjust the selectors according to the page structure
          const productElements = document.querySelectorAll('.product-item');
          const productList = [];
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('.product-item-link');
            const brandElement = product.querySelector('.product-item-brand'); // Adjust if the brand selector is different
            const priceElement = product.querySelector('.price');
            const promoElement = product.querySelector('.amasty-label-container > img');
            const urlElement = product.querySelector('.product-item-info > a');
            const imgElement = product.querySelector('.product-image-wrapper img');
      
            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = brandElement ? brandElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.trim() : null;
            const promo = promoElement ? promoElement.src.trim() : null;
            const url = urlElement ? urlElement.href.trim() : null;
            const img = imgElement ? imgElement.src.trim() : null;
      
            if(!title&&!brand&&!price&&!promo&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo, 
              url, 
              category:'liquor',
              source:{website_base:"https://www.aeliadutyfree.co.nz/auckland",location:"auckland",tag:"duty-free"}, 
              date:Date.now(),
              last_check:Date.now(),
              mapping_ref:null,
              unit:undefined,
              subcategory:'wine',
              img
            });
          });
      
          return productList;
        });

          if(products?.length==0){ 
            await page.close();
            await browser.close();
            console.log("length in scraper:"+allProducts?.length);
            return allProducts;
          }
            
          pageNo+=1;
          allProducts.push(...products);
        }
}

module.exports = wine;