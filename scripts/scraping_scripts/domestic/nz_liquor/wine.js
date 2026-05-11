const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const wine = async (start,end,browser)=>{

    let pageNo = start;
    const url = 'https://nzliquor.online/collections/wine?page=';
  
    const page = await browser.newPage();
    const allProducts = [];
    
    try{

    while(true){
        await waitForXTime(constants.timeout);
        await page.goto(url+pageNo, { waitUntil: 'networkidle2', timeout: 60000 });

        await page.waitForSelector('#product-grid .grid__item', { visible: true, timeout: 30000 });

        const currentPageUrl = page.url();
        const urlParams = new URL(currentPageUrl).searchParams;
        const loadedPageNo = parseInt(urlParams.get('page'), 10) || 1; 

        let products=[],missing = 0;

        if(loadedPageNo==pageNo)
        [products,missing] = await page.evaluate(() => {
          const productElements = document.querySelectorAll('#product-grid .grid__item');
          const productList = [];
          let missing = 0;
      
          productElements.forEach(product => {
            const titleAnchor = product.querySelector('.card__information h3 a');
            const priceElement = product.querySelector('.price-item--sale')
              || product.querySelector('.price-item--regular')
              || product.querySelector('.price .money');
            const imgElement = product.querySelector('.card__media img')
              || product.querySelector('.media img');
      
            const title = titleAnchor ? titleAnchor.innerText.trim() : null;
            const brand = null;
            let price = priceElement ? priceElement.innerText.trim() : null;
            const promo = null;
            const url = titleAnchor ? titleAnchor.href.trim() : null;
            let img = imgElement ? (imgElement.src || imgElement.dataset.src)?.trim() : null;

            if (img && img.startsWith('//')) {
              img = `https:${img}`;
            }

            if (price) {
              price = price.replace(/\s+/g, ' ').trim();
              if (price.startsWith('$') && !price.startsWith('NZ$')) {
                price = `NZ${price}`;
              }
            }
      
            if(!title||!price||!url||!img){missing+=1;}

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
              subcategory:'wine',
              img
            });
          });
      
          return [productList,missing];
        });

        if(missing > 5) {
          await insertScrapingError("More than 5 entries missing for nz_liquor - wine: "+pageNo,"scraping_missing");
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
          await insertScrapingError("Error in nz_liquor - wine: "+err.message,"scraping_trycatch");
        }catch(err){
            console.log(err);
        }
        await page.close();
        return allProducts;
    }
}

module.exports = wine;
