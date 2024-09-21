const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');

const spirits = async ()=>{
    let pageNo = 5;
    const url = 'https://laneway.melbourneairport.com.au/liquor.html?p=';
  
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    const allProducts = [];

    while(true){
        await waitForXTime(2000);
        await page.goto(url+pageNo, { waitUntil: 'networkidle2', timeout:0});
      
        const products = await page.evaluate(() => {
          // Adjust the selectors according to the page structure
          const productElements = document.querySelectorAll('.product-item');
          const productList = [];
      
          productElements.forEach(product => {
            const titleElement = product.querySelector('.product-item-link');
            const brandElement = product.querySelector('.product-brand'); // Adjust if the brand selector is different
            const priceElement = product.querySelector('.price');
            const promoElement = product.querySelector('.promot-cart');
            const urlElement = product.querySelector('.product-item-info > a');
            const imgElement = product.querySelector('.product-image-photo');
      
            const title = titleElement ? titleElement.innerText.trim() : null;
            const brand = brandElement ? brandElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.replace("A$","").trim() : null;
            const promo = promoElement ? promoElement.innerText.trim() : null;
            const url = urlElement ? urlElement.href.trim() : null;
            const img = imgElement ? imgElement.dataset.src.trim() : null;
      
            if(!title&&!brand&&!price&&!promo&&!url){}
            else
            productList.push({ 
              title, 
              brand, 
              price,
              promo, 
              url, 
              category:'liquor',
              source:{website_base:"https://laneway.melbourneairport.com.au/liquor.html",location:"melbourne",tag:"duty-free"}, 
              date:Date.now(),
              last_check:Date.now(),
              mapping_ref:null,
              unit:undefined,
              subcategory:'liquor',
              img
            });
          });
      
          return productList;
        });

          if(products?.length==0||pageNo == 7){ 
            await page.close();
            await browser.close();
            console.log("length in scraper:"+allProducts?.length);
            return allProducts;
          }
            
          pageNo+=1;
          allProducts.push(...products);
        }
}

module.exports = spirits;