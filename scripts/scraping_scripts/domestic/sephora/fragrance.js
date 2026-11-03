const scrapeSephoraCategory = require('../../../../helpers/sephoraScrapeCategory');

const fragrance = async (start, end, browser) =>
  scrapeSephoraCategory(start, end, browser, {
    urlTemplate: 'https://www.sephora.nz/categories/fragrance?page=replace_me&view=120',
    subcategory: 'fragrance',
  });

module.exports = fragrance;
