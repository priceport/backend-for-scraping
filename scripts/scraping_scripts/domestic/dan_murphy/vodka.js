const puppeteer = require('puppeteer-extra');
const ProxyPlugin = require('puppeteer-extra-plugin-proxy');
const waitForXTime = require('../../../../helpers/waitForXTime');

// Configure proxy for Dan Murphy scraping
const proxyServer = '142.111.48.253:7030';
const proxyUsername = 'ftjgwyap';
const proxyPassword = '17xe9se18188';

// Setup proxy plugin
puppeteer.use(ProxyPlugin({
    address: proxyServer.split(':')[0],
    port: parseInt(proxyServer.split(':')[1]),
    credentials: {
        username: proxyUsername,
        password: proxyPassword
    }
}));

const vodka = async () => {
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

    console.log("Navigating to Dan Murphy's vodka page...");
    
    // First, go to the main page to establish a session
    try {
        await page.goto('https://www.danmurphys.com.au', { waitUntil: 'networkidle2', timeout: 60000 });
        console.log("Main page loaded successfully");
    } catch (error) {
        console.log("Error loading main page:", error.message);
        // Continue anyway
    }
    await waitForXTime(3000);
    
    // Then navigate to the vodka page
    try {
        await page.goto('https://www.danmurphys.com.au/spirits/vodka', { waitUntil: 'networkidle2', timeout: 60000 });
        console.log("Vodka page loaded successfully");
    } catch (error) {
        console.log("Error loading vodka page:", error.message);
        // Try with a more lenient wait condition
        try {
            await page.goto('https://www.danmurphys.com.au/spirits/vodka', { waitUntil: 'domcontentloaded', timeout: 60000 });
            console.log("Vodka page loaded with domcontentloaded");
        } catch (retryError) {
            console.log("Error on retry:", retryError.message);
            throw retryError;
        }
    }

    await waitForXTime(8000);
    console.log("Initial wait complete");

    // Verify page is accessible before proceeding
    let pageContent;
    try {
        // Wait a bit more to ensure page is stable
        await waitForXTime(2000);
        
        // Check if we got blocked or if products are loading
        pageContent = await page.evaluate(() => {
            return {
                title: document.title,
                bodyText: document.body ? document.body.innerText : '',
                hasNoProducts: document.body ? document.body.innerText.includes('No products found') : false,
                hasLoading: document.body ? document.body.innerText.includes('Finding closest store') : false,
                url: window.location.href
            };
        });
        console.log("Page content check:", pageContent);
    } catch (evalError) {
        console.log("Error evaluating page content:", evalError.message);
        // Try to get basic page info
        try {
            const currentUrl = page.url();
            const title = await page.title();
            console.log("Page URL:", currentUrl, "Title:", title);
            pageContent = { url: currentUrl, title: title, hasNoProducts: false, hasLoading: false, bodyText: '' };
        } catch (fallbackError) {
            console.log("Could not get page info:", fallbackError.message);
            // Don't throw, just continue with default values to avoid crashing
            pageContent = { url: 'unknown', title: 'unknown', hasNoProducts: false, hasLoading: false, bodyText: '' };
        }
    }

    // If we're still on the main page or getting blocked, try a different approach
    if (pageContent.hasNoProducts || pageContent.hasLoading) {
        console.log("Detected blocking or loading issue, trying alternative approach...");
        
        // Try going directly to the search results with specific parameters
        await page.goto('https://www.danmurphys.com.au/spirits/vodka?page=1&sortBy=relevance', { waitUntil: 'networkidle2', timeout: 60000 });
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
    const maxClicks = 47; // Limit to 47 clicks as requested
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
                        sub_category: 'vodka',
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

module.exports = vodka;