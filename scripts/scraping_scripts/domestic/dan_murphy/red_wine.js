const puppeteer = require('puppeteer');
const waitForXTime = require('../../../../helpers/waitForXTime');

const redWine = async () => {
    const browser = await puppeteer.launch({ 
        headless: true,
        protocolTimeout: 60000, // Increase protocol timeout to 60 seconds
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

    console.log("Navigating to Dan Murphy's red wine page...");
    
    // First, go to the main page to establish a session
    await page.goto('https://www.danmurphys.com.au', { waitUntil: 'networkidle2', timeout: 60000 });
    await waitForXTime(3000);
    
    // Then navigate to the red wine page
    await page.goto('https://www.danmurphys.com.au/red-wine/all', { waitUntil: 'networkidle2', timeout: 60000 });

    await waitForXTime(8000);
    console.log("Initial wait complete");

    // Take a screenshot to see what's on the page
    await page.screenshot({ path: 'dan_murphy_debug.png', fullPage: true });
    console.log("Screenshot saved as dan_murphy_debug.png");

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
        await page.goto('https://www.danmurphys.com.au/red-wine/all?page=1&sortBy=relevance', { waitUntil: 'networkidle2', timeout: 60000 });
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

    // Debug: Check what elements are available on the page
    const pageStructure = await page.evaluate(() => {
        const debug = {
            buttonText: document.querySelector(".results-pagination-wrapper__inner-wrapper button")?.innerText,
            jsListCount: document.querySelectorAll('.js-list').length,
            productTileCount: document.querySelectorAll('.product-tile').length,
            allPossibleSelectors: [],
            pageTitle: document.title,
            bodyText: document.body.innerText.substring(0, 500), // First 500 chars of body text
            allElements: [],
            currentUrl: window.location.href
        };

        // Check for various possible product selectors
        const possibleSelectors = [
            '.js-list',
            '.product-tile',
            '.product-item',
            '.product-card',
            '.item',
            '[data-testid*="product"]',
            '.product',
            '.wine-item',
            '.results-item',
            '.search-result-item',
            '.listing-item'
        ];

        possibleSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                debug.allPossibleSelectors.push({
                    selector: selector,
                    count: elements.length,
                    firstElementClasses: elements[0]?.className || 'no-class',
                    firstElementHTML: elements[0]?.outerHTML?.substring(0, 300) || 'no-html'
                });
            }
        });

        // Check for any elements with product-related classes
        const allElements = document.querySelectorAll('*');
        const productClasses = [];
        allElements.forEach(el => {
            if (el.className && typeof el.className === 'string' && 
                (el.className.includes('product') || el.className.includes('wine') || el.className.includes('item') || el.className.includes('result'))) {
                productClasses.push(el.className);
            }
        });

        debug.productClasses = [...new Set(productClasses)].slice(0, 15); // Get unique classes, limit to 15

        // Check for any divs or sections that might contain products
        const divs = document.querySelectorAll('div');
        divs.forEach((div, index) => {
            if (index < 20) { // Limit to first 20 divs
                debug.allElements.push({
                    tag: div.tagName,
                    className: div.className,
                    id: div.id,
                    textContent: div.textContent?.substring(0, 100) || ''
                });
            }
        });

        return debug;
    });

    console.log("Page structure debug:", JSON.stringify(pageStructure, null, 2));

    // Function to get button text with better error handling
    const getButtonText = async () => {
        try {
            return await page.evaluate(() => {
                const button = document.querySelector(".results-pagination-wrapper__inner-wrapper button");
                return button ? button.innerText : null;
            });
        } catch (error) {
            console.log("Error getting button text:", error.message);
            return null;
        }
    };

    // Function to click the button with better error handling
    const clickButton = async () => {
        try {
            await page.click(".results-pagination-wrapper__inner-wrapper button");
            return true;
        } catch (error) {
            console.log("Error clicking button:", error.message);
            return false;
        }
    };

    let buttonText = await getButtonText();
    console.log("Initial button text:", buttonText);

    let clickCount = 0;
    const maxClicks = 200; // Increased safety limit
    let consecutiveFailures = 0;
    const maxConsecutiveFailures = 5;

    // Keep clicking until button text becomes "Back to top" or we hit the safety limit
    while (buttonText && buttonText.includes("SHOW") && clickCount < maxClicks && consecutiveFailures < maxConsecutiveFailures) {
        try {
            console.log(`Attempting to click button ${clickCount + 1} times`);
            
            // Scroll to the button to ensure it's visible
            await page.evaluate(() => {
                const button = document.querySelector(".results-pagination-wrapper__inner-wrapper button");
                if (button) {
                    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            await waitForXTime(1000);
            
            const clickSuccess = await clickButton();
            if (!clickSuccess) {
                consecutiveFailures++;
                console.log(`Click failed. Consecutive failures: ${consecutiveFailures}`);
                await waitForXTime(2000);
                continue;
            }
            
            clickCount++;
            consecutiveFailures = 0; // Reset failure counter on success
            console.log(`Clicked button ${clickCount} times`);
            
            // Wait for the page to load new content
            await waitForXTime(3000);
            
            // Wait for network to be idle and ensure elements are loaded with shorter timeout
            try {
                await page.waitForFunction(() => {
                    return !document.querySelector('.loading') && 
                           document.readyState === 'complete';
                }, { timeout: 10000 });
            } catch (error) {
                console.log("Timeout waiting for page load, continuing...");
            }
            
            // Additional wait to ensure dynamic content is fully loaded
            await waitForXTime(2000);
            
            // Get updated button text
            buttonText = await getButtonText();
            console.log(`Button text after click ${clickCount}:`, buttonText);
            
            // If button text is null or doesn't contain "SHOW", we're done
            if (!buttonText || !buttonText.includes("SHOW")) {
                console.log("Button no longer shows 'SHOW', stopping clicks");
                break;
            }
            
        } catch (error) {
            console.log("Error in button clicking loop:", error.message);
            consecutiveFailures++;
            await waitForXTime(3000);
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
                        sub_category: 'red_wine',
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

module.exports = redWine;