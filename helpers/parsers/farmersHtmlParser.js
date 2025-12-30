
const cheerio = require('cheerio');
const logError = require('../logError');

/**
 * Parse products from HTML content
 * @param {string} html - HTML content
 * @returns {Array} Array containing [products, missingCount]
 */
function parseProductsFromHtml(html) {
  const products = [];
  let missing = 0;
  
  try {
    const $ = cheerio.load(html);
    
    $('.product-list-item, [data-evg-item-id]').each((index, element) => {
      try {
        const $item = $(element);
        
        const title = $item.find('.product-title-span').text().trim();
        const price = $item.find('.current-price').text().trim();
        const link = $item.find('a').first().attr('href');
        const img = $item.find('img').first().attr('src');
        
        const url = link ? (link.startsWith('http') ? link : `https://www.farmers.co.nz${link}`) : null;
        
        if (!title || !price || !url || !img) {
          missing += 1;
        }
        
        if (!title || !price || !url) {
          // Skip products without required fields
        } else {
          products.push({
            title,
            price,
            url,
            img: img || null
          });
        }
      } catch (err) {
        // Skip this product if parsing fails
      }
    });
  } catch (err) {
    logError(err);
  }
  
  return [products, missing];
}

module.exports = parseProductsFromHtml;


