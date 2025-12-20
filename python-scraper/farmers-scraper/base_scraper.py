#!/usr/bin/env python3
"""
Base scraper class for Farmers.co.nz
Provides common functionality for all category scrapers
"""

import time
import json
import random
import logging
from typing import List, Dict, Optional
from camoufox.sync_api import Camoufox
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

from config import HOME_URL, SOURCE_INFO

# -------------------------------------------------
# Logging Configuration
# -------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# -------------------------------------------------
class BaseFarmersScraper:
# -------------------------------------------------
    """
    Base class for all Farmers scrapers
    Handles common scraping logic, pagination, and browser management
    """
    
    def __init__(
        self,
        category_name: str,
        base_url: str,
        start_page: int = 1,
        end_page: int = 1,
        headless: bool = True
    ):
        """
        Initialize the scraper
        
        Args:
            category_name: Name of the category (e.g., 'face', 'lips')
            base_url: Base URL for the category
            start_page: Starting page number
            end_page: Ending page number
            headless: Run browser in headless mode
        """
        self.category_name = category_name
        self.base_url = base_url
        self.start_page = start_page
        self.end_page = end_page
        self.headless = headless
        
    def human_delay(self, min_seconds: float = 1.0, max_seconds: float = 2.5):
        """Add human-like delay"""
        time.sleep(random.uniform(min_seconds, max_seconds))
    
    def construct_page_url(self, page_no: int) -> str:
        """
        Construct URL for a specific page
        Can be overridden by subclasses if URL pattern is different
        """
        if page_no == 1:
            return self.base_url
        return f"{self.base_url}?p={page_no}"
    
    def get_product_selectors(self) -> Dict[str, str]:
        """
        Return CSS selectors for product elements
        Can be overridden by subclasses if selectors are different
        """
        return {
            "container": ".product-list-item, [data-evg-item-id]",
            "title": ".product-title-span",
            "price": ".current-price",
            "link": "a",
            "image": "img"
        }
    
    def extract_product_data(self, item, selectors: Dict[str, str]) -> Optional[Dict]:
        """
        Extract data from a product element
        Can be overridden by subclasses for custom extraction logic
        """
        try:
            title = item.locator(selectors["title"]).inner_text().strip()
            price = item.locator(selectors["price"]).inner_text().strip()
            link = item.locator(selectors["link"]).first.get_attribute("href")
            img = item.locator(selectors["image"]).first.get_attribute("src")
            
            # Validation
            if not title or not price or not link:
                return None
            
            return {
                "title": title,
                "price": price,
                "url": f"https://www.farmers.co.nz{link}" if link and not link.startswith("http") else link,
                "img": img,
                "source": "farmers.co.nz",
                "timestamp": int(time.time() * 1000)
            }
        except Exception as e:
            logger.debug(f"Failed to extract product: {e}")
            return None
    
    def scroll_page(self, page):
        """
        Scroll page to load lazy-loaded products
        """
        page.evaluate("""
            async () => {
                let lastHeight = document.body.scrollHeight;
                let currentHeight = lastHeight;
                let scrollAttempts = 0;
                const maxScrollAttempts = 5;
                
                do {
                    window.scrollTo(0, document.body.scrollHeight);
                    await new Promise(r => setTimeout(r, 300));
                    lastHeight = currentHeight;
                    currentHeight = document.body.scrollHeight;
                    scrollAttempts++;
                } while (currentHeight > lastHeight && scrollAttempts < maxScrollAttempts);
                
                window.scrollTo(0, document.body.scrollHeight);
                await new Promise(r => setTimeout(r, 500));
            }
        """)
    
    def scrape(self) -> List[Dict]:
        """
        Main scraping method with pagination support
        """
        all_products: List[Dict] = []
        page_no = self.start_page
        selectors = self.get_product_selectors()
        
        logger.info(f"Starting {self.category_name} scraper (pages {self.start_page}-{self.end_page})")
        logger.info("Launching Camoufox...")
        
        with Camoufox(
            headless=self.headless,
            proxy=None,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        ) as browser:
            
            page = browser.new_page()
            page.set_viewport_size({"width": 1920, "height": 1080})
            
            # Set extra headers to look more human
            page.set_extra_http_headers({
                "Accept-Language": "en-US,en;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
            })
            
            # Visit homepage for session warm-up and cookie acceptance
            logger.info("Visiting homepage for session warm-up...")
            page.goto(HOME_URL, wait_until="networkidle", timeout=60000)
            
            # Wait for page to fully load and cookies to be set
            self.human_delay(2, 4)
            
            # Try to accept cookies/close modals if they appear
            try:
                # Look for common cookie/modal buttons
                accept_button = page.locator("button:has-text('Accept'), button:has-text('OK'), button:has-text('Close')").first
                if accept_button.is_visible(timeout=2000):
                    accept_button.click()
                    self.human_delay(1, 2)
            except Exception:
                pass  # No modal found, continue
            
            # Scroll to simulate human behavior
            page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
            self.human_delay(1, 2)
            
            # Pagination loop
            while True:
                logger.info(f"Scraping page {page_no}...")
                
                target_url = self.construct_page_url(page_no)
                logger.info(f"Navigating to: {target_url}")
                
                # Navigate with full page load
                page.goto(target_url, wait_until="networkidle", timeout=60000)
                
                # Wait longer for dynamic content
                self.human_delay(3, 5)
                
                # Check if page loaded properly (look for any content)
                try:
                    # First check if page structure exists
                    page.wait_for_load_state("domcontentloaded", timeout=10000)
                    page.wait_for_load_state("networkidle", timeout=10000)
                except Exception:
                    logger.warning("Page load timeout, but continuing...")
                
                # Additional wait for JavaScript to execute
                self.human_delay(2, 3)
                
                # Wait for products to load
                try:
                    page.wait_for_selector(selectors["container"], timeout=30000)
                    logger.info(f"Products container found on page {page_no}")
                except PlaywrightTimeoutError:
                    logger.warning(f"No products found on page {page_no}")
                    # Take screenshot for debugging
                    screenshot_path = f"debug_{self.category_name}_page.png"
                    page.screenshot(path=screenshot_path, full_page=True)
                    logger.info(f"Debug screenshot saved: {screenshot_path}")
                    
                    # Try alternative selector
                    try:
                        alt_items = page.locator(".product-item, [data-product-id], .productListItem").all()
                        if len(alt_items) > 0:
                            logger.info(f"Found {len(alt_items)} products with alternative selector")
                        else:
                            break
                    except Exception:
                        break
                
                self.human_delay(2, 3)
                
                # Scroll to load all products
                self.scroll_page(page)
                self.human_delay(1, 2)
                
                # Extract products
                items = page.locator(selectors["container"]).all()
                logger.info(f"Found {len(items)} product containers on page {page_no}")
                
                page_products = []
                missing_count = 0
                
                for item in items:
                    product_data = self.extract_product_data(item, selectors)
                    if product_data:
                        page_products.append(product_data)
                    else:
                        missing_count += 1
                
                logger.info(f"Extracted {len(page_products)} valid products (missing: {missing_count})")
                all_products.extend(page_products)
                
                # Check if we should stop
                if len(page_products) == 0 or page_no >= self.end_page:
                    logger.info(f"Stopping: page_no={page_no}, end_page={self.end_page}, products_found={len(page_products)}")
                    break
                
                page_no += 1
        
        logger.info("Browser closed")
        logger.info(f"Total products scraped for {self.category_name}: {len(all_products)}")
        
        return all_products



