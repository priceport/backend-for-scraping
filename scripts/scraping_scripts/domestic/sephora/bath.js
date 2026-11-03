const scrapeSephoraCategory = require('../../../../helpers/sephoraScrapeCategory');

const bath = async (start, end, browser) =>
  scrapeSephoraCategory(start, end, browser, {
    urlTemplate: 'https://www.sephora.nz/categories/bath-and-body?page=replace_me&view=120',
    subcategory: 'bath',
  });

module.exports = bath;
