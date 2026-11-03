const scrapeSephoraCategory = require('../../../../helpers/sephoraScrapeCategory');

const hair = async (start, end, browser) =>
  scrapeSephoraCategory(start, end, browser, {
    urlTemplate: 'https://www.sephora.nz/categories/hair?page=replace_me&view=120',
    subcategory: 'hair',
  });

module.exports = hair;
