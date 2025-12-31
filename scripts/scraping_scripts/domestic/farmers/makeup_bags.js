const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const parseProductsFromHtml = require('../../../../helpers/parsers/farmersHtmlParser');

const makeup_bags = async (start, end, browser, sharedPage) => {

  const allProducts = [];
  let missingTotal = 0;
  const baseUrl = "https://www.farmers.co.nz/beauty/makeup/makeup-bags-storage";
  
  try {
    if (!browser) {
      throw new Error('Browser instance is required');
    }
    
    if (!sharedPage) {
      throw new Error('Shared page instance is required');
    }
    
    const pageInstance = sharedPage;
    console.log(`📋 Starting scraper: ${baseUrl} (pages ${start}-${end})`);
    
    for (let page = start; page <= end; page++) {
      await waitForXTime(constants.timeout);
      
      // Farmers.co.nz pagination: Page 1 uses base URL, Page 2+ uses Page-{page-1}-SortingAttribute-SortBy-asc
      const url = page === 1 
        ? `${baseUrl}/` 
        : `${baseUrl}/Page-${page - 1}-SortingAttribute-SortBy-asc`;
      console.log(`🌐 Navigating to page ${page}: ${url}`);
      
      try {
        await pageInstance.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
        console.log(`✅ Page ${page} loaded successfully`);
        await waitForXTime(3000);
        
        try {
          await pageInstance.waitForSelector('.product-list-item, [data-evg-item-id]', {
            timeout: 30000
          });
          console.log(`✅ Product elements found on page ${page}`);
        } catch (selectorErr) {
          console.log(`⚠️  Product selector not found on page ${page}, continuing anyway...`);
        }
        
        console.log(`📥 Retrieving HTML content from page ${page}...`);
        const html = await pageInstance.content();
        const htmlLength = html ? html.length : 0;
        console.log(`📄 HTML retrieved: ${htmlLength} characters`);
        
        console.log(`🔍 Parsing products from HTML...`);
        const [products, pageMissing] = parseProductsFromHtml(html);
        console.log(`✅ Parsed ${products.length} products from page ${page} (${pageMissing} missing fields)`);
        missingTotal += pageMissing;
        
        allProducts.push(...products);
        
        if (products.length === 0) {
          console.log(`⚠️  No products found on page ${page}, stopping pagination`);
          break;
        }
        
      } catch (err) {
        console.log(`❌ Error on page ${page}: ${err.message}`);
        logError(err);
        // Continue to next page instead of failing completely
        continue;
      }
    }
    
    console.log(`📊 Total products collected: ${allProducts.length}`);
    console.log(`🔄 Formatting ${allProducts.length} products...`);
    
    const formattedProducts = allProducts.map(product => {
      const titleParts = product.title ? product.title.split(' ') : [];
      const brand = titleParts.length > 1 ? titleParts[0].toLowerCase() : null;
      
      return {
        title: product.title ? product.title.toLowerCase() : null,
        brand: brand,
        price: product.price ? product.price.toLowerCase() : null,
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
        subcategory: 'makeup',
        img: product.img || null
      };
    });
          const missingCount = missingTotal;
    if (missingCount > 5) {
      await insertScrapingError(
        `More than 5 entries missing for farmers - makeup_bags: ${missingCount} products with missing data`,
        "scraping_missing"
      );
    }
    
    console.log(`✅ makeup_bags scraping completed: ${formattedProducts.length} products`);
    console.log(`✅ makeup_bags scraping completed: ${formattedProducts.length} products`);
    return formattedProducts;
    
  } catch (err) {
    logError(err);
    try {
      await insertScrapingError(
        `Error in farmers - makeup_bags (Bright Data Browser): ${err.message}`,
        "scraping_trycatch"
      );
    } catch (err) {
      // Ignore
    }
    
    return allProducts;
  }
};

module.exports = makeup_bags;