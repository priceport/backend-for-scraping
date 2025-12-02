const waitForXTime = require('../../../../helpers/waitForXTime');
const constants = require('../../../../helpers/constants');
const logError = require('../../../../helpers/logError');
const { insertScrapingError } = require('../../../../helpers/insertScrapingErrors');

const lager = async (start, end, browser) => {
  let pageNo = start;
  const url = 'https://www.liquorland.com.au/beer-and-cider/beer/lager?page=';

  const page = await browser.newPage();
  const allProducts = [];
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  try {
    await page.setRequestInterception(false);

    while (true) {
      await waitForXTime(constants.timeout);
      
      try {
        await page.goto(url + pageNo, { 
          waitUntil: 'domcontentloaded',
          timeout: 60000 
        });
        await waitForXTime(3000);
      } catch (navError) {
        console.log(`Navigation timeout on page ${pageNo}, retrying...`);
        continue;
      }

      await handleModals(page, pageNo);

      try {
        await Promise.race([
          page.waitForSelector('.ProductTileV2', { timeout: 15000, visible: true }).catch(() => null),
          page.waitForSelector('.product-list', { timeout: 15000, visible: true }).catch(() => null),
          page.waitForSelector('[class*="Product"]', { timeout: 15000, visible: true }).catch(() => null)
        ]);
        
        await waitForXTime(3000);
        
        const productCount = await page.evaluate(() => {
          return document.querySelectorAll('.ProductTileV2').length;
        });
        
        if (productCount === 0) {
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
          });
          await waitForXTime(2000);
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
          });
          await waitForXTime(3000);
        }
      } catch (waitError) {
        console.log(`Wait for products failed on page ${pageNo}: ${waitError.message}`);
      }

            const [products, missing] = await page.evaluate(() => {
        let productElements = document.querySelectorAll('.product-list .grid-x.grid-margin-x.grid-margin-y.small-up-2.large-up-3 > div .ProductTileV2');
        
        if (productElements.length === 0) {
          productElements = document.querySelectorAll('.product-list .ProductTileV2');
        }
        
        if (productElements.length === 0) {
          productElements = document.querySelectorAll('.ProductTileV2');
        }
        

        const productList = [];
        let missing = 0;

        productElements.forEach(product => {
          const titleElement = product.querySelector('.product-name');
          const brandElement = product.querySelector('.product-brand');
          const imgElement = product.querySelector('.image-container img');
          const urlElement = product.querySelector('.thumbnail');

          const title = titleElement ? titleElement.innerText.trim() : null;
          const brand = brandElement ? brandElement.innerText.trim() : null;
          const url = urlElement ? urlElement.href.trim() : null;
          const img = imgElement ? imgElement.src.trim() : null;

          const priceElements = product.querySelectorAll('.PriceTag.current.primary .FormattedAmount');

          let price = null;
          if (priceElements.length > 0) {
            const dollarAmount = priceElements[0].querySelector('.dollarAmount')?.innerText?.trim() || null;
            const centsAmount = priceElements[0].querySelector('.centsAmount')?.innerText?.trim() || null;

            if (dollarAmount && centsAmount && 
                !isNaN(dollarAmount) && !isNaN(centsAmount) && 
                centsAmount.length === 2) {
              price = `$${dollarAmount}.${centsAmount}`;
            } else {
              price = null;
            }
          }

          const promoLink = product.querySelector('.dinkus-container .dinkus');
          let promo = null;
          if (promoLink) {
            const titleAttr = promoLink.getAttribute('title') || '';
            if (!titleAttr.toUpperCase().includes('LOW PRICE EVERYDAY')) {
              const qty = promoLink.querySelector('.txtQty')?.innerText || null;
              const promoPrice = promoLink.querySelector('.txtPrice .dollarAmount')?.innerText || null;
              const cents = promoLink.querySelector('.txtPrice .centsAmount')?.innerText || null;
              
              if (qty && promoPrice && cents) {
                promo = `${qty} For $${promoPrice}.${cents}`;
              }
            }
          }

          if (!title || !brand || !price || !url || !img) {
            missing += 1;
          }

          if(!title||!brand||!price||!url){}
          
          else  productList.push({
              title,
              brand,
              price,
              promo,
              url,
              category: 'liquor',
              source: {
                website_base: "https://www.liquorland.com.au/",
                location: "sydney",
                tag: "domestic"
              },
              date: Date.now(),
              last_check: Date.now(),
              unit: undefined,
              subcategory: 'lager',
              img
            });
        });

        return [productList, missing];
      });
      if (missing > 5) {
        await insertScrapingError(`More than 5 entries missing for liquorland_aus - beer-and-cider-beer-lager: ${pageNo}`, "scraping_missing");
      }

      console.log(`Page ${pageNo}: ${products.length} products scraped, ${missing} missing`);
      allProducts.push(...products);

      if (products?.length === 0 || pageNo === end) {
        await page.close();
        return allProducts;
      }

      pageNo += 1;
    }

  } catch (err) {
    logError(err);
    try {
      await insertScrapingError(`Error in liquorland_aus - beer-and-cider-beer-lager: ${err.message}`, "scraping_trycatch");
    } catch (err) {
      console.log(err);
    }
    await page.close();
    return allProducts;
  }
}

async function handleModals(page, pageNo) {
  try {
    await waitForXTime(2000);

    await page.keyboard.press('Escape');
    await waitForXTime(1000);
    await page.keyboard.press('Escape');
    await waitForXTime(1000);

    const closeSelectors = [
      '#setPostcodeModal .react-responsive-modal-closeButton',
      '.react-responsive-modal-closeButton',
      '[data-testid="close-button"]',
      '.ModalOverlay-CloseButton'
    ];

    for (const selector of closeSelectors) {
      try {
        const closeButton = await page.$(selector);
        if (closeButton) {
          const isVisible = await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if (!el) return false;
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
          }, selector);
          
          if (isVisible) {
            await closeButton.click();
            await waitForXTime(1000);
            break;
          }
        }
      } catch (e) {
      }
    }

    await page.evaluate(() => {
      const modals = document.querySelectorAll('#setPostcodeModal, .react-responsive-modal-overlay, .react-responsive-modal-modal');
      modals.forEach(modal => {
        if (modal) {
          modal.style.display = 'none';
          modal.style.visibility = 'hidden';
          modal.style.opacity = '0';
        }
      });
      
      const overlays = document.querySelectorAll('.react-responsive-modal-overlay');
      overlays.forEach(overlay => {
        overlay.style.display = 'none';
        overlay.style.zIndex = '-1';
      });
      
      document.body.style.overflow = 'auto';
    });

    await waitForXTime(1500);

    const modalStillVisible = await page.evaluate(() => {
      const modal = document.querySelector('#setPostcodeModal');
      if (!modal) return false;
      const style = window.getComputedStyle(modal);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    if (modalStillVisible) {
      await page.keyboard.press('Escape');
      await waitForXTime(500);
    }

  } catch (error) {
    console.log(`Modal handling failed on page ${pageNo}: ${error.message}`);
  }
}

module.exports = lager;