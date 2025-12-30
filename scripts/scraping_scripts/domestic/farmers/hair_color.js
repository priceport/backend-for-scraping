const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const parseProductsFromHtml = require('../../../../helpers/parsers/farmersHtmlParser');

const hair_color = async (start, end, browser) => {
  const allProducts = [];
  let missingTotal = 0;
  const baseUrl = "https://www.farmers.co.nz/beauty/hair-care/hair-colour";
  
  try {
    if (!browser) {
      throw new Error('Browser instance is required');
    }
    
    for (let page = start; page <= end; page++) {
      await waitForXTime(constants.timeout);
      
      const url = `${baseUrl}/Page-${page}-SortingAttribute-SortBy-asc`;
      
      try {
        const pageInstance = await browser.newPage();
        await pageInstance.setViewportSize({ width: 1920, height: 1080 });
        
        await pageInstance.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
        
        await waitForXTime(3000);
        
        try {
          await pageInstance.waitForSelector('.product-list-item, [data-evg-item-id]', {
            timeout: 30000
          });
        } catch (selectorErr) {
          // Continue anyway
        }
        
        const html = await pageInstance.content();
        const [products, pageMissing] = parseProductsFromHtml(html);
        missingTotal += pageMissing;
        
        allProducts.push(...products);
        await pageInstance.close();
        
        if (products.length === 0) {
          break;
        }
        
      } catch (err) {
        logError(err);
        continue;
      }
    }
    
    const formattedProducts = allProducts.map(product => {
      const titleParts = product.title ? product.title.split(' ') : [];
      const brand = titleParts.length > 1 ? titleParts[0].toLowerCase() : null;
      
      return {
        title: product.title ?? product.title.toLowerCase() ,
        brand: brand,
        price: product.price ?? product.price.toLowerCase(),
        promo: null,
        url: product.url,
        category: 'beauty',
        source: {
          website_base: "https://www.farmers.co.nz",
          location: "new-zealand",
          tag: "domestic"
        },
        date: Date.now(),
        last_check: Date.now(),
        mapping_ref: null,
        unit: undefined,
        subcategory: 'hair_color',
        img: product.img || null
      };
    });
    
    const missingCount = missingTotal;
    if (missingCount > 5) {
      await insertScrapingError(
        `More than 5 entries missing for farmers - hair_color: ${missingCount} products with missing data`,
        "scraping_missing"
      );
    }
    
    return formattedProducts;
    
  } catch (err) {
    logError(err);
    try {
      await insertScrapingError(
        `Error in farmers - hair_color (Bright Data Browser): ${err.message}`,
        "scraping_trycatch"
      );
    } catch (err) {
      // Ignore
    }
    
    return allProducts;
  }
};

module.exports = hair_color;