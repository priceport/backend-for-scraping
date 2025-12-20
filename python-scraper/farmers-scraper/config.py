#!/usr/bin/env python3
"""
Configuration file for Farmers scrapers
Maps categories to their URLs and subcategories
"""

# Base configuration
HOME_URL = "https://www.farmers.co.nz/"

# Category URL mappings
CATEGORY_URLS = {
    # Beauty - Makeup
    "face": "https://www.farmers.co.nz/beauty/makeup/face",
    "lips": "https://www.farmers.co.nz/beauty/makeup/lips",
    "eyes": "https://www.farmers.co.nz/beauty/makeup/eyes",
    "makeup_bags": "https://www.farmers.co.nz/beauty/makeup/makeup-bags-storage",
    "tools": "https://www.farmers.co.nz/beauty/makeup/makeup-tools",
    "tools2": "https://www.farmers.co.nz/beauty/makeup/makeup-tools-accessories",
    
    # Beauty - Skincare
    "cleansers": "https://www.farmers.co.nz/beauty/skincare/cleansers",
    "moisturizers": "https://www.farmers.co.nz/beauty/skincare/moisturisers",
    "toners": "https://www.farmers.co.nz/beauty/skincare/toners",
    "exfoliators": "https://www.farmers.co.nz/beauty/skincare/exfoliators",
    "eye_cream": "https://www.farmers.co.nz/beauty/skincare/eye-cream",
    "treatments": "https://www.farmers.co.nz/beauty/skincare/treatments",
    "sun_care": "https://www.farmers.co.nz/beauty/skincare/sun-care",
    "wellness_skincare": "https://www.farmers.co.nz/beauty/skincare/wellness-skincare",
    
    # Beauty - Body Care
    "body_care": "https://www.farmers.co.nz/beauty/body-care",
    "bath_care": "https://www.farmers.co.nz/beauty/body-care/bath-care",
    "foot_care": "https://www.farmers.co.nz/beauty/body-care/foot-care",
    "deodorants": "https://www.farmers.co.nz/beauty/body-care/deodorants",
    
    # Beauty - Hair Care
    "hair_care": "https://www.farmers.co.nz/beauty/hair-care",
    "hair_color": "https://www.farmers.co.nz/beauty/hair-care/hair-colour",
    "hair_accesories": "https://www.farmers.co.nz/beauty/hair-care/hair-accessories",
    
    # Beauty - Nails
    "nail_polish": "https://www.farmers.co.nz/beauty/nails/nail-polish",
    "nail_tools": "https://www.farmers.co.nz/beauty/nails/nail-tools",
    
    # Beauty - Fragrance
    "womensPerfume": "https://www.farmers.co.nz/beauty/fragrance/womens-perfume",
    "menAftershave": "https://www.farmers.co.nz/beauty/fragrance/mens-aftershave",
    
    # Beauty - Grooming
    "grooming": "https://www.farmers.co.nz/beauty/grooming",
    
    # Health & Wellness
    "collagen": "https://www.farmers.co.nz/health-wellness/vitamins-supplements/collagen",
}

# Category metadata (for proper data formatting)
CATEGORY_METADATA = {
    "face": {"category": "beauty", "subcategory": "face"},
    "lips": {"category": "beauty", "subcategory": "lips"},
    "eyes": {"category": "beauty", "subcategory": "eyes"},
    "makeup_bags": {"category": "beauty", "subcategory": "makeup"},
    "tools": {"category": "beauty", "subcategory": "makeup_tools"},
    "tools2": {"category": "beauty", "subcategory": "makeup_tools"},
    "cleansers": {"category": "beauty", "subcategory": "cleansers"},
    "moisturizers": {"category": "beauty", "subcategory": "moisturizers"},
    "toners": {"category": "beauty", "subcategory": "toners"},
    "exfoliators": {"category": "beauty", "subcategory": "exfoliators"},
    "eye_cream": {"category": "beauty", "subcategory": "eye_cream"},
    "treatments": {"category": "beauty", "subcategory": "treatments"},
    "sun_care": {"category": "beauty", "subcategory": "sun_care"},
    "wellness_skincare": {"category": "beauty", "subcategory": "wellness_skincare"},
    "body_care": {"category": "beauty", "subcategory": "body_care"},
    "bath_care": {"category": "beauty", "subcategory": "bath_care"},
    "foot_care": {"category": "beauty", "subcategory": "foot_care"},
    "deodorants": {"category": "beauty", "subcategory": "deodorants"},
    "hair_care": {"category": "beauty", "subcategory": "hair_care"},
    "hair_color": {"category": "beauty", "subcategory": "hair_color"},
    "hair_accesories": {"category": "beauty", "subcategory": "hair_accessories"},
    "nail_polish": {"category": "beauty", "subcategory": "nail_polish"},
    "nail_tools": {"category": "beauty", "subcategory": "nail_tools"},
    "womensPerfume": {"category": "beauty", "subcategory": "womens_perfume"},
    "menAftershave": {"category": "beauty", "subcategory": "mens_aftershave"},
    "grooming": {"category": "beauty", "subcategory": "grooming"},
    "collagen": {"category": "health", "subcategory": "collagen"},
}

# Source metadata
SOURCE_INFO = {
    "website_base": "https://www.farmers.co.nz",
    "location": "new-zealand",
    "tag": "domestic"
}
