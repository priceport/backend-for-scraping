/**
 * Farmers Nail Tools Products Scraper
 * Uses Python Camoufox scraper for better anti-bot evasion
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const nail_tools = async (start, end) => {
  const allProducts = [];
  
  try {
    console.log(`Starting Farmers nail_tools scraper (pages ${start} to ${end})...`);
    
    // Path to Python scraper (use resolve for absolute paths)
    const pythonScriptPath = path.resolve(__dirname, '../../../../python-scraper/farmers-scraper/scraper.py');
    const pythonVenvPath = path.resolve(__dirname, '../../../../python-scraper/venv');
    
    // Determine Python executable (use venv if available)
    let pythonExec = 'python3';
    const venvPython = path.resolve(pythonVenvPath, 'bin', 'python3');
    if (fs.existsSync(venvPython)) {
      pythonExec = venvPython;
    }
    
    // Execute Python scraper and capture JSON output
    const output = execSync(`${pythonExec} "${pythonScriptPath}" nail_tools ${start} ${end}`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
      cwd: path.dirname(pythonScriptPath),
      timeout: 300000
    });
    
    // Parse JSON output from stdout
    const pythonProducts = JSON.parse(output.trim());
    console.log(`Python scraper found ${pythonProducts.length} products`);
    
    // Transform Python output to expected format
    pythonProducts.forEach(product => {
      const titleParts = product.title.split(' ');
      const brand = titleParts.length > 1 ? titleParts[0] : null;
      
      allProducts.push({
        title: product.title,
        brand: brand,
        price: product.price,
        promo: null,
        url: product.url,
        category: 'beauty',
        source: {
          website_base: "https://www.farmers.co.nz",
          location: "new-zealand",
          tag: "domestic"
        },
        date: product.timestamp,
        last_check: Date.now(),
        mapping_ref: null,
        unit: undefined,
        subcategory: 'nail_tools',
        img: product.img
      });
    });
    
    // Check for missing data
    const missingCount = allProducts.filter(p => !p.title || !p.price || !p.url || !p.img).length;
    if (missingCount > 5) {
      await insertScrapingError(
        `More than 5 entries missing for farmers - nail_tools: ${missingCount} products with missing data`,
        "scraping_missing"
      );
    }
    
    console.log(`Farmers nail_tools scraping completed: ${allProducts.length} products`);
    return allProducts;
    
  } catch (err) {
    logError(err);
    try {
      await insertScrapingError(
        `Error in farmers - nail_tools: ${err.message}`,
        "scraping_trycatch"
      );
    } catch (err) {
      console.log(err);
    }
    return allProducts;
  }
};

module.exports = nail_tools;
