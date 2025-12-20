/**
 * Universal Python scraper integration for Farmers categories
 * Executes the modular Python Camoufox scraper and returns formatted results
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Scrape any Farmers category using the modular Python scraper
 * @param {string} category - Category name (e.g., 'face', 'lips', 'makeup_bags')
 * @param {number} start - Starting page number (1-indexed)
 * @param {number} end - Ending page number (1-indexed)
 * @param {object} options - Additional options
 * @returns {Promise<Array>} Array of scraped products in the expected format
 */
const scrapeFarmersPython = async (category, start, end, options = {}) => {
    const pythonScriptPath = path.join(__dirname, '../../python-scraper/farmers-scraper/scraper.py');
    const pythonVenvPath = path.join(__dirname, '../../python-scraper/venv');
    const outputFilePath = path.join(__dirname, `../../python-scraper/farmers-scraper/farmers_${category}_products.json`);
    
    // Check if Python script exists
    if (!fs.existsSync(pythonScriptPath)) {
        throw new Error(`Python scraper not found at: ${pythonScriptPath}`);
    }
    
    // Remove old JSON file to ensure fresh data
    if (fs.existsSync(outputFilePath)) {
        try {
            fs.unlinkSync(outputFilePath);
            console.log(`Removed old ${category} JSON file for fresh scrape`);
        } catch (unlinkErr) {
            console.warn(`Could not remove old ${category} JSON file:`, unlinkErr.message);
        }
    }
    
    // Determine Python executable (use venv if available, otherwise system python3)
    let pythonExec = 'python3';
    const venvPython = path.join(pythonVenvPath, 'bin', 'python3');
    if (fs.existsSync(venvPython)) {
        pythonExec = venvPython;
        console.log("Using Python virtual environment");
    } else {
        console.log("Using system Python (venv not found)");
    }
    
    try {
        console.log(`Executing Python scraper for ${category} (pages ${start} to ${end})...`);
        
        // Execute Python script and capture output
        const command = `${pythonExec} "${pythonScriptPath}" ${category} ${start} ${end}`;
        const output = execSync(command, {
            encoding: 'utf-8',
            maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large product lists
            cwd: path.dirname(pythonScriptPath),
            timeout: 300000 // 5 minute timeout
        });
        
        // Parse JSON output
        const pythonProducts = JSON.parse(output.trim());
        console.log(`✓ Python scraper completed: ${pythonProducts.length} products scraped for ${category}`);
        
        // Transform to expected format (matching existing scrapers)
        const formattedProducts = pythonProducts.map(product => {
            // Extract brand from title if possible (first word/phrase before the product name)
            const titleParts = product.title.split(' ');
            const brand = titleParts.length > 1 ? titleParts[0] : null;
            
            const subcategory = options.subcategory;
            
            return {
                title: product.title,
                brand: brand,
                price: product.price,
                promo: null, // Python scraper doesn't capture promos yet
                url: product.url,
                category: options.mainCategory,
                source: {
                    website_base: "https://www.farmers.co.nz",
                    location: "new-zealand",
                    tag: "domestic"
                },
                date: product.timestamp || Date.now(),
                last_check: Date.now(),
                mapping_ref: null,
                unit: undefined,
                subcategory: subcategory,
                img: product.img
            };
        });
        
        return formattedProducts;
        
    } catch (error) {
        console.error(`Error executing Python scraper for ${category}:`, error.message);
        
        // Try to extract JSON from stderr if stdout failed
        if (error.stdout) {
            try {
                const products = JSON.parse(error.stdout.trim());
                console.log(`✓ Recovered products from output: ${products.length}`);
                return products;
            } catch (parseError) {
                // If parsing fails, log the error
                console.error('Failed to parse Python output:', error.stdout.substring(0, 500));
            }
        }
        
        throw error;
    }
};

module.exports = scrapeFarmersPython;
