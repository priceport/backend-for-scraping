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

const spirits = async () => {
    const browser = await puppeteer.launch({ 
        headless: true,
        protocolTimeout: 120000 // Increase protocol timeout to 120 seconds for proxy connections
    });
    const page = await browser.newPage();

    let retryCount = 0;
    const maxRetries = 3;
    let spiritsPageLoaded = false;
    
    while (retryCount < maxRetries && !spiritsPageLoaded) {
        try {
            await page.goto('https://www.danmurphys.com.au/spirits/all', { waitUntil: 'networkidle2', timeout: 90000 });
            console.log("Spirits page loaded successfully");
            spiritsPageLoaded = true;
        } catch (error) {
            retryCount++;
            console.log(`Error loading spirits page (attempt ${retryCount}/${maxRetries}):`, error.message);
            if (retryCount < maxRetries) {
                // Try with a more lenient wait condition
                try {
                    await page.goto('https://www.danmurphys.com.au/spirits/all', { waitUntil: 'domcontentloaded', timeout: 90000 });
                    console.log("Spirits page loaded with domcontentloaded");
                    spiritsPageLoaded = true;
                } catch (retryError) {
                    console.log(`Retry with domcontentloaded failed (attempt ${retryCount}/${maxRetries}):`, retryError.message);
                    if (retryCount < maxRetries) {
                        await waitForXTime(3000 * retryCount); // Exponential backoff
                    }
                }
            } else {
                console.log("Failed to load spirits page after all retries");
                throw new Error(`Failed to load spirits page after ${maxRetries} attempts: ${error.message}`);
            }
        }
    }

    await waitForXTime(5000);
    console.log("Initial wait complete");

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
            
            // Wait for network to be idle
            await page.waitForFunction(() => {
                return !document.querySelector('.loading') && 
                       document.readyState === 'complete';
            }, { timeout: 10000 }).catch(() => console.log("Timeout waiting for page load"));
            
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

    // Now scrape the products
    const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll('.js-list');
        const products = [];
        let missing = 0;
        productElements.forEach((element) => {
            try {
                const brandElement = element.querySelector('.title');
                const nameElement = element.querySelector('.subtitle');
                const priceElement = element.querySelectorAll('.price')[0]?element.querySelectorAll('.price')[0]?.querySelector('.value'):element.querySelector('.offers-normal-tile');
                const promoElement = element.querySelectorAll('.price')[1]?element.querySelectorAll('.price')[1]:null;
                const imageElement = element.querySelector('img');
                const urlElement = element.querySelectorAll(".mobile-app-event > a.ng-star-inserted")[1];
                
                const name = nameElement ? nameElement.textContent.trim() : '';
                const price = priceElement ? priceElement.textContent.trim() : '';
                const brand = brandElement ? brandElement.textContent.trim() : '';
                const promo = promoElement ? promoElement.querySelector('.value')?.textContent.trim()+" "+promoElement.querySelector('.quantity')?.textContent.trim() : '';
                const url = urlElement ? urlElement.href.trim() : '';
                const img = imageElement ? imageElement.src.trim() : '';
                const description = imageElement ? imageElement.alt.trim() : '';

                console.log(name,price,brand,promo,url,img,description);
                if(!name||!price||!brand||!url||!img){missing+=1;}
                if(!name&&!brand&&!price&&!url){}
                else
                if (name) {
                    products.push({
                        name: name,
                        price: price,
                        source: 'Dan Murphy',
                        brand: brand,
                        promo: promo,
                        url: url,
                        img: img,
                        description: description,
                        category: 'liquor',
                        sub_category: 'spirits',
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

    console.log("products",products);
    console.log(`Scraped ${products.length} products`);

    await waitForXTime(2000);
    await browser.close();
    return products;
}

module.exports = spirits;