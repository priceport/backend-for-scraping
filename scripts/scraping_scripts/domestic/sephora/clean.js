const scrapeSephoraCategory = require('../../../../helpers/sephoraScrapeCategory');

const clean = async (start, end, browser) =>
  scrapeSephoraCategory(start, end, browser, {
    urlTemplate: 'https://www.sephora.nz/categories/clean?page=replace_me&view=120',
    subcategory: 'clean',
  });

module.exports = clean;
