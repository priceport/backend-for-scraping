#!/usr/bin/env python3
"""
LiquorLand Australia Vodka Scraper using Camoufox
Exact match to backend/scripts/scraping_scripts/domestic/liquorland_aus/vodka.js logic
"""

import time
import json
import random
import logging
import sys
from pathlib import Path
from typing import List, Dict
from camoufox.sync_api import Camoufox
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

# -------------------------------------------------
# Logging
# -------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

BASE_URL = "https://www.liquorland.com.au/spirits/vodka"
TIMEOUT = 5000  # Match constants.timeout


# -------------------------------------------------
class LiquorLandVodkaScraper:
# -------------------------------------------------

    def __init__(self, headless: bool = True):
        self.headless = headless
        self.script_dir = Path(__file__).parent
        
    def wait_for_x_time(self, ms: int):
        """Match waitForXTime helper - wait for milliseconds"""
        time.sleep(ms / 1000.0)
        
    def human_delay(self, a=1.0, b=2.5):
        time.sleep(random.uniform(a, b))
    
    def handle_modals(self, page, page_no: int):
        """Handle postcode modals - matching handleModals function"""
        try:
            self.wait_for_x_time(2000)
            
            # Press Escape twice
            page.keyboard.press('Escape')
            self.wait_for_x_time(1000)
            page.keyboard.press('Escape')
            self.wait_for_x_time(1000)
            
            # Try to close modal buttons
            close_selectors = [
                '#setPostcodeModal .react-responsive-modal-closeButton',
                '.react-responsive-modal-closeButton',
                '[data-testid="close-button"]',
                '.ModalOverlay-CloseButton'
            ]
            
            for selector in close_selectors:
                try:
                    close_button = page.locator(selector).first
                    if close_button.count() > 0:
                        # Check if visible
                        is_visible = page.evaluate(f"""
                            (sel) => {{
                                const el = document.querySelector(sel);
                                if (!el) return false;
                                const style = window.getComputedStyle(el);
                                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                            }}
                        """, selector)
                        
                        if is_visible:
                            close_button.click()
                            self.wait_for_x_time(1000)
                            break
                except Exception:
                    continue
            
            # Hide modals via JavaScript
            page.evaluate("""
                () => {
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
                }
            """)
            
            self.wait_for_x_time(1500)
            
            # Check if modal still visible
            modal_still_visible = page.evaluate("""
                () => {
                    const modal = document.querySelector('#setPostcodeModal');
                    if (!modal) return false;
                    const style = window.getComputedStyle(modal);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                }
            """)
            
            if modal_still_visible:
                page.keyboard.press('Escape')
                self.wait_for_x_time(500)
                
        except Exception as error:
            logger.debug(f"Modal handling failed on page {page_no}: {error}")

    # -------------------------------------------------
    def scrape(self, start: int = 1, end: int = 1) -> List[Dict]:
        """
        Main scraping method - exact match to vodka.js logic
        Args:
            start: Starting page number (1-indexed)
            end: Ending page number (1-indexed)
        Returns:
            List of all scraped products
        """
        page_no = start
        all_products = []
        
        logger.info(f"Launching Camoufox for LiquorLand Australia vodka scraping (pages {start} to {end})...")

        # ✅ CORRECT: use context manager
        with Camoufox(headless=self.headless) as browser:
            page = browser.new_page()
            page.set_viewport_size({"width": 1920, "height": 1080})
            
            # Set user agent matching vodka.js
            page.set_extra_http_headers({
                'Accept-Language': 'en-AU,en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Cache-Control': 'max-age=0'
            })
            
            # Remove webdriver property
            page.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false,
                });
            """)
            
            # Main loop - matching vodka.js while(true) loop
            while True:
                self.wait_for_x_time(TIMEOUT)
                
                target_url = f"{BASE_URL}?page={page_no}"
                
                try:
                    # Navigate to page
                    logger.info(f"Navigating to page {page_no}...")
                    try:
                        page.goto(target_url, wait_until="domcontentloaded", timeout=60000)
                        self.wait_for_x_time(3000)
                    except Exception as nav_error:
                        logger.warning(f"Navigation timeout on page {page_no}, retrying...")
                        page_no += 1
                        continue
                    
                    # Handle modals
                    self.handle_modals(page, page_no)
                    
                    # Wait for products
                    try:
                        # Try multiple selectors (matching vodka.js logic)
                        try:
                            page.wait_for_selector('.ProductTileV2', timeout=15000, state='visible')
                        except:
                            try:
                                page.wait_for_selector('.product-list', timeout=15000, state='visible')
                            except:
                                page.wait_for_selector('[class*="Product"]', timeout=15000, state='visible')
                        
                        self.wait_for_x_time(3000)
                        
                        # Check product count
                        product_count = page.evaluate("document.querySelectorAll('.ProductTileV2').length")
                        
                        if product_count == 0:
                            # Scroll to trigger loading
                            page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2);")
                            self.wait_for_x_time(2000)
                            page.evaluate("window.scrollTo(0, document.body.scrollHeight);")
                            self.wait_for_x_time(3000)
                            
                    except Exception as wait_error:
                        logger.warning(f"Wait for products failed on page {page_no}: {wait_error}")
                    
                    # Extract products - matching vodka.js exact logic
                    try:
                        result = page.evaluate("""
                            () => {
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
                                    
                                    if (!title || !brand || !price || !url) { }
                                    else {
                                        productList.push({
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
                                            subcategory: 'vodka',
                                            img
                                        });
                                    }
                                });
                                
                                return [productList, missing];
                            }
                        """)
                        
                        products = result[0]
                        missing = result[1]
                        
                    except Exception as extract_error:
                        logger.error(f"Error extracting products: {extract_error}")
                        products = []
                        missing = 0
                    
                    if missing > 5:
                        logger.warning(f"More than 5 entries missing for liquorland_aus - vodka: {page_no}")
                    
                    logger.info(f"Page {page_no}: {len(products)} products scraped, {missing} missing")
                    all_products.extend(products)
                    
                    # Check if we should continue (matching vodka.js logic)
                    if len(products) == 0 or page_no == end:
                        logger.info(f"Finished scraping. Total products: {len(all_products)}")
                        break
                    
                    page_no += 1
                    
                except Exception as goto_error:
                    logger.error(f"Error loading page {page_no}: {goto_error}")
                    if page_no == end:
                        break
                    page_no += 1
                    continue

        # Browser auto-closes here
        logger.info("Browser closed")
        return all_products


# -------------------------------------------------
def main():
# -------------------------------------------------
    # Accept command line arguments for start and end pages
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    end = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    scraper = LiquorLandVodkaScraper(headless=False)
    products = scraper.scrape(start=start, end=end)

    # Output JSON to stdout for Node.js to capture
    print(json.dumps(products, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
