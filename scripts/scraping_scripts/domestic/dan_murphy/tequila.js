const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');

const tequila = async () => {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport and user agent for better compatibility
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Remove webdriver property to avoid detection
    await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
    });

    // Enable JavaScript and set extra headers
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
    });

    // Set cookies to appear more like a real user
    await page.setCookie(
        { name: 'dm_geo', value: 'NSW', domain: '.danmurphys.com.au' },
        { name: 'dm_store', value: 'NSW', domain: '.danmurphys.com.au' },
        { name: 'dm_region', value: 'NSW', domain: '.danmurphys.com.au' }
    );

    console.log("Navigating to Dan Murphy's tequila page...");
    
    // First, go to the main page to establish a session
    await page.goto('https://www.danmurphys.com.au', { waitUntil: 'networkidle2' });
    await waitForXTime(3000);
    
    // Then navigate to the tequila page
    await page.goto('https://www.danmurphys.com.au/spirits/tequila', { waitUntil: 'networkidle2' });

    await waitForXTime(8000);
    console.log("Initial wait complete");

    // Check if we got blocked or if products are loading
    const pageContent = await page.evaluate(() => {
        return {
            title: document.title,
            bodyText: document.body.innerText,
            hasNoProducts: document.body.innerText.includes('No products found'),
            hasLoading: document.body.innerText.includes('Finding closest store'),
            url: window.location.href
        };
    });

    console.log("Page content check:", pageContent);

    // If we're still on the main page or getting blocked, try a different approach
    if (pageContent.hasNoProducts || pageContent.hasLoading) {
        console.log("Detected blocking or loading issue, trying alternative approach...");
        
        // Try going directly to the search results with specific parameters
        await page.goto('https://www.danmurphys.com.au/spirits/tequila?page=1&sortBy=relevance', { waitUntil: 'networkidle2' });
        await waitForXTime(5000);
        
        // Try scrolling to trigger lazy loading
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await waitForXTime(3000);
        
        // Scroll back up
        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });
        await waitForXTime(2000);
    }

    // Wait for products to load - try multiple approaches
    console.log("Waiting for products to load...");
    
    // Wait for any product-related elements to appear
    try {
        await page.waitForFunction(() => {
            const selectors = ['.js-list', '.product-tile', '.product-item', '.product-card', '.item', '[data-testid*="product"]'];
            return selectors.some(selector => document.querySelectorAll(selector).length > 0);
        }, { timeout: 30000 });
        console.log("Products found after waiting");
    } catch (error) {
        console.log("Timeout waiting for products, continuing anyway...");
    }

    // Additional wait for dynamic content
    await waitForXTime(5000);

    // Function to get button text
    const getButtonText = async () => {
        return await page.evaluate(() => {
            const button = document.querySelector(".results-pagination-wrapper__inner-wrapper button");
            return button ? button.innerText : null;
        });
    };

    // Function to click the button
    const clickButton = async () => {
        await page.click(".results-pagination-wrapper__inner-wrapper button");
    };

    let buttonText = await getButtonText();
    console.log("Initial button text:", buttonText);

    let clickCount = 0;
    const maxClicks = 100; // Safety limit to prevent infinite loops

    // Keep clicking until button text becomes "Back to top" or we hit the safety limit
    while (buttonText && buttonText !== "Back to top" && clickCount < maxClicks) {
        try {
            await clickButton();
            clickCount++;
            console.log(`Clicked button ${clickCount} times`);
            
            // Wait for the page to load new content
            await waitForXTime(3000);
            
            // Wait for network to be idle and ensure elements are loaded
            await page.waitForFunction(() => {
                return !document.querySelector('.loading') && 
                       document.readyState === 'complete' &&
                       document.querySelectorAll('.js-list').length > 0;
            }, { timeout: 15000 }).catch(() => console.log("Timeout waiting for page load"));
            
            // Additional wait to ensure dynamic content is fully loaded
            await waitForXTime(2000);
            
            // Get updated button text
            buttonText = await getButtonText();
            console.log(`Button text after click ${clickCount}:`, buttonText);
            
        } catch (error) {
            console.log("Error clicking button:", error.message);
            break;
        }
    }

    console.log(`Finished clicking. Total clicks: ${clickCount}`);
    console.log("Final button text:", buttonText);

    // Now scrape the products with multiple selector attempts
    const products = await page.evaluate(() => {
        // Try multiple possible selectors
        const selectors = ['.js-list', '.product-tile', '.product-item', '.product-card', '.item', '.results-item', '.search-result-item'];
        let productElements = [];
        
        for (let selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`Found ${elements.length} elements with selector: ${selector}`);
                productElements = elements;
                break;
            }
        }

        const products = [];
        let missing = 0;
        
        if (productElements.length === 0) {
            console.log("No product elements found with any selector");
            return products;
        }

        productElements.forEach((element, index) => {
            try {
                // Try multiple possible selectors for each field
                const brandElement = element.querySelector('.title') || element.querySelector('.brand') || element.querySelector('.product-brand');
                const nameElement = element.querySelector('.subtitle') || element.querySelector('.name') || element.querySelector('.product-name');
                const priceElement = element.querySelector('.price .value') || element.querySelector('.price') || element.querySelector('.product-price');
                const imageElement = element.querySelector('img');
                const urlElement = element.querySelector('a') || element.querySelector('.product-link');
                
                const name = nameElement ? nameElement.textContent.trim() : '';
                const price = priceElement ? priceElement.textContent.trim() : '';
                const brand = brandElement ? brandElement.textContent.trim() : '';
                const url = urlElement ? urlElement.href.trim() : '';
                const img = imageElement ? imageElement.src.trim() : '';
                const description = imageElement ? imageElement.alt.trim() : '';

                console.log(`Product ${index}:`, { name, price, brand, url: url ? 'has-url' : 'no-url', img: img ? 'has-img' : 'no-img' });
                
                if (name || brand || price) {
                    products.push({
                        name: name,
                        price: price,
                        source: 'Dan Murphy',
                        brand: brand,
                        url: url,
                        img: img,
                        description: description,
                        category: 'liquor',
                        sub_category: 'tequila',
                        website: 'danmurphy',
                        country: 'Australia',
                    });
                }
            } catch (error) {
                console.log("Error parsing product:", error);
            }
        });
        
        return products;
    });

    console.log("products", products);
    console.log(`Scraped ${products.length} products`);

    await waitForXTime(2000);
    await browser.close();
    return products;
}

module.exports = tequila;