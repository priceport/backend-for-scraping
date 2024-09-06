const scrapeAelia = require("./scrapeAelia");
const scrapeAeliaQueensland = require("./scrapeAeliaQueensland");

const scrapingService =async ()=>{
   //scraping engine logic
   console.log("scraping");
   // await scrapeAelia();
   await scrapeAeliaQueensland();
}

module.exports = scrapingService;