const scrapeSephoraCategory = require('../../../../helpers/sephoraScrapeCategory');

const tools = async (start, end, browser) =>
  scrapeSephoraCategory(start, end, browser, {
    urlTemplate: 'https://www.sephora.nz/categories/tools-and-brushes?page=replace_me&view=120',
    subcategory: 'tools',
  });

module.exports = tools;
