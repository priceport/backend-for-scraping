const scrapeSephoraCategory = require('../../../../helpers/sephoraScrapeCategory');

const makeup = async (start, end, browser) =>
  scrapeSephoraCategory(start, end, browser, {
    urlTemplate: 'https://www.sephora.nz/categories/makeup?page=replace_me&view=120',
    subcategory: 'makeup',
  });

module.exports = makeup;
