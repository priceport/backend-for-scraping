const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');


const spiritsMultibuy = async (allProducts)=>{
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    for(let i=0;i<allProducts?.length;i++){
        if(!allProducts[i]?.isMultibuy) continue;

        await waitForXTime(2000);
        await page.goto(allProducts[i]?.url, { waitUntil: 'networkidle2' });
        const product = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".c-promotion-box__list > li"))?.map(text=>text?.innerText);
        });

        allProducts[i].promo = product;

        console.log(allProducts[i]);
    }

    await page.close();
    await browser.close();
  
    return allProducts;
}

module.exports = spiritsMultibuy;

// (async () => {
//   // Launch the browser
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
  
//   // Navigate to the specified URL
//   await page.goto('https://www.heinemann.com.au/en/sydt1/spirits/c/cat_5000/?q=%3Arelevance&page=1', {
//     waitUntil: 'networkidle2',
//   });

  
//   // Scrape the product details
//   const products = await page.evaluate(() => {
//     const productElements = document.querySelectorAll('.c-product-card');
    
//     console.log(productElements);
//     // Extracting data from each product element
//     const productData = [];
//     productElements.forEach(product => {
//       const obj = JSON.parse(product?.querySelector("a")?.dataset?.track);
//       const title = obj?.name?.toLowerCase()|| null;
//       const brand = obj?.brand?.toLowerCase() || null;
//       const price = obj?.price?.toLowerCase() || null;
//       const url = product?.querySelector("a")?.href || null;
//       const img = product?.querySelector("img")?.src || null;
//       const promo = "";
//     //   const unit = product.querySelector('.amount')?.innerText.trim() || 'N/A';

//     if(!title&&!brand&&!price&&!promo&&!url){}
//     else productData.push({ 
//       title, 
//       brand, 
//       price,
//       promo, 
//       url, 
//       category:'liquor',
//       source:{website_base:"https://www.heinemann.com.au/en/sydt1/",location:"sydney",tag:"duty-free"}, 
//       date:Date.now(),
//       last_check:Date.now(),
//       mapping_ref:null,
//       unit:undefined,
//       subcategory:'spirits',
//       img
//     });
      
//     });
    
//     return productData;
//   });

//   console.log(products);

//   // Close the browser
// //   await browser.close();
// })();
