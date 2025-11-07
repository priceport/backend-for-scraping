const fetch = require('node-fetch');

const CONFIG = {
  BASE_URL: 'https://melbourne.lottedutyfree.com.au',
  API_TIMEOUT: 10000
};

/**
 * Fetch image and URL from Shopify API
 * @param {string} productUrl - Product URL like "/products/malibu-rum-1l"
 * @param {string} collectionName - Collection name for referer header (e.g., "rum", "vodka")
 * @returns {Promise<Object|null>} Object with img and url or null
 */
const fetchImageFromAPI = async (productUrl, collectionName = 'products') => {
  if (!productUrl) return null;
  
  try {
    let apiUrl;
    if (productUrl.startsWith('http')) {
      apiUrl = `${productUrl}.js`;
    } else {
      apiUrl = `${CONFIG.BASE_URL}${productUrl}.js`;
    }
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': '*/*',
        'Referer': `${CONFIG.BASE_URL}/collections/${collectionName}`
      },
      timeout: CONFIG.API_TIMEOUT
    });

    if (response.ok) {
      const data = await response.json();
      
      let img = null;
      if (data.featured_image) {
        const filenamePart = data.featured_image.split('/files/').pop();
        img = `${CONFIG.BASE_URL}/cdn/shop/files/${filenamePart}`;
      }
      
      return {
        img,
        url: data.url
      };
    }
    
    return null;
  } catch (err) {
    console.log(`❌ API fetch error: ${err.message}`);
    return null;
  }
};

module.exports = { fetchImageFromAPI, CONFIG };

