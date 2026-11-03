const scrapeSephoraCategory = require('../../../../helpers/sephoraScrapeCategory');

const skincare = async (start, end, browser) =>
  scrapeSephoraCategory(start, end, browser, {
    urlTemplate: 'https://www.sephora.nz/categories/skincare?page=replace_me&view=120',
    subcategory: 'skincare',
  });

module.exports = skincare;
