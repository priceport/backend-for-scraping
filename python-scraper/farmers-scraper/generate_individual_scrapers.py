#!/usr/bin/env python3
"""
Auto-generate individual Python scraper files for all categories
"""

import os
from config import CATEGORY_URLS

TEMPLATE = '''#!/usr/bin/env python3
"""
Farmers {title} Products Scraper
Standalone scraper for {category} category
"""

import sys
import os
import json

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from base_scraper import BaseFarmersScraper
from config import CATEGORY_URLS

def scrape_{category}(start_page=1, end_page=1):
    """Scrape {category} products"""
    scraper = BaseFarmersScraper(
        category_name='{category}',
        base_url=CATEGORY_URLS['{category}'],
        start_page=start_page,
        end_page=end_page,
        headless=True
    )
    return scraper.scrape()

if __name__ == "__main__":
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    end = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    products = scrape_{category}(start, end)
    
    # Output pure JSON to stdout
    print(json.dumps(products, ensure_ascii=False))
'''

def generate_scrapers():
    """Generate individual scraper files for all categories"""
    scrapers_dir = os.path.join(os.path.dirname(__file__), 'scrapers')
    os.makedirs(scrapers_dir, exist_ok=True)
    
    print(f"Generating individual scrapers in {scrapers_dir}/\n")
    
    for category in CATEGORY_URLS.keys():
        title = category.replace('_', ' ').title()
        content = TEMPLATE.format(category=category, title=title)
        
        output_path = os.path.join(scrapers_dir, f'{category}.py')
        with open(output_path, 'w') as f:
            f.write(content)
        
        # Make executable
        os.chmod(output_path, 0o755)
        
        print(f"✓ Generated: {category}.py")
    
    # Create __init__.py
    init_path = os.path.join(scrapers_dir, '__init__.py')
    with open(init_path, 'w') as f:
        f.write('"""\nIndividual category scrapers\nEach file can be run independently or imported\n"""\n')
    
    print(f"\n✓ Generated {len(CATEGORY_URLS)} scraper files!")
    print(f"\nUsage examples:")
    print(f"  python scrapers/face.py 1 1")
    print(f"  python scrapers/lips.py 1 3")

if __name__ == "__main__":
    generate_scrapers()

