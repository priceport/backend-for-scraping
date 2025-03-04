const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

puppeteer.use(StealthPlugin());

const beauty = async (start, end,browser) => {
    let pageNo = 1;
    const url = 'https://www.chemistwarehouse.co.nz/shop-online/257/beauty';

    const page = await browser.newPage();

    const allProducts = [];

    try{

    // Navigate to the initial page
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.product__container', { visible: true });

    let activePageElement = await page.$(".pager__button--active.pager__button");
        let skipMultiplePagesElement = await page.$$(".pager__button.pager__spacer");
        let prevButtonElement = await page.$(".pager__button.pager__button--prev");
        let nextBtn = await page.$('.pager__button--next');

        skipMultiplePagesElement = skipMultiplePagesElement[skipMultiplePagesElement.length-1];

        let activePage = await page.evaluate(el => el.innerText, activePageElement);

        while(activePage!=start){
            if(activePage<start)
            await skipMultiplePagesElement.click();

            if(activePage>start)
            await prevButtonElement.click();

            await page.waitForSelector('.product__container', { visible: true });

            await waitForXTime(constants.timeout);

            activePageElement = await page.$(".pager__button--active.pager__button");
            activePage = await page.evaluate(el => el.innerText, activePageElement);
            skipMultiplePagesElement = await page.$$(".pager__button.pager__spacer");
            prevButtonElement = await page.$(".pager__button.pager__button--prev");
            nextBtn = await page.$('.pager__button--next');

            if(skipMultiplePagesElement?.length==1&&activePage>5){
                while(nextBtn&&activePage!=start) {
                    await nextBtn.click();

                    await page.waitForSelector('.product__container', { visible: true });
            
                    await waitForXTime(constants.timeout);

                    nextBtn = await page.$('.pager__button--next');
                };

                if(!nextBtn&&activePage!=start) {
                    await page.close();
                    return [];
                }
            }

            skipMultiplePagesElement = skipMultiplePagesElement[skipMultiplePagesElement.length-1];
        }

    while (true) {
        console.log("pageNo="+(start+pageNo-1));

        await waitForXTime(constants.timeout);

        // Evaluate the product data from the current page
        const products = await page.evaluate(() => {
            const productList = [];
            const productElements = document.querySelectorAll('.product__container');

            productElements.forEach(product => {
                const titleElement = product.querySelector('.product__title');
                const brandElement = product.querySelector('.css-cfm1ok');
                const priceElement = product.querySelector('.product__price-current');
                const urlElement = product;
                const imgElement = product.querySelector('.product__image-main');

                const title = titleElement ? titleElement.innerText.trim() : null;
                const brand = brandElement ? brandElement.innerText.trim() : null;
                const price = priceElement ? priceElement.innerText.trim() : null;
                const url = urlElement ? urlElement.href.trim() : null;
                const img = imgElement ? imgElement.src.trim() : null;

                if (title || brand || price || url) {
                    productList.push({
                        title,
                        brand,
                        price,
                        url,
                        category: 'beauty',
                        source: {
                            website_base: "https://www.chemistwarehouse.co.nz",
                            location: "new-zealand",
                            tag: "domestic"
                        },
                        date: Date.now(),
                        last_check: Date.now(),
                        subcategory: 'beauty',
                        img
                    });
                }
            });

            return productList;
        });

        // Push new products to the allProducts array
        allProducts.push(...products);

        // Check for the next button
        nextBtn = await page.$('.pager__button--next');

        if (!nextBtn||(start+pageNo-1)>=end) {
            break;  // Exit the loop when there are no more pages
        }

        // Click the next button
        await nextBtn.click();

        // Wait for the next batch of products to load by waiting for a new element or a change in the DOM
        await page.waitForSelector('.product__container', { visible: true });

        // Optionally, add a delay to ensure all content is loaded
        await waitForXTime(constants.timeout);

        pageNo += 1;
    }
    await page.close();

    return allProducts;

    }catch(err){
        logError(err);

        try{
            await insertScrapingError("Error in chemist_warehouse - beauty: "+err.message,"scraping_trycatch");
        }catch(err){
            console.log(err);
        }
        await page.close();
        return allProducts;
    }
};

module.exports = beauty;