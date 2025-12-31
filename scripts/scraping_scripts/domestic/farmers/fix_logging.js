const fs = require('fs');
const path = require('path');

const farmersDir = __dirname;
const files = fs.readdirSync(farmersDir).filter(f => f.endsWith('.js') && f !== 'fix_logging.js');

files.forEach(file => {
  const filePath = path.join(farmersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract subcategory from file name
  const subcategory = file.replace('.js', '');
  
  // Fix goto logging - remove from inside options, add after
  content = content.replace(
    /await pageInstance\.goto\(url, \{[\s\S]*?timeout: 60000[\s\S]*?\}\);?/,
    (match) => {
      if (match.includes('console.log')) {
        return match.replace(/console\.log\([^)]+\);?\s*/g, '').replace(/\);?\s*$/, ');\n        console.log(`✅ Page ${page} loaded successfully`);');
      }
      return match.replace(/\);?\s*$/, ');\n        console.log(`✅ Page ${page} loaded successfully`);');
    }
  );
  
  // Fix waitForSelector - remove from inside, add after
  content = content.replace(
    /await pageInstance\.waitForSelector\([^)]+\{[\s\S]*?timeout: 30000[\s\S]*?\}\);?/,
    (match) => {
      if (match.includes('console.log')) {
        return match.replace(/console\.log\([^)]+\);?\s*/g, '').replace(/\);?\s*$/, ');\n          console.log(`✅ Product elements found on page ${page}`);');
      }
      return match.replace(/\);?\s*$/, ');\n          console.log(`✅ Product elements found on page ${page}`);');
    }
  );
  
  // Remove duplicate completion logs
  const lines = content.split('\n');
  const seen = new Set();
  const filtered = lines.filter((line, i) => {
    if (line.includes('✅ Scraping completed:') || line.includes('✅ Formatted')) {
      if (seen.has('completion')) {
        return false;
      }
      seen.add('completion');
    }
    return true;
  });
  content = filtered.join('\n');
  
  // Add subcategory-specific completion log before return
  if (!content.includes(`✅ ${subcategory} scraping completed:`)) {
    content = content.replace(
      /(console\.log\(`✅ (Scraping completed|Formatted).*?\);?\s*return formattedProducts;)/,
      `console.log(\`✅ ${subcategory} scraping completed: \${formattedProducts.length} products\`);\n    $1`
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});

console.log('All files fixed!');

