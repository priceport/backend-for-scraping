#!/usr/bin/env python3
"""
Farmers Scraper Package
Modular scraping system for Farmers.co.nz
"""

from .base_scraper import BaseFarmersScraper
from .config import CATEGORY_URLS, CATEGORY_METADATA, SOURCE_INFO

__version__ = "1.0.0"
__all__ = ["BaseFarmersScraper", "CATEGORY_URLS", "CATEGORY_METADATA", "SOURCE_INFO"]


