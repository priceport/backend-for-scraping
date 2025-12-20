#!/usr/bin/env python3
"""
Main Farmers Scraper
Universal scraper that can handle any Farmers category
"""

import sys
import json
import logging
from typing import List, Dict

from base_scraper import BaseFarmersScraper
from config import CATEGORY_URLS, CATEGORY_METADATA

logger = logging.getLogger(__name__)


class FarmersScraper:
    """
    Universal Farmers scraper that works for any category
    """
    
    def __init__(self, category: str, start_page: int = 1, end_page: int = 1, headless: bool = True):
        """
        Initialize scraper for a specific category
        
        Args:
            category: Category name (e.g., 'face', 'lips', 'makeup_bags')
            start_page: Starting page number
            end_page: Ending page number
            headless: Run in headless mode
        """
        if category not in CATEGORY_URLS:
            raise ValueError(f"Unknown category: {category}. Available: {', '.join(CATEGORY_URLS.keys())}")
        
        self.category = category
        self.url = CATEGORY_URLS[category]
        self.metadata = CATEGORY_METADATA.get(category, {"category": "beauty", "subcategory": category})
        
        # Initialize base scraper
        self.scraper = BaseFarmersScraper(
            category_name=category,
            base_url=self.url,
            start_page=start_page,
            end_page=end_page,
            headless=headless
        )
    
    def scrape(self) -> List[Dict]:
        """
        Scrape products for the category
        
        Returns:
            List of product dictionaries
        """
        return self.scraper.scrape()


def main():
    """
    CLI entry point
    Usage: python scraper.py <category> <start_page> <end_page>
    Example: python scraper.py face 1 3
    """
    if len(sys.argv) < 2:
        print("Usage: python scraper.py <category> <start_page> <end_page>")
        print(f"Available categories: {', '.join(sorted(CATEGORY_URLS.keys()))}")
        sys.exit(1)
    
    category = sys.argv[1]
    start_page = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    end_page = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    
    try:
        scraper = FarmersScraper(category, start_page, end_page, headless=True)
        products = scraper.scrape()
        
        # Output pure JSON to stdout (for Node.js integration)
        print(json.dumps(products, ensure_ascii=False))
        
        # Also save debug file
        output_file = f"farmers_{category}_products.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        logger.info(f"Debug file saved: {output_file}")
        
    except ValueError as e:
        logger.error(str(e))
        sys.exit(1)
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()



