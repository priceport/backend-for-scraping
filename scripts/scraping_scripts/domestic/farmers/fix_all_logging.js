const fs = require('fs');
const path = require('path');

const farmersDir = __dirname;
const files = fs.readdirSync(farmersDir).filter(f => f.endsWith('.js') && f !== 'fix_all_logging.js' && f !== 'fix_logging.js');

files.forEach(file => {
  const filePath = path.join(farmersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const subcategory = file.replace('.js', '');
  
  // Remove all duplicate console.logs for page loaded
  content = content.replace(/console\.log\(`✅ Page \$\{page\} loaded successfully`\);?\s*/g, '');
  
  // Remove all duplicate console.logs for product elements
  content = content.replace(/console\.log\(`✅ Product elements found on page \$\{page\}`\);?\s*/g, '');
  
  // Fix goto - add logging after it closes properly
  content = content.replace(
    /(await pageInstance\.goto\(url, \{[\s\S]*?timeout: 60000[\s\S]*?\}\);?)/,
    '$1\n        console.log(`✅ Page ${page} loaded successfully`);'
  );
  
  // Fix waitForSelector - ensure timeout exists and add logging after
  content = content.replace(
    /(await pageInstance\.waitForSelector\(['"]\.product-list-item, \[data-evg-item-id\]['"], \{[\s\S]*?timeout: 30000[\s\S]*?\}\);?)/,
    '$1\n          console.log(`✅ Product elements found on page ${page}`);'
  );
  
  // Fix waitForSelector if timeout is missing
  content = content.replace(
    /await pageInstance\.waitForSelector\(['"]\.product-list-item, \[data-evg-item-id\]['"], \{\s*\}\);?/,
    'await pageInstance.waitForSelector(\'.product-list-item, [data-evg-item-id]\', {\n            timeout: 30000\n          });\n          console.log(`✅ Product elements found on page ${page}`);'
  );
  
  // Remove duplicate completion logs
  const lines = content.split('\n');
  let lastCompletionIndex = -1;
  const filtered = lines.filter((line, i) => {
    if (line.includes('✅ Scraping completed:') || line.includes('✅ Formatted')) {
      if (lastCompletionIndex !== -1 && i - lastCompletionIndex < 3) {
        return false; // Remove if duplicate within 3 lines
      }
      lastCompletionIndex = i;
    }
    return true;
  });
  content = filtered.join('\n');
  
  // Add subcategory name to completion log
  content = content.replace(
    /console\.log\(`✅ (Scraping completed|Formatted).*?products`\);?\s*return formattedProducts;/,
    `console.log(\`✅ ${subcategory} scraping completed: \${formattedProducts.length} products\`);\n    return formattedProducts;`
  );
  
  // Add error logging in catch block if missing
  if (!content.includes('console.log(`❌ Error on page')) {
    content = content.replace(
      /(\s+} catch \(err\) \{)/,
      '$1\n        console.log(`❌ Error on page ${page}: ${err.message}`);'
    );
  }
  
  // Add formatting summary if missing
  if (!content.includes('📊 Total products collected:')) {
    content = content.replace(
      /(const formattedProducts = allProducts\.map)/,
      'console.log(`📊 Total products collected: ${allProducts.length}`);\n    console.log(`🔄 Formatting ${allProducts.length} products...`);\n    $1'
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${file}`);
});

console.log('All files fixed!');

