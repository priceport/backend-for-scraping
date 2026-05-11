const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

puppeteer.use(StealthPlugin());

/** Scrapes fragrances listing — page 1 only (start/end ignored for pagination). */
const fragrance = async (start, end, browser) => {
    const url = 'https://www.chemistwarehouse.co.nz/shop-online/542/fragrances';

    const page = await browser.newPage();

    const allProducts = [];

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.waitForSelector('.product__container', { visible: true });

        await waitForXTime(constants.timeout);

        console.log('pageNo=1');

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
                            website_base: 'https://www.chemistwarehouse.co.nz',
                            location: 'new-zealand',
                            tag: 'domestic'
                        },
                        date: Date.now(),
                        last_check: Date.now(),
                        subcategory: 'fragrance',
                        img
                    });
                }
            });

            return productList;
        });

        allProducts.push(...products);

        console.log(`fragrance page 1: ${allProducts.length} products scraped`);
        allProducts.forEach(pro => console.log({ price: pro.price, title: pro.title }));

        await page.close();

        return allProducts;
    } catch (err) {
        logError(err);

        try {
            await insertScrapingError('Error in chemist_warehouse - fragrance: ' + err.message, 'scraping_trycatch');
        } catch (e) {
            console.log(e);
        }

        await page.close();
        return allProducts;
    }
};

module.exports = fragrance;
