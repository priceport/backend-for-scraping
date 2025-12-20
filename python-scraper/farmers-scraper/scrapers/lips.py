#!/usr/bin/env python3
"""
Farmers Lips Products Scraper
Standalone scraper for lips category
"""

import sys
import os
import json

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from base_scraper import BaseFarmersScraper
from config import CATEGORY_URLS

def scrape_lips(start_page=1, end_page=1):
    """Scrape lips products"""
    scraper = BaseFarmersScraper(
        category_name='lips',
        base_url=CATEGORY_URLS['lips'],
        start_page=start_page,
        end_page=end_page,
        headless=True
    )
    return scraper.scrape()

if __name__ == "__main__":
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    end = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    products = scrape_lips(start, end)
    
    # Output pure JSON to stdout
    print(json.dumps(products, ensure_ascii=False))

